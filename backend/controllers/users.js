const { User } = require('../db/models');
const { setTokenCookie } = require('../utils/auth');
const { ValidationError } = require('sequelize');

// Create User (Sign Up)
const createUser = async (req, res, next) => {
	try {
		const { email, password, username, firstName, lastName, phone } =
			req.body;

		const user = await User.create({
			email,
			password,
			username,
			firstName,
			lastName,
			phone,
		});

		const safeUser = {
			id: user.id,
			email: user.email,
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
			phone: user.phone || null,
		};

		await setTokenCookie(res, safeUser);
		return res.json({ user: safeUser });
	} catch (err) {
		if (err instanceof ValidationError) {
			const errors = {};
			err.errors.forEach((error) => {
				errors[error.path] = error.message;
			});
			return res.status(400).json({ errors });
		}
		console.error('Unexpected error:', err);
	}
};

// Get User Profile by ID
const getUserById = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const user = await User.findByPk(userId);

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		return res.json(user);
	} catch (err) {
		next(err);
	}
};

// Update User Profile
const updateUser = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const { id: loggedInUserId } = req.user;
		const {
			email,
			phone,
			firstName,
			lastName,
			bio,
			avatarUrl,
			location,
			career,
			pronouns,
		} = req.body;

		const user = await User.findByPk(userId);

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		if (user.id !== loggedInUserId) {
			return res
				.status(403)
				.json({ message: 'Unauthorized to update this profile' });
		}

		await user.update({
			firstName,
			lastName,
			bio,
			avatarUrl,
			location,
			career,
			pronouns,
			phone,
			email,
		});

		return res.json({ user });
	} catch (err) {
		next(err);
	}
};

// Delete User Profile
const deleteUser = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const { id: loggedInUserId } = req.user;

		const user = await User.findByPk(userId);

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		if (user.id !== loggedInUserId) {
			return res
				.status(403)
				.json({ message: 'Unauthorized to delete this profile' });
		}

		await user.destroy();
		return res.json({ message: 'User deleted successfully' });
	} catch (err) {
		next(err);
	}
};

module.exports = {
	createUser,
	getUserById,
	updateUser,
	deleteUser,
};
