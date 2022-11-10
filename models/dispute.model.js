const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	sequelize.define(
		'Disputes',
		{
			id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
			isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
			reason: { type: DataTypes.STRING, defaultValue: '' },
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
			tableName: 'disputes',
		}
	);
};
