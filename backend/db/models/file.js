'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class File extends Model {
		static associate(models) {
			File.belongsTo(models.User, {
				foreignKey: 'userId',
				as: 'user', // Alias for association
				onDelete: 'CASCADE',
			});
		}
	}

	File.init(
		{
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			fileUrl: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			fileType: {
				type: DataTypes.STRING,
				allowNull: true, // Optional
			},
		},
		{
			sequelize,
			modelName: 'File',
			tableName: 'Files', // Explicitly match the table name
			timestamps: true, // Automatically adds `createdAt` and `updatedAt`
			underscored: true, // Uses snake_case for column names in DB
		}
	);

	return File;
};
