'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			'Users',
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				phone: {
					type: Sequelize.STRING,
					allowNull: true,
				},
				username: {
					type: Sequelize.STRING(30),
					allowNull: true,
					unique: true,
				},
				email: {
					type: Sequelize.STRING(256),
					allowNull: false,
					unique: true,
				},
				passwordHash: {
					type: Sequelize.STRING.BINARY,
					allowNull: false,
				},
				firstName: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				lastName: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				bio: {
					type: Sequelize.TEXT,
					allowNull: true,
				},
				avatarUrl: {
					type: Sequelize.STRING,
					allowNull: true,
				},
				resumeUrl: {
					type: Sequelize.STRING,
					allowNull: true,
				},
				socialLinks: {
					type: Sequelize.JSON,
					allowNull: true,
				},
				themePreference: {
					type: Sequelize.STRING,
					allowNull: true,
				},
				githubConnected: {
					type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: false,
				},
				linkedinConnected: {
					type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: false,
				},
				githubUrl: {
					type: Sequelize.STRING,
					allowNull: true,
				},
				linkedinUrl: {
					type: Sequelize.STRING,
					allowNull: true,
				},
				githubAccessToken: {
					type: Sequelize.STRING,
					allowNull: true,
				},
				linkedinAccessToken: {
					type: Sequelize.STRING,
					allowNull: true,
				},
				company: {
					type: Sequelize.STRING,
					allowNull: true,
				},
				career: {
					type: Sequelize.STRING,
					allowNull: true,
				},
				location: {
					type: Sequelize.STRING,
					allowNull: true,
				},
				timezone: {
					type: Sequelize.STRING,
					allowNull: true,
				},
				pronouns: {
					type: Sequelize.STRING,
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
		options.tableName = 'Users';
		return queryInterface.dropTable(options);
	},
};
