const express = require('express');
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const zxcvbn = require('zxcvbn');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email.')
    .isLength({ max: 256 })
    .withMessage('Email must be less than 256 characters.'),

  check('username')
    .optional({ checkFalsy: true }) // Username can be null
    .isLength({ min: 4, max: 30 })
    .withMessage('Username must be between 4 and 30 characters.')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),

  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required.')
    .isLength({ min: 8, max: 100 })
    .withMessage('Password must be between 8 and 100 characters.')
    .custom((value) => {
      const passwordResult = zxcvbn(value);
      if (passwordResult.score < 3) {
        throw new Error(`Password is too weak: ${passwordResult.feedback.suggestions.join(' ')}`);
      }
      return true;
    }),

  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('First name is required.')
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters.')
    .isAlpha()
    .withMessage('First name must contain only letters.'),

  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Last name is required.')
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters.')
    .isAlpha()
    .withMessage('Last name must contain only letters.'),

  check('phone')
    .optional({ checkFalsy: true }) // Phone is optional
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone number must be between 10 and 15 digits.')
    .isNumeric()
    .withMessage('Phone number must contain only numbers.'),

  check('themePreference')
    .optional({ checkFalsy: true })
    .isIn(['light', 'dark', 'system'])
    .withMessage('Theme preference must be "light", "dark", or "system".'),

  check('pronouns')
    .optional({ checkFalsy: true })
    .isLength({ max: 30 })
    .withMessage('Pronouns must be less than 30 characters.'),

  check('location')
    .optional({ checkFalsy: true })
    .isLength({ max: 100 })
    .withMessage('Location must be less than 100 characters.'),

  check('company')
    .optional({ checkFalsy: true })
    .isLength({ max: 100 })
    .withMessage('Company name must be less than 100 characters.'),

  check('career')
    .optional({ checkFalsy: true })
    .isLength({ max: 100 })
    .withMessage('Career must be less than 100 characters.'),

  handleValidationErrors,
];

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
});

module.exports = router;