const { User } = require('../db/models');
const { setTokenCookie } = require('../utils/auth');

// Create User (Sign Up)
const createUser = async (req, res, next) => {
	const { email, password, username, firstName, lastName, phone } = req.body;

	try {
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
		err.status = 400; // Bad request
		err.title = 'Sign-up failed';
		err.errors = err.errors || ['An unexpected error occurred.'];
		return next(err);
	}
};

// Get User Profile
const getUserProfile = async (req, res, next) => {
	const { id } = req.params;

	try {
		const user = await User.findOne({
			where: { id },
			attributes: [
				'id',
				'username',
				'email',
				'firstName',
				'lastName',
				'bio',
				'avatarUrl',
			],
		});

		if (!user) {
			const err = new Error('User not found');
			err.status = 404;
			throw err;
		}

		res.json({ user });
	} catch (err) {
		next(err);
	}
};

// Update User Profile
const updateUserProfile = async (req, res, next) => {
	const { userId } = req.params; // Profile being updated
	const { id: loggedInUserId } = req.user; // Extract logged-in user ID from the request (assumes authentication middleware sets req.user)

	const { firstName, lastName, bio, avatarUrl, location, career, pronouns } =
		req.body;

	try {
		// Find the user to update
		const user = await User.findOne({ where: { userId } });

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
		await user.update({
			firstName,
			lastName,
			bio,
			avatarUrl,
			location,
			career,
			pronouns,
		});

		const updatedUser = {
			id: user.id,
			username: user.username,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			bio: user.bio,
			avatarUrl: user.avatarUrl,
			location: user.location,
			career: user.career,
			pronouns: user.pronouns,
		};

		res.json({ user: updatedUser });
	} catch (err) {
		next(err);
	}
};

// Delete User Profile
const deleteUserProfile = async (req, res, next) => {
	const { userId } = req.params; // Profile to delete
	const { id: loggedInUserId } = req.user; // Extract logged-in user ID from authentication middleware

	try {
		// Find the user to delete
		const user = await User.findOne({ where: { userId } });

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

		res.json({ message: 'User deleted successfully' });
	} catch (err) {
		next(err);
	}
};

module.exports = {
	createUser,
	getUserProfile,
	updateUserProfile,
	deleteUserProfile,
};
