const disputeService = require('../service/dispute.service');

class DisputeController {
	async getDisputes(req, res, next) {
		try {
			const queryData = req.query;
			const disputes = await disputeService.getDisputes(queryData);
			return res.json({ message: disputes });
		} catch (e) {
			return next(e);
		}
	}

	async addDispute(req, res, next) {
		try {
			const data = req.body;
			const user = req.user;
			const dispute = await disputeService.addDispute(data, user);
			return res.json({ message: dispute });
		} catch (e) {
			return next(e);
		}
	}

	async updateDispute(req, res, next) {
		try {
			const data = req.body;
			const user = req.user;
			const dispute = await disputeService.updateDispute(data, user);
			return res.json({ message: dispute });
		} catch (e) {
			return next(e);
		}
	}
}

module.exports = new DisputeController();
