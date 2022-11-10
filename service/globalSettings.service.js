const { GlobalSettings } = require('../database').models;

class GlobalSettingsService {
	async getDisputeEmail() {
		const email = await GlobalSettings.findOne({ where: { name: 'disputeEmail' } });
		return email?.value;
	}

	async changeDisputeEmail(email) {
		return await GlobalSettings.update({ value: email }, { where: { name: 'disputeEmail' } });
	}
}

module.exports = new GlobalSettingsService();
