const sequelize = require('../database');
const { Disputes, Milestones, Proposals, Missions, Users } = require('../database').models;
const milestoneService = require('./milestone.service');
const mailService = require('./mail.service');

class DisputeService {
	async getOneDispute(id, transaction = {}) {
		return await Disputes.findOne({
			where: { id },
			include: [
				{
					model: Milestones,
					as: 'milestone',
					attributes: ['proposalsId', 'amount'],
					include: [
						{
							model: Proposals,
							as: 'proposal',
							attributes: ['userId', 'missionId'],
							include: [
								{ model: Users, as: 'user', attributes: ['id', 'email'] },
								{
									model: Missions,
									as: 'mission',
									attributes: ['title', 'id', 'userId'],
									include: [
										{ model: Users, as: 'user', attributes: ['id', 'email'] },
									],
								},
							],
						},
					],
				},
			],
			...transaction,
		});
	}

	async getDisputes(queryData) {
		const { limit = 10, page = 1 } = queryData;
		let offset = +page * +limit - +limit;
		return await Disputes.findAndCountAll({
			where: { isActive: true },
			include: [
				{
					model: Milestones,
					as: 'milestone',
					attributes: ['proposalsId', 'amount'],
					include: [
						{
							model: Proposals,
							as: 'proposal',
							attributes: ['userId', 'missionId'],
							include: [
								{ model: Users, as: 'user', attributes: ['id', 'email'] },
								{
									model: Missions,
									as: 'mission',
									attributes: ['title', 'userId'],
									include: [
										{ model: Users, as: 'user', attributes: ['id', 'email'] },
									],
								},
							],
						},
					],
				},
			],
			limit: +limit,
			offset: +offset,
			distinct: true,
		});
	}

	async addDispute(data, user) {
		const { reason, milestoneId, proposalId } = data;
		const statusId = 5;

		return await sequelize.transaction(async (t2) => {
			const newDispute = await Disputes.create(
				{
					reason,
					milestoneId,
				},
				{ transaction: t2 }
			);
			await milestoneService.changeStatus({ proposalId, milestoneId, statusId }, user, t2);

			const dispute = await this.getOneDispute(newDispute.id, { transaction: t2 });

			const disputeTest = {
				user: dispute.milestone.proposal.mission.user.email,
				source: dispute.milestone.proposal.user.email,
				mission: {
					id: dispute.milestone.proposal.mission.id,
					title: dispute.milestone.proposal.mission.title,
				},
				reason,
			};

			await mailService.disputeMailToAdmin(disputeTest);

			return dispute;
		});
	}

	async updateDispute(data, user) {
		const { disputeId, milestoneId, proposalId } = data;
		const statusId = 4;

		return await sequelize.transaction(async (t2) => {
			const newDispute = await Disputes.update(
				{
					isActive: false,
				},
				{
					where: { id: disputeId },
					transaction: t2,
				}
			);
			await milestoneService.changeStatus({ proposalId, milestoneId, statusId }, user, t2);

			return newDispute;
		});
	}
}

module.exports = new DisputeService();
