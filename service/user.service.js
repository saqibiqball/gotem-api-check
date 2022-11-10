const uuid = require('uuid');
const { Op, fn, col, where } = require('sequelize');
const tokenService = require('../service/token.service');
const fileService = require('../service/file.service');
const mailService = require('../service/mail.service');
const proposalService = require('../service/proposal.service');
const missionService = require('../service/mission.service');
const cryptoService = require('../service/crypto.service');
const ApiError = require('../exceptions/ApiError');
const checkIfInRadius = require('../utils/checkIfInRadius');
const sequelize = require('../database');
const {
	Users,
	UserRoles,
	UserFiles,
	UserFiles2,
	UserFiles3,
	UserStatuses,
	UserSkills,
	BookmarkedUsers,
	BookmarkedMissions,
	UserEmployment,
	Missions,
	Categories,
	MissionCategories,
	UsersCategories,
	UserReview,
	Proposals,
} = require('../database').models;

class UserService {
	async getAllPropertiesOfUsers() {
		const rateMin = await Users.min('hourlyRate', { where: { roleId: 3 } });
		const rateMax = await Users.max('hourlyRate', { where: { roleId: 3 } });
		const categories = await Categories.findAll();
		return { rateMin, rateMax, categories };
	}

	async getAllUsersInList() {
		return await Users.findAll({
			where: { statusId: 1 },
			attributes: ['id', 'nickName', 'availableBalance'],
			order: [['nickName', 'ASC']],
			separated: true,
		});
	}

	async registration(data, files, filePath) {
		const candidate = await Users.findOne({ where: { email: data.email } });

		if (candidate) {
			throw ApiError.badRequest(`User with this ${data.email} already exists`);
		}

		const activationLink = uuid.v4();
		const hashPassword = cryptoService.hashPwd(data.password);
		let newFileNamePhoto;
		if (Object.keys(files).length > 0) {
			newFileNamePhoto = uuid.v4() + '.' + files.photo.name.split('.').pop();
		}

		const user = await Users.create({
			nickName: data.nickName,
			photo: activationLink + '/' + newFileNamePhoto,
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			locationLat: data.locationLat,
			locationLng: data.locationLng,
			location: data.location,
			country: data.country,
			countryShortName: data.countryShortName,
			city: data.city,
			administartiveArea: data.administartiveArea,
			password: hashPassword,
			slug: data.nickName,
			activationLink: activationLink,
			roleId: data.roles,
			statusId: 3,
		});
		fileService.createDir(filePath, activationLink);
		if (Object.keys(files).length > 0) {
			fileService.saveFile(files.photo, filePath + '/' + activationLink, newFileNamePhoto);
		}
		await mailService.sendConfirmEmailMail(
			data.email,
			`${process.env.API_URL}api/user/confirm-email/${activationLink}`
		);

		return { firstName: user.firstName, lastName: user.lastName };
	}

	async login(email, password) {
		const user = await this.getOneUser(email, false, 'email', true);

		if (!user) {
			throw ApiError.badRequest('Wrong password or email');
		}
		if (!user.confirmEmail) {
			throw ApiError.badRequest('You are not confirm your email');
		}

		if (user.statusId === 3) {
			throw ApiError.badRequest('Your account is pending');
		}

		const validPassword = cryptoService.checkPwd(password, user.password);
		if (!validPassword) {
			throw ApiError.badRequest('Wrong password or email');
		}

		return {
			token: tokenService.generateAccessToken({
				id: user.id,
				email: user.email,
				role: user.roles.name,
				slug: user.slug,
			}),
			user,
		};
	}

	async check(email) {
		const user = await this.getOneUser(email, false, 'email', false);

		if (!user) {
			throw ApiError.badRequest('User not found');
		}

		return {
			token: tokenService.generateAccessToken({
				id: user.id,
				email: user.email,
				role: user.roles.name,
				slug: user.slug,
			}),
			user,
		};
	}

	async confirmEmail(activationLink) {
		const user = await Users.findOne({ where: { activationLink } });
		if (!user) {
			throw ApiError.badRequest('Incorrect activation link');
		}
		user.confirmEmail = true;
		await user.save();
	}

	async userVerification(data, filesData, filePath) {
		const { link, licenseID } = data;
		let files;
		let files2;
		let files3 = [];

		if (filesData.files) {
			if (Array.isArray(filesData.files)) {
				files = [...filesData.files];
			} else {
				files = [filesData.files];
			}
		}

		if (filesData.files2) {
			if (Array.isArray(filesData.files2)) {
				files2 = [...filesData.files2];
			} else {
				files2 = [filesData.files2];
			}
		}

		if (filesData.files3) {
			if (Array.isArray(filesData.files3)) {
				files3 = [...filesData.files3];
			} else {
				files3 = [filesData.files3];
			}
		}

		const user = await Users.findOne({ where: { activationLink: link } });
		if (!user) {
			throw ApiError.badRequest('This user doesnt exist');
		}
		const filesArray = [];
		const filesArray2 = [];
		const filesArray3 = [];

		if (files.length > 0) {
			files.forEach((file) => {
				const newFileName = uuid.v4() + '.' + file.name.split('.').pop();
				filesArray.push({ name: user.activationLink + '/' + newFileName, userId: user.id });
				fileService.saveFile(file, filePath + '/' + user.activationLink, newFileName);
			});
		}
		await UserFiles.bulkCreate(filesArray);

		if (files2.length > 0) {
			files2.forEach((file) => {
				const newFileName = uuid.v4() + '.' + file.name.split('.').pop();
				filesArray2.push({
					name: user.activationLink + '/' + newFileName,
					userId: user.id,
				});
				fileService.saveFile(file, filePath + '/' + user.activationLink, newFileName);
			});
		}
		await UserFiles2.bulkCreate(filesArray2);

		if (files3.length > 0) {
			files3.forEach((file) => {
				const newFileName = uuid.v4() + '.' + file.name.split('.').pop();
				filesArray3.push({
					name: user.activationLink + '/' + newFileName,
					userId: user.id,
				});
				fileService.saveFile(file, filePath + '/' + user.activationLink, newFileName);
			});
		}
		await UserFiles3.bulkCreate(filesArray3);

		user.userLicense = licenseID;
		await user.save();
	}

	async lostPassword(email) {
		const user = await Users.findOne({ where: { email } });
		if (!user) {
			throw ApiError.badRequest('Invalid email');
		}
		await mailService.sendResetPasswordLink(
			user.email,
			'Link to create a new password',
			`${process.env.CLIENT_URL}change-password/?link=${user.activationLink}`
		);
	}

	async resetPassword(link, password) {
		const user = await Users.findOne({ where: { activationLink: link } });
		if (!user) {
			throw ApiError.badRequest('Invalid activation link');
		}
		user.password = cryptoService.hashPwd(password);
		await user.save();
	}

	async isSourcer(link) {
		const user = await Users.findOne({
			where: { activationLink: link },
			attributes: ['roleId', 'countryShortName'],
			raw: true,
		});
		return (
			user.roleId === 3 &&
			(user.countryShortName === 'US' ||
				user.countryShortName === 'UK' ||
				user.countryShortName === 'AE')
		);
	}

	async getOneUser(userIdentificate, isPublic = false, key, isLogin = false) {
		let userAttributes = [];
		let userIncludes = [];

		if (isPublic) {
			userAttributes = [
				'id',
				'photo',
				'nickName',
				'firstName',
				'lastName',
				'confirmEmail',
				'email',
				'locationLat',
				'locationLng',
				'location',
				'country',
				'userLicense',
				'city',
				'countryShortName',
				'administartiveArea',
				'bio',
				'hourlyRate',
				'jobTitle',
				'showJobTitle',
			];
			userIncludes = [
				{ model: UserSkills, as: 'skills' },
				{ model: UserEmployment, as: 'employments' },
				// {
				// 	model: Proposals,
				// 	as: 'proposals',
				// 	where: { statusId: [2, 4] },
				// 	attributes: ['missionId'],
				// 	include: [
				// 		{
				// 			model: Missions,
				// 			as: 'mission',
				// 			attributes: ['title'],
				// 			include: [{ model: UserReview, as: 'review'}],
				// 		},
				// 	],
				// },
			];
		} else {
			userAttributes = [
				'id',
				'photo',
				'nickName',
				'hourlyRate',
				'firstName',
				'lastName',
				'confirmEmail',
				'email',
				'password',
				'roleId',
				'userLicense',
				'activationLink',
				'slug',
				'locationLat',
				'locationLng',
				'location',
				'country',
				'countryShortName',
				'city',
				'bio',
				'alternativeEmail',
				'jobTitle',
				'showJobTitle',
				'statusId',
				'customerId',
				'pendingBalance',
				'availableBalance',
			];
			userIncludes = [
				{ model: UserRoles, as: 'roles' },
				{ model: UserSkills, as: 'skills' },
				{ model: UserEmployment, as: 'employments' },
				{ model: Categories, as: 'cats' },
				{
					model: BookmarkedUsers,
					as: 'bookmarks',
					separate: true,
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
								'countryShortName',
								'rating',
							],
						},
					],
				},
				{
					model: BookmarkedMissions,
					as: 'missionBookmarks',
					separate: true,
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
				},
				{ model: UserFiles, as: 'files', separate: true },
				{ model: UserFiles2, as: 'selfyFiles', separate: true },
				{ model: UserFiles3, as: 'licenseFiles', separate: true },
				{ model: UserStatuses, as: 'statuses' },
				{ model: UserSkills, as: 'skills' },
			];
		}

		const user = await Users.findOne({
			where: { [key]: userIdentificate },
			attributes: userAttributes,
			include: userIncludes,
		});
		if (!user && !isLogin) {
			throw ApiError.badRequest('User not found');
		}
		return user;
	}

	async getAllUsers(ownerId, queryParams) {
		let {
			status = '',
			search = '',
			dateFrom = null,
			dateTo = null,
			role = '',
			page = 1,
			limit = 10,
		} = queryParams;

		if (search) {
			search = search.toLowerCase();
		}
		let offset = +page * +limit - +limit;

		const whereUser = {};
		const whereUserRole = {};
		const whereUserStatuses = {};

		if (dateFrom && dateTo) {
			whereUser['createdAt'] = { [Op.between]: [new Date(dateFrom), new Date(dateTo)] };
		}

		if (status.length) {
			whereUserStatuses['name'] = status;
		}

		if (role.length) {
			whereUserRole['name'] = role;
		}

		const { rows, count } = await Users.findAndCountAll({
			where: {
				id: { [Op.not]: ownerId },
				...whereUser,
				[Op.and]: [
					{
						[Op.or]: [
							where(fn('lower', col('firstName')), 'LIKE', `%${search}%`),
							where(fn('lower', col('lastName')), 'LIKE', `%${search}%`),
							where(fn('lower', col('nickName')), 'LIKE', `%${search}%`),
							where(fn('lower', col('email')), 'LIKE', `%${search}%`),
						],
					},
				],
			},
			include: [
				{ model: UserRoles, as: 'roles', where: whereUserRole },
				{ model: UserStatuses, as: 'statuses', where: whereUserStatuses },
				{ model: UserFiles, as: 'files' },
				{ model: UserFiles2, as: 'selfyFiles' },
			],
			distinct: true,
			limit: !search ? +limit : null,
			offset: !search ? +offset : null,
		});
		return { rows, count };
	}

	async getAllSources(queryParams) {
		const {
			country,
			rating,
			rateMin,
			rateMax,
			categories,
			// sourceType,
			locationLng,
			locationLat,
			page,
			sort,
			radius,
			limit,
		} = queryParams;
		let offset = +page * +limit - +limit;

		const whereUser = {};
		const whereCats = {};
		let requiredCats = false;

		if (categories) {
			whereCats['id'] = categories;
			requiredCats = true;
		}
		if (country) {
			whereUser['country'] = country;
		}
		if (rating) {
			whereUser['rating'] = { [Op.gte]: +rating };
		}
		if (rateMin && !rateMax) {
			whereUser['hourlyRate'] = { [Op.gte]: +rateMin };
		}
		if (!rateMin && rateMax) {
			whereUser['hourlyRate'] = { [Op.lte]: +rateMax };
		}
		if (rateMin && rateMax) {
			whereUser['hourlyRate'] = { [Op.between]: [+rateMin, +rateMax] };
		}

		let orderVal = [];
		switch (sort) {
			case 'raiting':
				orderVal = [['rating', 'DESC']];
				break;
			case 'newest':
				orderVal = [['createdAt', 'DESC']];
				break;
			case 'oldest':
				orderVal = [['createdAt', 'ASC']];
				break;
			default:
				orderVal = [];
		}
		const usersIDs = [];
		const needUsers = await Users.findAll({
			where: { roleId: 3, statusId: 1, ...whereUser },
			include: [
				{
					model: Categories,
					as: 'cats',
					attributes: ['id'],
					where: { ...whereCats },
					required: requiredCats,
				},
			],
			distinct: true,
		});
		needUsers.forEach((user) => {
			if (+radius > 0) {
				if (
					checkIfInRadius(
						{ lat: user.locationLat, lng: user.locationLng },
						{ lat: +locationLat, lng: +locationLng },
						+radius
					)
				) {
					usersIDs.push(user.id);
				}
			} else {
				usersIDs.push(user.id);
			}
		});

		const { rows, count } = await Users.findAndCountAll({
			where: { id: usersIDs },
			limit: +limit,
			offset: +offset,
			order: orderVal,
		});
		return { rows, count };
	}

	async getUserByWhere(where, transaction = {}) {
		return await Users.findOne({ where, ...transaction });
	}

	async deleteUser(id) {
		return await Users.destroy({ where: { id } });
	}

	async updateUser(data, files, filePath, userId, isAdmin = false) {
		if (data.email) {
			const candidate = await Users.findOne({ where: { email: data.email } });
			if (candidate && candidate.id !== +userId) {
				throw ApiError.badRequest(`User with this ${data.email} already exists`);
			}
		}
		const user = await this.getOneUser(userId, false, 'id');
		// const user = await Users.findOne({ where: { id: userId } });
		let IDsDeleteSkills = [];
		let newSkillsData = [];
		let catsDataArray = [];
		let deleteFiles = '';

		for (let key of Object.keys(data)) {
			if (key === 'password' && data.password.length > 0) {
				if (!isAdmin) {
					const validPassword = cryptoService.checkPwd(
						data.current_password,
						user.password
					);
					if (!validPassword) {
						throw ApiError.badRequest('Wrong current password');
					} else {
						user.password = cryptoService.hashPwd(data.password);
					}
				} else {
					user.password = cryptoService.hashPwd(data.password);
				}
			} else if (key === 'skills') {
				newSkillsData = [...JSON.parse(data[key])];
			} else if (key === 'cats') {
				catsDataArray = [...data[key]];
			} else if (key === 'deletedSkills') {
				IDsDeleteSkills = [...data[key].split(',').map(Number)];
			} else if (key === 'hourlyRate') {
				user[key] = +data[key];
			} else if (key === 'toDelete') {
				deleteFiles = data[key];
			} else {
				user[key] = data[key];
			}
		}

		if (deleteFiles.length > 0) {
			await this.deleteFiles(deleteFiles, user, filePath);
		}

		if (catsDataArray.length) {
			let newCats = [];
			catsDataArray.forEach((cat) => {
				newCats.push({
					catId: cat,
					userId,
				});
			});
			await UsersCategories.destroy({ where: { userId } });
			await UsersCategories.bulkCreate(newCats);
		}

		if (newSkillsData.length > 0) {
			let newSkills = [];
			newSkillsData.forEach((skill) => {
				newSkills.push({
					name: skill,
					userId,
				});
			});

			await UserSkills.bulkCreate(newSkills);
		}

		if (IDsDeleteSkills.length > 0) {
			await UserSkills.destroy({ where: { id: IDsDeleteSkills } });
		}

		if (Object.keys(files).length > 0) {
			await this.uploadFiles(user, files, filePath);
		}

		if (data.statusId) {
			switch (data.statusId) {
				case 1:
					await mailService.sendActivateMail(user.email);
					break;
				case 2:
					await mailService.sendRejectMail(user.email, data.rejectMsg);
					break;
				case 3:
					await mailService.sendSuspendMail(user.email);
					break;
			}
		}
		await user.save();
		await user.reload();
		return user;
	}

	async deleteFiles(data, user, filePath) {
		const deletedObj = JSON.parse(data);
		for (let key of Object.keys(deletedObj)) {
			let files = [];
			switch (key) {
				case 'files':
					files = await UserFiles.findAll({
						where: { id: deletedObj[key] },
					});
					await UserFiles.destroy({ where: { id: files.map((i) => i.id) } });
					break;
				case 'selfyFiles':
					files = await UserFiles2.findAll({
						where: { id: deletedObj[key] },
					});
					await UserFiles2.destroy({ where: { id: files.map((i) => i.id) } });
					break;
				case 'licenseFiles':
					files = await UserFiles3.findAll({
						where: { id: deletedObj[key] },
					});
					await UserFiles3.destroy({ where: { id: files.map((i) => i.id) } });
					break;
				case 'photo':
					if (deletedObj[key] !== 'avatar.png') {
						user.photo = 'avatar.png';
						fileService.deleteFile(filePath, deletedObj[key]);
					}
					break;
			}
			files.forEach((file) => {
				fileService.deleteFile(filePath, file.name);
			});
		}
	}

	async uploadFiles(user, files, filePath) {
		for (let key of Object.keys(files)) {
			const filesArray = [];

			if (!Array.isArray(files[key])) {
				files[key] = [files[key]];
			}

			if (files[key].length > 0) {
				files[key].forEach((file) => {
					const newFileName = uuid.v4() + '.' + file.name.split('.').pop();
					if (key === 'uploaded_photo') {
						user.photo = user.activationLink + '/' + newFileName;
					} else {
						filesArray.push({
							name: user.activationLink + '/' + newFileName,
							userId: user.id,
						});
					}
					fileService.saveFile(file, filePath + '/' + user.activationLink, newFileName);
				});
			}

			switch (key) {
				case 'uploaded_files':
					await UserFiles.bulkCreate(filesArray);
					break;
				case 'uploaded_selfyFiles':
					await UserFiles2.bulkCreate(filesArray);
					break;
				case 'uploaded_licenseFiles':
					await UserFiles3.bulkCreate(filesArray);
					break;
			}
		}
	}

	async getRoles(withAdmin = true) {
		if (withAdmin) {
			return await UserRoles.findAll();
		} else {
			return await UserRoles.findAll({ where: { id: { [Op.not]: 1 } } });
		}
	}

	async getStatuses() {
		return await UserStatuses.findAll();
	}

	async userAddToFavorites(ownerId, followToId) {
		const check = await BookmarkedUsers.findOne({
			where: { userId: ownerId, userBookmarkId: followToId },
		});
		if (check) {
			await BookmarkedUsers.destroy({
				where: { userId: ownerId, userBookmarkId: followToId },
			});
		} else {
			await BookmarkedUsers.create({ userId: ownerId, userBookmarkId: followToId });
		}
		return await BookmarkedUsers.findAll({
			where: { userId: ownerId },
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
						'countryShortName',
						'rating',
					],
				},
			],
		});
	}

	async addEmployment(data, ownerId) {
		const objToCreateEmployment = {};
		objToCreateEmployment.userId = ownerId;
		Object.keys(data).forEach((key) => {
			objToCreateEmployment[key] = data[key];
		});
		return UserEmployment.create(objToCreateEmployment);
	}

	async editEmployment(data, ownerId) {
		const employment = await UserEmployment.findOne({
			where: { id: data.id, userId: ownerId },
		});
		Object.keys(data).forEach((key) => {
			employment[key] = data[key];
		});
		await employment.save();
		await employment.reload();
		return employment;
	}

	async deleteEmployment(id) {
		return await UserEmployment.destroy({ where: { id } });
	}

	async getAllCategories() {
		return await Categories.findAll();
	}

	async addReview(data, user) {
		const { receiverId, content, ratingLevel, missionId, proposalId } = data;
		return await sequelize.transaction(async (t) => {
			const checkReview = await UserReview.findOne({
				where: {
					missionId,
					userId: user.id,
					receiverId,
				},
				transaction: t,
			});

			if (checkReview) {
				throw ApiError.forbidden('Review is already exist');
			}

			let whereProposal = {
				id: proposalId,
				missionId,
				statusId: 4,
			};
			let whereMission = { id: missionId };

			if (user.role === 'source') {
				whereProposal['userId'] = user.id;
				whereMission['userId'] = receiverId;
			} else if (user.role === 'user') {
				whereProposal['userId'] = receiverId;
				whereMission['userId'] = user.id;
			}

			const proposal = await proposalService.getOneByWhere(whereProposal, { transaction: t });

			if (!proposal) {
				throw ApiError.forbidden('Proposal not found');
			}

			const mission = await missionService.getOneByWhere(whereMission, { transaction: t });
			if (!mission) {
				throw ApiError.forbidden('Mission not found');
			}

			const newReview = await UserReview.create(
				{
					content,
					receiverId,
					ratingLevel,
					missionId,
					proposalId,
					userId: user.id,
				},
				{ transaction: t }
			);

			const receiver = await Users.findByPk(receiverId, { transaction: t });

			const { rating, countReviews } = await this._countReviews(receiver.id, {
				transaction: t,
			});

			receiver.rating = rating;
			receiver.countReviews = countReviews;
			await receiver.save({ transaction: t });

			return newReview;
		});
	}

	async getAllDoneMissionsWithReviews(receiverId, limit, page) {
		return await Proposals.findAndCountAll({
			where: { statusId: 4, userId: receiverId },
			include: [
				{
					model: Missions,
					as: 'mission',
					attributes: ['title'],
					include: [
						{
							model: UserReview,
							as: 'review',
							where: { userId: { [Op.notIn]: [receiverId] }, receiverId },
							attributes: ['content', 'ratingLevel'],
							required: false,
						},
					],
				},
			],
			attributes: ['amount', 'isFixedPrice', 'id', 'createdAt', 'updatedAt'],
			separate: true,
			distinct: true,
		});
	}

	async getUserFeedback(userId, queryParams) {
		const { limit = 10, page = 1 } = queryParams;

		let offset = +page * +limit - +limit;

		return await UserReview.findAndCountAll({
			where: { receiverId: userId },
			include: [
				{ model: Users, as: 'user', attributes: ['nickName'] },
				{
					model: Proposals,
					as: 'proposal',
					attributes: ['amount', 'isFixedPrice', 'createdAt', 'updatedAt'],
				},
				{
					model: Missions,
					as: 'mission',
					attributes: ['title'],
				},
			],
			separate: true,
			distinct: true,
			limit: +limit,
			offset: +offset,
		});
	}

	async _countReviews(receiverId, transaction = {}) {
		const reviews = await UserReview.findAll({
			where: { receiverId },
			...transaction,
		});

		let allReviews = 0;
		reviews.forEach((review) => {
			allReviews += review.ratingLevel;
		});

		return { rating: allReviews / reviews.length, countReviews: reviews.length };
	}

	async getSourcesByMissionCats(missionId, queryParams) {
		const { page = 1, limit = 10 } = queryParams;
		let offset = +page * +limit - +limit;

		const missionsCats = await MissionCategories.findAll({
			where: { missionId },
			attributes: ['catId'],
		});
		return await Users.findAndCountAll({
			where: { roleId: 3, statusId: 1 },
			include: [
				{
					model: Categories,
					as: 'cats',
					attributes: ['id'],
					where: { id: missionsCats.map((el) => el.catId) },
					required: true,
				},
			],
			limit: +limit,
			offset: +offset,
			distinct: true,
			order: [['rating', 'DESC']],
		});
	}
}

module.exports = new UserService();
