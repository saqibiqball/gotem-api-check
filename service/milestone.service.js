const fileService = require('./file.service');
const missionService = require('./mission.service');
const transactionService = require('./transaction.service');
const { Milestones, Proposals, Users } = require('../database').models;
const sequelize = require('../database');
const ApiError = require('../exceptions/ApiError');

class MilestoneService {
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

	async getAllProperties() {}

	async getAllByWhere(where, transaction = {}) {
		return await Milestones.findAll({ where, ...transaction });
	}

	async add(data, proposalId, transaction = {}) {
		if (!Array.isArray(data)) {
			data = [data];
		}
		for (let milestone of data) {
			milestone.proposalsId = proposalId;
			milestone.statusId = 1;
			delete milestone.id;
		}
		await Milestones.bulkCreate(data, transaction);
	}

	async update(data, proposalId, transaction = {}) {
		if (!Array.isArray(data)) {
			data = [data];
		}
		for (let milestone of data) {
			milestone.proposalsId = proposalId;
			milestone.statusId = 1;
			delete milestone.id;
			delete milestone.createdAt;
			delete milestone.updatedAt;
		}
		await Milestones.destroy({ where: { proposalsId: proposalId }, ...transaction });
		await Milestones.bulkCreate(data, transaction);
	}

	async changeStatus(data, user, t2 = null) {
		const { proposalId, milestoneId, statusId } = data;

		return await sequelize.transaction(async (t) => {
			const transaction = { transaction: t2 || t };
			const proposal = await Proposals.findByPk(proposalId, transaction);

			if (!proposal) {
				throw ApiError.badRequest('Proposal not found');
			}

			const mission = await missionService.getOneMission(
				proposal.missionId,
				user,
				false,
				transaction
			);

			const milestone = await this.getOneByWhere({ id: milestoneId });
			milestone.statusId = statusId;
			await milestone.save(transaction);

			if (+statusId === 4 && user.role === 'user') {
				const allActiveMilestones = await this.getAllByWhere(
					{ statusId: [1, 2, 3], proposalsId: proposal.id },
					transaction
				);

				if (!allActiveMilestones.length) {
					proposal.statusId = 4;
					await proposal.save(transaction);
					await proposal.reload(transaction);
				}
				const foolPrice = milestone.amount;
				const commissionPrice = (process.env.COMISSION_RATE * foolPrice).toFixed(2);
				const withCommissionPrice = (foolPrice - commissionPrice).toFixed(2);

				const freelancer = await Users.findOne({
					where: { id: proposal.userId },
					...transaction,
				});
				const balancePending = +freelancer.pendingBalance - +withCommissionPrice;
				const balanceAvailable = +freelancer.availableBalance + +withCommissionPrice;
				freelancer.pendingBalance = balancePending;
				freelancer.availableBalance = balanceAvailable;

				await transactionService.createTransaction(
					{
						status: 'send to available',
						amount: milestone.amount,
						marketplaceCommission: 0,
						userAmount: +withCommissionPrice,
						currency: 'usd',
						description: `Move from pending balance to available balance for milestone ${milestone.title}`,
						pendingBalance: balancePending,
						availableBalance: balanceAvailable,
						milestoneId: milestone.id,
						userPaidId: mission.userId,
						userReceivedId: freelancer.id,
					},
					transaction
				);

				await freelancer.save(transaction);
			}
			return proposal;
		});
	}

	async updateByWhere(where, data, transaction = {}) {
		return await Milestones.update(data, { where, ...transaction });
	}

	async getOne(id, proposalsId, missionId, transaction = {}) {
		const milestone = await Milestones.findOne({
			where: { id, proposalsId },
			include: [{ model: Proposals, as: 'proposal', where: { missionId } }],
			...transaction,
		});

		if (!milestone) {
			throw ApiError.badRequest('Milestone not found');
		}

		return milestone;
	}

	async getOneByWhere(where, transaction = {}) {
		return await Milestones.findOne({ where, ...transaction });
	}

	async getAmount(id) {
		return await Milestones.findOne({
			where: { id },
			attributes: ['amount'],
		});
	}

	async getAll() {}

	async delete() {}

	async deleteAll(proposalId, transaction = {}) {
		await Milestones.destroy({ where: { proposalsId: proposalId }, ...transaction });
	}
}

module.exports = new MilestoneService();
