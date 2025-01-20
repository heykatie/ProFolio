'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Feedback extends Model {
		static associate(models) {
			Feedback.belongsTo(models.User, { foreignKey: 'userId' });
		}
	}

	Feedback.init(
		{
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: { model: 'users', key: 'id' },
				onDelete: 'CASCADE',
			},
			authorName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			message: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			rating: {
				type: DataTypes.INTEGER,
				allowNull: true,
				validate: { min: 1, max: 5 },
			},
			isPublic: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
			portfolioId: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
			},
		},
		{
			sequelize,
			modelName: 'Feedback',
			tableName: 'Feedback',
			timestamps: true,
		}
	);

	return Feedback;
};
