const express = require('express');
const validateSignup = require('./validations');
const { requireAuth } = require('../../utils/auth');
const {
	createUser,
	getUserProfile,
	updateUserProfile,
	deleteUserProfile,
	getUserProfileById,
} = require('../../controllers/users');

const router = express.Router();

// Sign up
router.post('/', validateSignup, createUser);

// Get user profile by username
router.get('/:username', getUserProfile);

// Get user profile by id
router.get('/:userId', getUserProfileById);

// Update user profile
router.put('/:userId', requireAuth, updateUserProfile);

// Delete user profile
router.delete('/:userId', requireAuth, deleteUserProfile);

module.exports = router;
