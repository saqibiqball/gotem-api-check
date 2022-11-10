const milestoneService = require('../service/milestone.service');
const proposalService = require('../service/proposal.service');

class MilestoneController {
	async getAllProperties(req, res, next) {
		try {
			return res.json({ message: '' });
		} catch (e) {
			return next(e);
		}
	}

	async add(req, res, next) {
		try {
			return res.json({ message: '' });
		} catch (e) {
			return next(e);
		}
	}

	async update(req, res, next) {
		try {
			return res.json({ message: '' });
		} catch (e) {
			return next(e);
		}
	}

	async changeStatus(req, res, next) {
		try {
			const data = req.body;
			const user = req.user;
			const result = await milestoneService.changeStatus(data, user);
			const proposal = await proposalService.getOne(result.id, user, true);
			return res.json({ message: proposal });
		} catch (e) {
			return next(e);
		}
	}

	async getOne(req, res, next) {
		try {
			return res.json({ message: '' });
		} catch (e) {
			return next(e);
		}
	}

	async getAmount(req, res, next) {
		const { id } = req.params;
		try {
			const result = await milestoneService.getAmount(id);
			return res.json({ message: result });
		} catch (e) {
			return next(e);
		}
	}

	async getOnePublic(req, res, next) {
		try {
			return res.json({ message: '' });
		} catch (e) {
			return next(e);
		}
	}

	async getAll(req, res, next) {
		try {
			return res.json({ message: {} });
		} catch (e) {
			return next(e);
		}
	}

	async delete(req, res, next) {
		try {
			return res.json({ message: '' });
		} catch (e) {
			return next(e);
		}
	}
}

module.exports = new MilestoneController();
