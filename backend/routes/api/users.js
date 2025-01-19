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
router.get('/:id', getUserProfile);

// Update user profile
router.put('/:userId', requireAuth, updateUserProfile);

// Delete user profile
router.delete('/:userId', requireAuth, deleteUserProfile);

module.exports = router;
