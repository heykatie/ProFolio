'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			'Feedback',
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
					references: { model: 'users', key: 'id' }, // Foreign key
					onDelete: 'CASCADE',
				},
				authorName: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				message: {
					type: Sequelize.TEXT,
					allowNull: false,
				},
				rating: {
					type: Sequelize.INTEGER,
					allowNull: true,
					validate: { min: 1, max: 5 }, // Optional validation
				},
				isPublic: {
					type: Sequelize.BOOLEAN,
					defaultValue: true,
				},
				portfolioId: {
					type: Sequelize.INTEGER,
					allowNull: true,
				},
				createdAt: {
					allowNull: false,
					type: Sequelize.DATE,
					defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
				},
				updatedAt: {
					allowNull: false,
					type: Sequelize.DATE,
					defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
				},
			},
			options
		);
	},

  async down(queryInterface, Sequelize) {
    options.tableName = 'Feedback';
		await queryInterface.dropTable(options);
	},
};
