const globalSettingsService = require('../service/globalSettings.service');

class GlobalSettingsController {
	async getDisputeEmail(req, res, next) {
		try {
			const disputeEmail = await globalSettingsService.getDisputeEmail();
			return res.json({ message: disputeEmail });
		} catch (e) {
			return next(e);
		}
	}

	async changeDisputeEmail(req, res, next) {
		try {
			const { email } = req.body;
			const checkDisputeEmail = await globalSettingsService.changeDisputeEmail(email);
			return res.json({ message: checkDisputeEmail });
		} catch (e) {
			return next(e);
		}
	}
}

module.exports = new GlobalSettingsController();
