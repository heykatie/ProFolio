'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn(
			'Users',
			'profileImageUrl',
			{
				type: Sequelize.STRING,
				allowNull: true, // Allow null initially if not all users will have an image
			},
			options
		);
	},

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
		await queryInterface.removeColumn('Users', 'profileImageUrl');
	},
};