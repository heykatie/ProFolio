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
				field: 'userId', // This explicitly maps the attribute to the database column
			},
			fileUrl: {
				type: DataTypes.STRING,
				allowNull: false,
				field: 'fileUrl', // Map to the correct database column
			},
			fileType: {
				type: DataTypes.STRING,
				allowNull: true,
				field: 'fileType', // Map to the correct database column
			},
		},
		{
			sequelize,
			modelName: 'File',
			tableName: 'Files', // Explicitly match the table name
			timestamps: true, // Automatically adds `createdAt` and `updatedAt`
			createdAt: 'createdAt', // Explicitly map `createdAt`
			updatedAt: 'updatedAt',
			// underscored: true, // Uses snake_case for column names in DB
		}
	);

	return File;
};
