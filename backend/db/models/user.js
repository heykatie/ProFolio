'use strict';

const { Model, Validator } = require('sequelize');
const { parsePhoneNumberFromString } = require('libphonenumber-js');
const moment = require('moment-timezone');
const PasswordValidator = require('password-validator');
const validator = require('validator');
const zxcvbn = require('zxcvbn');	// Password strength checker
const bcrypt = require('bcryptjs');

const schema = new PasswordValidator();

schema
  .is().min(8) // Minimum length 8
  .is().max(100) // Maximum length 100
  .has().uppercase() // Must have uppercase letters
  .has().lowercase() // Must have lowercase letters
  .has().digits() // Must have digits
  .has().not().spaces(); // Should not have spaces

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			// define association here
		}
	}

	User.init(
		{
			username: {
				type: DataTypes.STRING,
				allowNull: true,
				unique: true,
				validate: {
					len: [4, 30],
					isNotEmail(value) {
						if (/\S+@\S+\.\S+/.test(value)) {
							throw new Error('Username cannot be an email address.');
						}
					},
					// isEmptyStringAllowed(value) {
					// 	if (value === '') {
					// 		return; // Allow empty string
					// 	}
					// 	if (value && value.length < 4) {
					// 		throw new Error(
					// 			'Username must be at least 4 characters long.'
					// 		);
					// 	}
					// },
				},
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					len: [3, 256],
					isEmail: true,
				},
			},
			password: {
				type: DataTypes.VIRTUAL,
				validate: {
					isStrongPassword(value) {
						if (!schema.validate(value)) {
							throw new Error(
								'Password must meet strength requirements.'
							);
						}
					},
					isWeakPassword(value) {
						const score = zxcvbn(value).score;
						const passwordResult = zxcvbn(value);
						if (score < 3) {
							throw new Error(
								`Password is too weak: ${passwordResult.feedback.suggestions.join(
									' '
								)}`
							);
						}
					},
				},
			},
			passwordHash: {
				type: DataTypes.STRING.BINARY,
				allowNull: true,
				validate: {
					len: [60, 60], // Ensures the password hash length is exactly 60 characters (for bcrypt)
				},
			},
			phone: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					// isNumeric: true, // Ensures the value contains only numbers
					// len: [10, 15], // Allows between 10 to 15 digits for phone numbers
					validatePhone(value) {
						if (value) {
							try {
								const phoneNumber = parsePhoneNumberFromString(
									value,
									'US'
								);
								if (!phoneNumber || !phoneNumber.isValid()) {
									// console.log('Invalid phone number:', value);  // Log the problematic phone number
									throw new Error('Invalid phone number.');
								}
							} catch (err) {
								console.error(
									'Phone number validation error:',
									err.message
								);
								throw err; // Re-throw the error so it shows in the logs
							}
						}
					},
					isEmptyStringAllowed(value) {
						if (value === '') {
							return; // Allow empty string
						}
						if (value && value.length < 10) {
							throw new Error(
								'Phone must be a valid number.'
							);
						}
					},
				},
			},
			firstName: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: [1, 50], // Limits the length of the first name
					isAlpha: true,
				},
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: [1, 50], // Limits the length of the last name
					isAlpha: true,
				},
			},
			bio: {
				type: DataTypes.TEXT,
				allowNull: true,
				validate: {
					len: [0, 500], // Optional bio with max length of 500 characters
				},
			},
			avatarUrl: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					isUrl: true, // Ensures the avatar URL is a valid URL
				},
			},
			resumeUrl: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					isUrl: true, // Ensures the resume URL is a valid URL
				},
			},
			socialLinks: {
				type: DataTypes.JSON,
				allowNull: true,
			},
			themePreference: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					isIn: [['light', 'dark', 'system']], // Ensures the value is one of "light" or "dark"
				},
				defaultValue: 'light'
			},
			githubConnected: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			linkedinConnected: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			githubUrl: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					isUrl: true, // Ensures the GitHub URL is a valid URL
				},
			},
			linkedinUrl: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					isUrl: true, // Ensures the LinkedIn URL is a valid URL
				},
			},
			githubAccessToken: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			linkedinAccessToken: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			company: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					len: [0, 100], // Ensures the company name has a max length of 100 characters
				},
			},
			career: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					len: [0, 100], // Ensures the career field has a max length of 100 characters
				},
			},
			location: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					len: [0, 100], // Max length for location
				},
			},
			timezone: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					customValidator(value) {
						if (value && !moment.tz.zone(value)) {
							throw new Error('Invalid timezone.');
						}
					},
				},
			},
			pronouns: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					len: [0, 30], // Max length for pronouns
				},
			},
		},
		{
			sequelize,
			modelName: 'User',
			defaultScope: {
				attributes: {
					exclude: [
						'passwordHash',
						'email',
						'createdAt',
						'updatedAt',
						'githubAccessToken',
						'linkedinAccessToken',
						'phone',
					],
				},
			},
			hooks: {
				beforeCreate: async (user) => {
					if (user.password) {
						user.passwordHash = await bcrypt.hash(user.password, 10); // Hash password before saving
					}
					if (!user.username) {
						const firstName = user.firstName?.trim() || 'user';
						const lastName =
							user.lastName?.trim() || Math.floor(Math.random() * 1000); // Random number fallback
						user.username = `${firstName}${lastName}`.toLowerCase();
					}
				},
				beforeUpdate: async (user) => {
					if (user.password) {
						user.passwordHash = await bcrypt.hash(user.password, 10);
					}
				},
			},
		}
	);
	return User;
};
