'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn(
			{ tableName: 'Users', schema: options.schema }, // Include schema in table reference
			'profileImageUrl',
			{
				type: Sequelize.STRING,
				allowNull: true, // Allow null initially if not all users will have an image
			}
		);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn(
			{ tableName: 'Users', schema: options.schema }, // Ensure schema consistency
			'profileImageUrl'
		);
	},
};
