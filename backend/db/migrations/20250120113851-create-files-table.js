'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
	options.schema = process.env.SCHEMA; // Define schema in production
}

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable(
			'Files',
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				userId: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'Users', // Matches Users table
						key: 'id',
					},
					onDelete: 'CASCADE', // Delete files when user is deleted
				},
				fileUrl: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				fileType: {
					type: Sequelize.STRING, // Optional: Stores file type like 'image/png'
					allowNull: true,
				},
				createdAt: {
					allowNull: false,
					type: Sequelize.DATE,
				},
				updatedAt: {
					allowNull: false,
					type: Sequelize.DATE,
				},
			},
			options
		);
	},

	down: async (queryInterface) => {
		options.tableName = 'Files';
		await queryInterface.dropTable(options);
	},
};
