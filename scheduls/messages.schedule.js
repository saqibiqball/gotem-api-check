const cron = require('node-cron');
const chatService = require('../service/chat.service');

const deleteAlmostAllGroupMessages = () => {
	cron.schedule('* * 0 * * *', async () => {
		await chatService.deleteAlmostAllGroupMessages();
	});
};

module.exports = deleteAlmostAllGroupMessages;
