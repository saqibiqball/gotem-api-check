const transactionService = require('../service/transaction.service');

class TransactionController {
	async addTransaction(req, res, next) {
		try {
			const data = req.body;
			const user = req.user;
			await transactionService.addTransaction(data, user);
			return res.json({ message: 'Created transaction' });
		} catch (e) {
			return next(e);
		}
	}

	async getAll(req, res, next) {
		try {
			const query = req.query;
			const transactions = await transactionService.getAll(query);
			return res.json({ message: transactions });
		} catch (e) {
			return next(e);
		}
	}

	async getForUser(req, res, next) {
		try {
			const query = req.query;
			const user = req.user;
			const transactions = await transactionService.getForUser(query, user);
			return res.json({ message: transactions });
		} catch (e) {
			return next(e);
		}
	}

	async getForFreelancer(req, res, next) {
		try {
			const query = req.query;
			const user = req.user;
			const transactions = await transactionService.getForFreelancer(query, user);
			return res.json({ message: transactions });
		} catch (e) {
			return next(e);
		}
	}
}

module.exports = new TransactionController();
