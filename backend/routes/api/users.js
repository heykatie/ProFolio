const express = require('express');
const validateSignup = require('./validations');
const { requireAuth } = require('../../utils/auth');
const {
	createUser,
	deleteUser,
	updateUser,
	getUserById,
	getUser,
} = require('../../controllers/users');

const router = express.Router();

// Sign up
router.post('/', validateSignup, createUser);

// Get user profile by id
router.get('/:userId', getUserById);

// Update user profile
router.put('/:userId', requireAuth, updateUser);

// Delete user profile
router.delete('/:userId', requireAuth, deleteUser);

module.exports = router;
