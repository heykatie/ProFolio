const express = require('express');
const validateSignup = require('./validations');
const { requireAuth } = require('../../utils/auth');
const {
	createUser,
	getUserProfile,
	updateUserProfile,
	deleteUserProfile,
} = require('../../controllers/users');

const router = express.Router();

// Sign up
router.post('/', validateSignup, createUser);

// Get user profile by username
router.get('/:username', getUserProfile);

// Update user profile
router.put('/:username', requireAuth, updateUserProfile);

// Delete user profile
router.delete('/:username',requireAuth, deleteUserProfile);

module.exports = router;
