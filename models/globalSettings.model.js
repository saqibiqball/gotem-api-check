const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	sequelize.define(
		'GlobalSettings',
		{
			id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
			name: { type: DataTypes.STRING, defaultValue: '', required: true },
			value: { type: DataTypes.STRING, defaultValue: '', required: true },
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
			tableName: 'globalSettings',
		}
	);
};
