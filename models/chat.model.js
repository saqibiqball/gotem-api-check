const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	sequelize.define(
		'MessagesGroup',
		{
			id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
			content: { type: DataTypes.TEXT, defaultValue: '' },
			createdAt: {
				allowNull: false,
				type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
			},
			updatedAt: {
				allowNull: false,
				type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
			},
		},
		{
			tableName: 'messages_group',
		}
	);

	sequelize.define(
		'ChatsPrivate',
		{
			id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
			lastMessage: { type: DataTypes.TEXT, defaultValue: '' },
			createdAt: {
				allowNull: false,
				type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
			},
			updatedAt: {
				allowNull: false,
				type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
			},
		},
		{
			tableName: 'chats_private',
		}
	);

	sequelize.define(
		'Messages',
		{
			id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
			content: { type: DataTypes.TEXT, defaultValue: '' },
			isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
			createdAt: {
				allowNull: false,
				type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
			},
			updatedAt: {
				allowNull: false,
				type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
			},
		},
		{
			tableName: 'messages',
		}
	);
};
