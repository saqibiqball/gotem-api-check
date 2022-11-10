const { Op } = require('sequelize');
const ApiError = require('../exceptions/ApiError');
const fileService = require('./file.service');
const milestoneService = require('./milestone.service');
const missionService = require('./mission.service');
const sequelize = require('../database');
const {
	Proposals,
	ProposalStatuses,
	Users,
	Missions,
	UserSkills,
	Milestones,
	Evidences,
	Categories,
	MilestoneStatuses,
	EvidencesFiles,
	UserReview,
} = require('../database').models;

class ProposalService {
	async test() {
		return 'test';
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

			// switch (key) {
			// 	case 'uploaded_missionFiles':
			// 		await MissionFiles.bulkCreate(filesArray);
			// 		break;
			// }
		}
	}

	async deleteFiles(data, filePath) {
		const deletedObj = JSON.parse(data);
		for (let key of Object.keys(deletedObj)) {
			let files = [];
			// switch (key) {
			// 	case 'missionFiles':
			// 		files = await MissionFiles.findAll({
			// 			where: { id: deletedObj[key] },
			// 		});
			// 		await MissionFiles.destroy({ where: { id: files.map((i) => i.id) } });
			// 		break;
			// }
			files.forEach((file) => {
				fileService.deleteFile(filePath, file.name);
			});
		}
	}

	async getAllProperties() {
		const statuses = await ProposalStatuses.findAll();
		return { statuses };
	}

	async add(data, sender) {
		return await sequelize.transaction(async (t) => {
			const objToCreateProposal = {};
			Object.keys(data).forEach((key) => {
				if (key !== 'milestones') {
					data[key] !== 'null'
						? (objToCreateProposal[key] = data[key])
						: (objToCreateProposal[key] = null);
				}
			});
			objToCreateProposal.userId = sender.id;
			objToCreateProposal.statusId = 1;

			const newProposal = await Proposals.create(objToCreateProposal, { transaction: t });
				console.log("------newpro",newProposal)
			if (data.milestones.length > 0) {
				console.log("++++++milestone",data.milestones)
				await milestoneService.add(data.milestones, newProposal.id, { transaction: t })
			}

			return newProposal;
		});
	}

	async update(data, user) {
		const { id } = data;
		let whereProposal = { id };

		return await sequelize.transaction(async (t) => {
			if (user.role === 'source') {
				whereProposal = { id, userId: user.id };
			}

			if (user.role === 'user') {
				await missionService.getOneMission(data.missionId, user, false, { transaction: t });
			}

			const proposal = await Proposals.findOne({
				where: whereProposal,
			});

			if (!proposal) {
				throw ApiError.badRequest(`Proposal was not find`);
			}

			for (let key of Object.keys(data)) {
				if (key !== 'milestones') {
					data[key] !== 'null' ? (proposal[key] = data[key]) : (proposal[key] = null);
				}
			}

			if (data.milestones && data.milestones.length > 0) {
				await milestoneService.update(data.milestones, proposal.id, { transaction: t });
			} else {
				await milestoneService.deleteAll(proposal.id, { transaction: t });
			}

			await proposal.save({ transaction: t });

			return proposal;
		});
	}

	async getOne(id, user, active = false) {
		let whereProposal = { id };
		if (user.role === 'user') {
			const userMission = await Missions.findAll({
				where: { userId: user.id },
				attributes: ['id'],
				raw: true,
			});
			whereProposal = { id, missionId: userMission.map((m) => m.id) };
			if (active) {
				whereProposal.statusId = [2, 4];
			}
		}

		if (user.role === 'source') {
			whereProposal = { id, userId: user.id };
		}

		const proposal = await Proposals.findOne({
			where: whereProposal,
			include: [
				{
					model: Users,
					as: 'user',
					required: false,
					attributes: [
						'id',
						'photo',
						'firstName',
						'lastName',
						'email',
						'location',
						'slug',
						'rating',
						'hourlyRate',
					],
					include: [{ model: UserSkills, as: 'skills', separate: true }],
				},
				{
					model: Milestones,
					as: 'milestones',
					include: [
						{
							model: Evidences,
							as: 'evidences',
							include: [{ model: EvidencesFiles, as: 'evidenceFiles' }],
						},
						{ model: MilestoneStatuses, as: 'status' },
					],
					separate: true,
				},
				{ model: ProposalStatuses, as: 'status' },
				{
					model: Missions,
					as: 'mission',

					include: [
						{
							model: Users,
							as: 'user',
							required: false,
							attributes: [
								'id',
								'photo',
								'firstName',
								'lastName',
								'email',
								'location',
								'slug',
								'rating',
								'hourlyRate',
								'activationLink',
							],
						},
						{ model: Categories, as: 'cats' },
						{
							model: UserReview,
							as: 'review',
							where: { userId: user.id },
							required: false,
						},
					],
				},
			],
		});

		if (!proposal) {
			throw ApiError.badRequest('Proposal not found');
		}
		return proposal;
	}

	async getOneByWhere(where, transaction = {}) {
		return await Proposals.findOne({ where, ...transaction });
	}

	async getAll(params, user) {
		const { userId, missionId, sort, statusId, limit = 10, page = 1 } = params;
		let offset = +page * +limit - +limit;
		const whereProposals = {};
		let mission;
		let orderVal;
		let includeModels = [
			{
				model: Users,
				as: 'user',
				required: false,
				attributes: [
					'id',
					'photo',
					'firstName',
					'lastName',
					'email',
					'location',
					'slug',
					'rating',
					'hourlyRate',
				],
				include: [{ model: UserSkills, as: 'skills', separate: true }],
			},
			{ model: ProposalStatuses, as: 'status' },
		];

		switch (user.role) {
			case 'source':
				whereProposals['userId'] = user.id;
				includeModels.push({
					model: Missions,
					as: 'mission',
					include: [
						{
							model: Users,
							as: 'user',
							required: false,
							attributes: [
								'id',
								'photo',
								'firstName',
								'lastName',
								'email',
								'location',
								'slug',
								'rating',
								'hourlyRate',
							],
						},
					],
				});
				break;
			case 'user':
				mission = await Missions.findOne({
					where: { id: missionId },
					attributes: ['userId'],
				});
				if (user.id === mission.userId) {
					whereProposals['missionId'] = missionId;
					whereProposals['statusId'] = { [Op.not]: 5 };
				} else {
					return { rows: [], count: 0 };
				}
				break;
			case 'admin':
				if (userId) whereProposals['userId'] = userId;
				if (missionId) whereProposals['missionId'] = missionId;
				break;
			default:
				return { rows: [], count: 0 };
		}

		switch (sort) {
			case 'newest':
				orderVal = [['createdAt', 'DESC']];
				break;
			case 'oldest':
				orderVal = [['createdAt', 'ASC']];
				break;
			default:
				orderVal = [];
		}

		if (statusId) {
			whereProposals['statusId'] = statusId;
		}

		const { rows, count } = await Proposals.findAndCountAll({
			where: whereProposals,
			include: includeModels,
			distinct: true,
			limit: +limit,
			offset: +offset,
			order: orderVal,
		});
		return { rows, count };
	}

	async downloadZip(loadLink, folderLink) {
		return await fileService.generateZipForPath(loadLink, folderLink);
	}

	async delete() {}
}

module.exports = new ProposalService();
