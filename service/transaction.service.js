const { Op } = require('sequelize');
const sequelize = require('../database');
const userService = require('../service/user.service');
const { Transactions, Users, Milestones } = require('../database').models;

class TransactionService {
	async createTransaction(data, transaction = {}) {
		return await Transactions.create({ ...data }, transaction);
	}

	async addTransaction(data, admin) {
		const { userReceivedId, userAmount, status } = data;
		return await sequelize.transaction(async (t) => {
			const user = await userService.getUserByWhere(
				{ id: userReceivedId },
				{ transaction: t }
			);

			const availableBalance = user.availableBalance + userAmount;
			await this.createTransaction(
				{
					currency: 'usd',
					amount: userAmount,
					marketplaceCommission: 0,
					userAmount,
					pendingBalance: user.pendingBalance,
					availableBalance: availableBalance,
					status,
					userPaidId: admin.id,
					userReceivedId: user.id,
				},
				{ transaction: t }
			);

			user.availableBalance = availableBalance;
			await user.save({ transaction: t });
		});
	}

	async getAll(query) {
		let { page = 1, limit = 10 } = query;
		let offset = page * limit - limit;

		return await sequelize.transaction(async (t) => {
			return await Transactions.findAndCountAll({
				include: [
					{ model: Users, as: 'userPaid', attributes: ['nickName'] },
					{
						model: Users,
						as: 'userReceived',
						attributes: ['nickName'],
					},
					{ model: Milestones, as: 'milestone', attributes: ['title'] },
				],
				separate: true,
				order: [['id', 'DESC']],
				limit: +limit,
				offset: +offset,
				transaction: t,
			});
		});
	}

	async getForUser(query, user) {
		let { page = 1, limit = 10 } = query;
		let offset = page * limit - limit;

		return await Transactions.findAndCountAll({
			where: { userPaidId: user.id, status: { [Op.not]: 'pending' } },
			include: [
				{ model: Milestones, as: 'milestone', attributes: ['title'] },
				{ model: Users, as: 'userReceived', attributes: ['nickName'] },
			],
			separate: true,
			order: [['id', 'DESC']],
			limit: +limit,
			offset: +offset,
		});
	}

	async getForFreelancer(query, user) {
		let { page = 1, limit = 10 } = query;
		let offset = page * limit - limit;

		return await Transactions.findAndCountAll({
			where: { userReceivedId: user.id, status: { [Op.not]: 'pending' } },
			include: [
				{ model: Milestones, as: 'milestone', attributes: ['title'] },
				{ model: Users, as: 'userPaid', attributes: ['nickName'] },
			],
			separate: true,
			order: [['id', 'DESC']],
			limit: +limit,
			offset: +offset,
		});
	}

	async getOneByWhere(data, transaction = {}) {
		return await Transactions.findOne({
			where: data,
			...transaction,
		});
	}

	async updateOne(where, data, transaction = {}) {
		return await Transactions.update(data, { where, ...transaction });
	}

	async getOneByUsersAndMilestone(usePaidId, useReceivedId, milestoneId) {
		return await Transactions.findOne({
			where: { usePaidId, useReceivedId, milestoneId },
		});
	}

	async removeTransaction(id, transaction = {}) {
		return await Transactions.destroy({ where: { id }, ...transaction });
	}
}

module.exports = new TransactionService();
