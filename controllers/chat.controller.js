const chatService = require('../service/chat.service');

class ChatController {
	async addPrivateChat(req, res, next) {
		try {
			const data = req.body;
			const sender = req.user;
			const result = await chatService.addPrivateChat(data, sender);
			return res.json({ message: result });
		} catch (e) {
			return next(e);
		}
	}

	async getAllChatsPrivate(req, res, next) {
		try {
			const owner = req.user;
			const allPrivateChats = await chatService.getAllChatsPrivate(owner);
			return res.json({ message: allPrivateChats });
		} catch (e) {
			return next(e);
		}
	}

	async getAllMessagesOfPrivateChat(req, res, next) {
		try {
			const { id: chatId } = req.params;
			const userId = req.user.id;

			const allMessagesOfCurrentChat = await chatService.getAllMessagesOfPrivateChat(
				chatId,
				userId
			);
			return res.json({ message: allMessagesOfCurrentChat });
		} catch (e) {
			return next(e);
		}
	}

	async getUnreadMessagesCount(req, res, next) {
		try {
			const user = req.user;
			const count = await chatService.getUnreadMessagesCount(user);
			return res.json({ message: count });
		} catch (e) {
			return next(e);
		}
	}

	async getUnreadMessagesForEachChatCount(req, res, next) {
		try {
			const user = req.user;
			const count = await chatService.getUnreadMessagesForEachChatCount(user);
			return res.json({ message: count });
		} catch (e) {
			return next(e);
		}
	}

	async changeMessagesToRead(req, res, next) {
		try {
			const user = req.user;
			const { chatId } = req.body;
			const isUpdated = await chatService.makeReadMessagesPrivateChat(chatId, user.id);
			return res.json({ message: isUpdated });
		} catch (e) {
			return next(e);
		}
	}

	async getAllMessagesOfGroupChat(req, res, next) {
		try {
			const messages = await chatService.getAllMessagesOfGroupChat();
			return res.json({ message: messages });
		} catch (e) {
			return next(e);
		}
	}

	async addMessageToGroupChat(req, res, next) {
		try {
			const user = req.user;
			const data = req.body;
			const message = await chatService.addMessageToGroupChat(data, user);
			return res.json({ message: message });
		} catch (e) {
			return next(e);
		}
	}

	async deleteAlmostAllGroupMessages(req, res, next) {
		try {
			const message = await chatService.deleteAlmostAllGroupMessages();
			return res.json({ message: message });
		} catch (e) {
			return next(e);
		}
	}
}

module.exports = new ChatController();
