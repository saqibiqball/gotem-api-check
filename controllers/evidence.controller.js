const evidenceService = require('../service/evidence.service');
const milestoneService = require('../service/milestone.service');
const proposalService = require('../service/proposal.service');

class EvidenceController {
	async create(req, res, next) {
		try {
			const data = req.body;
			const files = req.files || {};
			const user = req.user;
			const filePath = req.filePath;
			await evidenceService.create(data, files, user, filePath);
			const proposalDefault = await milestoneService.changeStatus(
				{ ...data, statusId: 3 },
				user
			);
			const proposal = await proposalService.getOne(proposalDefault.id, user, true);
			return res.json({ message: proposal });
		} catch (e) {
			return next(e);
		}
	}

	async update(req, res, next) {
		try {
			const data = req.body;
			const files = req.files || {};
			const user = req.user;
			const filePath = req.filePath;
			await evidenceService.update(data, files, user, filePath);
			const proposalDefault = await milestoneService.changeStatus(
				{ ...data, statusId: 3 },
				user
			);
			const proposal = await proposalService.getOne(proposalDefault.id, user, true);
			return res.json({ message: proposal });
		} catch (e) {
			return next(e);
		}
	}
}

module.exports = new EvidenceController();
