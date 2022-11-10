const proposalService = require('../service/proposal.service');

class ProposalController {
	async getAllProperties(req, res, next) {
		try {
			const properties = await proposalService.getAllProperties();
			return res.json({ message: properties });
		} catch (e) {
			return next(e);
		}
	}

	async add(req, res, next) {
		try {
			const proposalData = req.body;
			const sender = req.user;
			const data = await proposalService.add(proposalData, sender);
			return res.json({ message: data });
		} catch (e) {
			return next(e);
		}
	}

	async update(req, res, next) {
		try {
			const proposalData = req.body;
			const sender = req.user;
			const data = await proposalService.update(proposalData, sender);
			return res.json({ message: data });
		} catch (e) {
			return next(e);
		}
	}

	async getOne(req, res, next) {
		try {
			const id = req.params.id;
			const user = req.user;
			const proposal = await proposalService.getOne(id, user);
			return res.json({ message: proposal });
		} catch (e) {
			return next(e);
		}
	}

	async getOneActive(req, res, next) {
		try {
			const id = req.params.id;
			const user = req.user;
			const proposal = await proposalService.getOne(id, user, true);
			return res.json({ message: proposal });
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
			const params = req.query;
			const user = req.user;
			const { rows, count } = await proposalService.getAll(params, user);
			return res.json({ message: { rows, count } });
		} catch (e) {
			return next(e);
		}
	}

	async downloadZip(req, res, next) {
		try {
			const { loadLink, folderLink } = req.query;
			const zip = await proposalService.downloadZip(loadLink, folderLink);
			res.send(zip);
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

module.exports = new ProposalController();
