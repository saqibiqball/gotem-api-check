const sequelize = require('../database');
const { Users, ChatsPrivate, Messages, MessagesGroup } = require('../database').models;
const { Op } = require('sequelize');
const ApiError = require('../exceptions/ApiError');

class ChatService {
	async addPrivateChat(data, user) {
		const { content, receiverId } = data;
		return await sequelize.transaction(async (t) => {
			const newPrivateChat = await ChatsPrivate.findOrCreate({
				where: {
					[Op.or]: [
						{ senderId: receiverId, receiverId: user.id },
						{ senderId: user.id, receiverId },
					],
				},
				defaults: {
					senderId: user.id,
					receiverId,
					lastMessage: content,
					lastMessageOwnerId: user.id,
				},
				transaction: t,
			});

			if (!newPrivateChat[1]) {
				newPrivateChat[0].lastMessageOwnerId = user.id;
				newPrivateChat[0].lastMessage = content;
				await newPrivateChat[0].save({ transaction: t });
				await newPrivateChat[0].reload({ transaction: t });
			}

			const newMessage = await this.newMessage(
				{
					content,
					userId: user.id,
					chatPrivateId: newPrivateChat[0].id,
				},
				{ transaction: t }
			);
			const userInclude = await newMessage.getUser();

			return {
				newPrivateChat: newPrivateChat[0],
				newMessage: {
					...newMessage.dataValues,
					user: {
						id: userInclude.id,
						firstName: userInclude.firstName,
						lastName: userInclude.firstName,
						photo: userInclude.photo,
						slug: userInclude.slug,
					},
				},
			};
		});
	}

	async getAllChatsPrivate(user) {
		return ChatsPrivate.findAll({
			where: {
				[Op.or]: [{ senderId: user.id }, { receiverId: user.id }],
			},
			include: [
				{
					model: Users,
					as: 'lastMessageOwner',
					attributes: ['id', 'firstName', 'lastName'],
				},
				{
					model: Users,
					as: 'receiver',

					attributes: ['id', 'firstName', 'lastName', 'photo', 'slug', 'roleId'],
				},
				{
					model: Users,
					as: 'sender',
					attributes: ['id', 'firstName', 'lastName', 'photo', 'slug', 'roleId'],
				},
			],
			separate: true,
		});
	}

	async newMessage(data, transaction = {}) {
		return await Messages.create(
			{
				...data,
			},
			{
				...transaction,
			}
		);
	}

	async getAllMessagesOfPrivateChat(chatId, userId) {
		return await sequelize.transaction(async (t) => {
			const chat = await ChatsPrivate.findOne({
				where: {
					id: chatId,
					[Op.or]: [{ senderId: userId }, { receiverId: userId }],
				},
				transaction: t,
			});
			if (!chat) {
				throw ApiError.badRequest('Chat not found');
			}

			await this.makeReadMessagesPrivateChat(chatId, userId, { transaction: t });

			return await Messages.findAll({
				where: { chatPrivateId: chatId },
				include: [
					{
						model: Users,
						as: 'user',
						attributes: ['id', 'firstName', 'lastName', 'photo', 'slug'],
					},
				],
				transaction: t,
			});
		});
	}

	async makeReadMessagesPrivateChat(chatId, userId, transaction = {}) {
		return await Messages.update(
			{ isRead: true },
			{ where: { chatPrivateId: chatId, [Op.not]: { userId } }, ...transaction }
		);
	}

	async getUnreadMessagesCount(user) {
		const allMyChats = await ChatsPrivate.findAll({
			where: { [Op.or]: [{ senderId: user.id }, { receiverId: user.id }] },
			attributes: ['id'],
		});

		return await Messages.count({
			where: {
				chatPrivateId: allMyChats.map((ch) => ch.id),
				userId: {
					[Op.not]: user.id,
				},
				isRead: false,
			},
			distinct: true,
		});
	}

	async getUnreadMessagesForEachChatCount(user) {
		return await ChatsPrivate.findAll({
			where: { [Op.or]: [{ senderId: user.id }, { receiverId: user.id }] },
			attributes: ['id'],
			include: [
				{
					model: Messages,
					as: 'messages',
					where: { isRead: false, [Op.not]: { userId: user.id } },
					attributes: ['id'],
				},
			],
		});
	}

	async getAllMessagesOfGroupChat() {
		return await MessagesGroup.findAll({
			include: [
				{
					model: Users,
					as: 'sender',
					attributes: ['id', 'firstName', 'lastName', 'photo', 'slug'],
				},
			],
		});
	}

	async addMessageToGroupChat(data, user) {
		const message = await MessagesGroup.create({
			content: data.content,
			senderId: user.id,
		});

		const userInclude = await message.getSender();

		return {
			...message.dataValues,
			sender: {
				id: userInclude.id,
				firstName: userInclude.firstName,
				lastName: userInclude.firstName,
				photo: userInclude.photo,
				slug: userInclude.slug,
			},
		};
	}

	async deleteAlmostAllGroupMessages() {
		return await sequelize.transaction(async (t) => {
			const neededToDeleteIds = await MessagesGroup.findAll({
				attributes: ['id'],
				offset: 500,
				order: [['id', 'DESC']],
				transaction: t,
			});

			return await MessagesGroup.destroy({
				where: { id: neededToDeleteIds.map((el) => el.id) },
			});
		});
	}
}

module.exports = new ChatService();
