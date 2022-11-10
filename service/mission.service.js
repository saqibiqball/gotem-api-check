const uuid = require('uuid');
const fileService = require('./file.service');
const ApiError = require('../exceptions/ApiError');
const { Op, where, fn, col } = require('sequelize');
const checkIfInRadius = require('../utils/checkIfInRadius');
const {
	MissionType,
	MissionFundingType,
	Categories,
	Missions,
	MissionFiles,
	MissionCategories,
	Users,
	BookmarkedMissions,
	Proposals,
} = require('../database').models;

class MissionsService {
	async getAllPropertiesOfMission() {
		const missionTypes = await MissionType.findAll();
		const missionFundingTypes = await MissionFundingType.findAll();
		const missionCategories = await Categories.findAll();
		const rateMin = await Missions.min('estimatedBudget');
		const rateMax = await Missions.max('estimatedBudget');
		return { missionTypes, missionFundingTypes, missionCategories, rateMin, rateMax };
	}

	async addMission(data, files, filePath, userId) {
		const activationLink = uuid.v4();
		const objToCreateMission = {};
		const arrToCreateMissionCategory = [];
		const userLink = data.userActivationLink;

		objToCreateMission.activationLink = activationLink;
		objToCreateMission.userId = userId;

		Object.keys(data).forEach((key) => {
			if (key !== 'catId') {
				data[key] !== 'null'
					? (objToCreateMission[key] = data[key])
					: (objToCreateMission[key] = null);
			}
		});

		const newMission = await Missions.create(objToCreateMission);

		fileService.createDir(filePath, userLink + '/' + activationLink);

		if ('catId' in data && data.catId.length) {
			data.catId.split(',').forEach((cat) => {
				arrToCreateMissionCategory.push({
					missionId: newMission.id,
					catId: +cat,
				});
			});
			await MissionCategories.bulkCreate(arrToCreateMissionCategory);
		}

		fileService.createDir(filePath, userLink + '/' + activationLink);

		if (Object.keys(files).length > 0) {
			await this.uploadMissionFiles(
				{ id: newMission.id, activationLink, userLink },
				files,
				filePath
			);
		}
		return newMission;
	}

	async updateMission(data, files, filePath, user) {
		let whereMission = { id: +data.id };

		if (user.role !== 'admin') {
			whereMission = { id: +data.id, userId: user.id };
		}

		const mission = await Missions.findOne({ where: whereMission });

		if (!mission) {
			throw ApiError.badRequest(`Mission was not find`);
		}

		const userLink = data.userActivationLink;
		const arrToCreateMissionCategory = [];
		let deleteFiles = '';

		for (let key of Object.keys(data)) {
			if (key !== 'catId' || key !== 'toDelete') {
				data[key] !== 'null' ? (mission[key] = data[key]) : (mission[key] = null);
			}
		}

		if ('catId' in data && data.catId.length) {
			data.catId.split(',').forEach((cat) => {
				arrToCreateMissionCategory.push({
					missionId: mission.id,
					catId: +cat,
				});
			});
			await MissionCategories.destroy({ where: { missionId: mission.id } });
			await MissionCategories.bulkCreate(arrToCreateMissionCategory);
		}

		if ('toDelete' in data) {
			deleteFiles = data.toDelete;
		}

		if (Object.keys(files).length > 0) {
			await this.uploadMissionFiles(
				{ id: mission.id, activationLink: mission.activationLink, userLink },
				files,
				filePath
			);
		}

		if (deleteFiles.length > 0) {
			await this.deleteFiles(deleteFiles, filePath);
		}

		await mission.save();
		await mission.reload();
		return mission;
	}

	async uploadMissionFiles(mission, files, filePath) {
		for (let key of Object.keys(files)) {
			const filesArray = [];

			if (!Array.isArray(files[key])) {
				files[key] = [files[key]];
			}

			if (files[key].length > 0) {
				files[key].forEach((file) => {
					filesArray.push({
						name: mission.userLink + '/' + mission.activationLink + '/' + file.name,
						missionId: mission.id,
					});
					fileService.saveFile(
						file,
						filePath + '/' + mission.userLink + '/' + mission.activationLink,
						file.name
					);
				});
			}

			switch (key) {
				case 'uploaded_missionFiles':
					await MissionFiles.bulkCreate(filesArray);
					break;
			}
		}
	}

	async deleteFiles(data, filePath) {
		const deletedObj = JSON.parse(data);
		for (let key of Object.keys(deletedObj)) {
			let files = [];
			switch (key) {
				case 'missionFiles':
					files = await MissionFiles.findAll({
						where: { id: deletedObj[key] },
					});
					await MissionFiles.destroy({ where: { id: files.map((i) => i.id) } });
					break;
			}
			files.forEach((file) => {
				fileService.deleteFile(filePath, file.name);
			});
		}
	}

	async getOneByWhere(data, transaction = {}) {
		return await Missions.findOne({
			where: data,
			...transaction,
		});
	}

	async getOneMission(id, user = {}, isPublic = true, transaction = {}) {
		let missionAttributes = {};
		let whereMission = { id };

		if (Object.keys(user).length > 0) {
			if (user.role === 'user') {
				whereMission = { id, userId: user.id };
			}
		}

		let missionIncludes = [
			{
				model: Users,
				as: 'user',
				attributes: [
					'id',
					'firstName',
					'lastName',
					'slug',
					'photo',
					'location',
					'rating',
					'administartiveArea',
					'userLicense',
					'activationLink',
				],
			},
			{ model: Categories, as: 'cats' },
			{ model: MissionFiles, as: 'missionFiles' },
		];
		if (isPublic) {
			missionAttributes = { exclude: ['activationLink'] };
		}

		const mission = await Missions.findOne({
			where: { ...whereMission },
			attributes: missionAttributes,
			include: missionIncludes,
			...transaction,
		});

		if (!mission) {
			throw ApiError.badRequest('Mission not found');
		}
		return mission;
	}

	async getAllMissions(queryParams) {
		let {
			radius = 0,
			locationLat,
			locationLng,
			categories,
			fundingType,
			missionType,
			rateMin,
			rateMax,
			sort,
			dateFrom = null,
			dateTo = null,
			page,
			limit,
			userId,
			search = '',
			// country,
			// licensed,
		} = queryParams;

		let offset = +page * +limit - +limit;

		const whereUsers = {};
		const whereMission = {};
		let whereCats = {
			required: false,
		};

		if (search) {
			search = search.toLowerCase();
		}

		if (dateFrom && dateTo) {
			whereMission['createdAt'] = { [Op.between]: [new Date(dateFrom), new Date(dateTo)] };
		}

		if (fundingType) {
			whereMission['missionFundingTypeId'] = fundingType;
		}

		if (missionType) {
			whereMission['missionTypeId'] = missionType;
		}

		if (rateMin && !rateMax) {
			whereMission['estimatedBudget'] = { [Op.gte]: rateMin };
		}

		if (!rateMin && rateMax) {
			whereMission['estimatedBudget'] = { [Op.lte]: rateMax };
		}

		if (rateMin && rateMax) {
			whereMission['estimatedBudget'] = { [Op.between]: [rateMin, rateMax] };
		}

		if (categories) {
			whereCats = {
				required: true,
				where: { id: categories },
			};
		}

		if (userId) {
			whereUsers['id'] = userId;
		}

		let orderVal;
		switch (sort) {
			case 'rated':
				orderVal = [{ model: Users, as: 'user' }, 'rating', 'DESC'];
				break;
			case 'new':
				orderVal = ['createdAt', 'DESC'];
				break;
			case 'old':
				orderVal = ['createdAt', 'ASC'];
				break;
			case 'high_price':
				orderVal = ['estimatedBudget', 'DESC'];
				break;
			case 'low_price':
				orderVal = ['estimatedBudget', 'ASC'];
				break;
			default:
				orderVal = ['createdAt', 'DESC'];
		}

		const needMissions = await Missions.findAll({
			where: {
				...whereMission,
				[Op.and]: [
					{
						[Op.or]: [where(fn('lower', col('title')), 'LIKE', `%${search}%`)],
					},
				],
			},
			include: [
				{ model: Users, as: 'user', attributes: ['id'], where: { ...whereUsers } },
				{
					model: Categories,
					as: 'cats',
					attributes: ['id'],
					...whereCats,
				},
			],
			distinct: true,
			separate: true,
		});
		const missionsIds = [];
		needMissions.forEach((mission) => {
			if (+radius > 0) {
				if (
					checkIfInRadius(
						{ lat: mission.locationLat, lng: mission.locationLng },
						{ lat: +locationLat, lng: +locationLng },
						+radius
					)
				) {
					missionsIds.push(mission.id);
				}
			} else {
				missionsIds.push(mission.id);
			}
		});

		const { rows, count } = await Missions.findAndCountAll({
			where: { id: missionsIds },
			include: [
				{
					model: Users,
					as: 'user',
					attributes: [
						'photo',
						'id',
						'email',
						'firstName',
						'slug',
						'lastName',
						'location',
						'rating',
						'countReviews',
					],
				},
				{
					model: Categories,
					as: 'cats',
					attributes: ['id', 'name', 'slug'],
				},
				{
					model: MissionType,
					as: 'missionType',
				},
				{
					model: MissionFundingType,
					as: 'missionFundingType',
				},
			],
			separate: true,
			distinct: true,
			limit: +limit,
			offset: +offset,
			order: [orderVal],
		});
		return { rows, count };
	}

	async getAllMissionsWithOutQuery() {
		return await Missions.findAll({
			include: [{ model: Users, as: 'user', attributes: ['id', 'lastName', 'firstName'] }],
			attributes: ['id', 'title', 'locationLat', 'locationLng'],
		});
	}

	async deleteMission(id, user) {
		let whereMission = { where: { id, userId: user.id } };
		if (user.role === 'admin') {
			whereMission = { where: { id } };
		}
		return await Missions.destroy(whereMission);
	}

	async addToFavorites(userId, missionId) {
		const check = await BookmarkedMissions.findOne({
			where: { userId, missionId },
		});

		if (check) {
			await BookmarkedMissions.destroy({ where: { id: check.id } });
		} else {
			await BookmarkedMissions.create({ userId, missionId });
		}

		return await BookmarkedMissions.findAll({
			where: { userId },
			include: [
				{
					model: Missions,
					as: 'mission',
					include: [
						{
							model: Users,
							as: 'user',
							attributes: [
								'id',
								'firstName',
								'lastName',
								'slug',
								'photo',
								'location',
								'rating',
							],
						},
					],
				},
			],
		});
	}

	async checkHasProposal(id, user) {
		const mission = await Proposals.findOne({
			where: { missionId: id, userId: user.id },
		});

		return !!mission;
	}
}

module.exports = new MissionsService();
