const { User } = require('../../db/models');
const { setTokenCookie } = require('../../utils/auth');
const { Sequelize } = require('sequelize');

// Create User (Sign Up)
const createUser = async (req, res) => {
	const { email, password, username, firstName, lastName, phone } = req.body;

		const user = await User.create({
			email,
			password,
			username,
			firstName,
			lastName,
			phone,
		});
		return res.status(201).json({ user });
};

// Get User Profile
const readUser = async (req, res, next) => {
	const { userId } = req.params;
	const user = await User.findOne({
		where: { id: userId },
	});

	if (!user) {
		const err = new Error('User not found');
		err.status = 404;
		throw err;
	}

	return res.json({ user: user });
};

// Update User Profile
const updateUser = async (req, res, next) => {
	const { userId } = req.params; // Profile being updated
	const { id: loggedInUserId } = req.user; // Extract logged-in user ID from the request (assumes authentication middleware sets req.user)

	// Find the user to update
	const user = await User.findOne({ where: { id: userId } });

	if (!user) {
		const err = new Error('User not found');
		err.status = 404;
		throw err;
	}

	// Authorization check
	if (user.id !== loggedInUserId) {
		const err = new Error('Unauthorized to update this profile');
		err.status = 403; // Forbidden
		throw err;
	}

	// Update the user's profile
	try {
		const updatedUser = await user.update(req.body);
		return res.json({ user: updatedUser });
	} catch (err) {
		throw err
	}

};

// Delete User Profile
const deleteUser = async (req, res, next) => {
	const { userId } = req.params; // Profile to delete
	const { id: loggedInUserId } = req.user; // Extract logged-in user ID from authentication middleware

	// Find the user to delete
	const user = await User.findOne({ where: { id: userId } });

	if (!user) {
		const err = new Error('User not found');
		err.status = 404;
		throw err;
	}

	// Authorization check
	if (user.id !== loggedInUserId) {
		const err = new Error('Unauthorized to delete this profile');
		err.status = 403; // Forbidden
		throw err;
	}

	// Delete the user's profile
	await user.destroy();

	return res.json({ message: 'User deleted successfully' });
};

module.exports = {
	createUser,
	readUser,
	updateUser,
	deleteUser,
};
