const stripe = require('../globals/stripe');
const sequelize = require('../database');
const mailService = require('../service/mail.service');
const userService = require('../service/user.service');
const missionService = require('../service/mission.service');
const proposalService = require('../service/proposal.service');
const milestoneService = require('../service/milestone.service');
const transactionService = require('../service/transaction.service');
const ApiError = require('../exceptions/ApiError');
const endpointSecret = process.env.STRIPE_ENDPOINT;

class PaymentService {
	async createStripeCustomer(user, transaction = {}) {
		let customer = {};
		if (user.customerId) {
			customer.id = user.customerId;
		} else {
			customer = await stripe.customers.create({
				email: user.email,
				name: user.firstName,
			});
			user.customerId = customer.id;
			await user.save(transaction);
		}
		return customer;
	}

	async webhookListen(body, signature) {
		let event = {};

		if (endpointSecret) {
			try {
				event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
			} catch (err) {
				throw ApiError.badRequest('Webhook signature verification failed.');
			}
		}
		return await sequelize.transaction(async (t) => {
			switch (event.type) {
				case 'payment_intent.succeeded': {
					const paymentIntent = event.data.object;
					const transaction = await transactionService.getOneByWhere(
						{
							orderId: paymentIntent.id,
							status: 'pending',
						},
						{ transaction: t }
					);

					if (!transaction) throw ApiError.badRequest('There is no transaction');

					const user = await userService.getUserByWhere(
						{ id: transaction.userReceivedId },
						{ transaction: t }
					);

					const milestone = await milestoneService.getOneByWhere(
						{
							id: transaction.milestoneId,
						},
						{ transaction: t }
					);

					const proposal = await proposalService.getOneByWhere(
						{ id: milestone.proposalsId },
						{ transaction: t }
					);

					const userBalance = +user.pendingBalance + +transaction.userAmount;

					user.pendingBalance = userBalance;
					await user.save({ transaction: t });

					transaction.pendingBalance = userBalance;
					transaction.status = 'succeeded';
					await transaction.save({ transaction: t });

					milestone.statusId = 2;
					milestone.paymentStatusId = 1;
					await milestone.save({ transaction: t });

					proposal.statusId = 2;
					await proposal.save({ transaction: t });

					break;
				}
				//charge.dispute.created
				case 'charge.dispute.funds_withdrawn': {
					const dispute = event.data.object;
					const dispute_paymentIntent = await stripe.paymentIntents.retrieve(
						dispute.payment_intent
					);

					const transactionSuccess = await transactionService.getOneByWhere(
						{
							orderId: dispute_paymentIntent.id,
							status: 'succeeded',
						},
						{ transaction: t }
					);

					const user = await userService.getUserByWhere(
						{ id: transactionSuccess.userReceivedId },
						{ transaction: t }
					);

					const milestone = await milestoneService.getOneByWhere(
						{
							id: transactionSuccess.milestoneId,
						},
						{ transaction: t }
					);

					const userBalance = +user.pendingBalance - +transactionSuccess.userAmount;

					user.pendingBalance = userBalance;
					await user.save({ transaction: t });

					milestone.statusId = 1;
					milestone.paymentStatusId = null;
					await milestone.save({ transaction: t });

					await transactionService.createTransaction(
						{
							orderId: dispute.id,
							description: `Money was refund by reason ${dispute.reason}`,
							currency: dispute.currency,
							amount: -transactionSuccess.amount,
							marketplaceCommission: 0,
							userAmount: -transactionSuccess.userAmount,
							pendingBalance: userBalance,
							availableBalance: user.availableBalance,
							status: dispute.status,
							milestoneId: transactionSuccess.milestoneId,
							userPaidId: transactionSuccess.userPaidId,
							userReceivedId: transactionSuccess.userReceivedId,
						},
						{ transaction: t }
					);

					break;
				}
			}
		});
	}

	async paymentIntent(data, userReq) {
		const { missionId, proposalId, milestoneId } = data;
		return await sequelize.transaction(async (t) => {
			const user = await userService.getUserByWhere(
				{ email: userReq.email },
				{ transaction: t }
			);

			//Check is user owner of mission
			await missionService.getOneMission(missionId, userReq, false, {
				transaction: t,
			});

			//Check if proposal has this milestone
			const milestone = await milestoneService.getOne(milestoneId, proposalId, missionId, {
				transaction: t,
			});

			const source = await userService.getUserByWhere(
				{ id: milestone.proposal.userId },
				{ transaction: t }
			);

			const foolPrice = milestone.amount;
			const description = `User ${user.email} payed for milestone ${milestone.title}`;
			const commissionPrice = (process.env.COMISSION_RATE * foolPrice).toFixed(2);
			const withCommissionPrice = (foolPrice - commissionPrice).toFixed(2);

			const customer = await this.createStripeCustomer(user, { transaction: t });

			const paymentIntent = await stripe.paymentIntents.create({
				customer: customer.id,
				setup_future_usage: 'off_session',
				amount: +(foolPrice * 100).toFixed(2),
				currency: 'usd',
				automatic_payment_methods: {
					enabled: true,
				},
				description,
				receipt_email: user.email,
				metadata: {
					milestoneId,
					missionId,
					userId: user.id,
					freelancerId: milestone.proposal.userId,
				},
			});

			const checkTransaction = await transactionService.getOneByWhere(
				{
					userPaidId: user.id,
					userReceivedId: milestone.proposal.userId,
					milestoneId,
					status: 'pending',
				},
				{ transaction: t }
			);

			if (checkTransaction) {
				await transactionService.removeTransaction(checkTransaction.id, { transaction: t });
			}

			await transactionService.createTransaction(
				{
					orderId: paymentIntent.id,
					description,
					currency: paymentIntent.currency,
					amount: foolPrice,
					marketplaceCommission: commissionPrice,
					userAmount: withCommissionPrice,
					pendingBalance: +source.pendingBalance,
					availableBalance: +source.availableBalance,
					status: 'pending',
					milestoneId,
					userPaidId: user.id,
					userReceivedId: milestone.proposal.userId,
				},
				{ transaction: t }
			);

			return { clientSecret: paymentIntent.client_secret, amount: milestone.amount };
		});
	}
}

module.exports = new PaymentService();
