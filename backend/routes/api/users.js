const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const validateSignup  = require('./validations');

const router = express.Router();

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res, next) => {
    const { email, password, username, firstName, lastName, phone } = req.body;

    try {
      // Create a new user with the plain-text `password`
      const user = await User.create({ email, password, username, firstName, lastName, phone });

      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || null
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser,
      });
    } catch (err) {
      err.status = 400; // Bad request
      err.title = 'Sign-up failed';
      err.errors = err.errors || ['An unexpected error occurred.'];
      return next(err);
    }
  }
);

// Get user profile by username
router.get('/:username', async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({
      where: { username },
      attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'bio', 'avatarUrl'],
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
  return res;
});

module.exports = router;