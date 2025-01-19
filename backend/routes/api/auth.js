const express = require('express');
const passport = require('passport');
// const { ensureAuthenticated } = require('../middleware/auth');
const router = express.Router();

// Google Routes
router.get(
	'/google',
	passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/login',
		session: true, // Enables session support for Google login
	}),
	(req, res) => {
		// Successful login, redirect to the homepage or dashboard
		res.redirect('/');
	}
);

// Configure LinkedIn OAuth
router.get(
  '/linkedin',
  passport.authenticate('linkedin', { scope: ['profile', 'email'] })
);
router.get(
	'/linkedin/callback',
	passport.authenticate('linkedin', {
		failureRedirect: '/login',
		session: true,
	}),
	(req, res) => {
		res.redirect('/');
	}
);

// GitHub Routes
router.get(
	'/github',
	passport.authenticate('github', { scope: ['user:email'] })
);
router.get(
	'/github/callback',
	passport.authenticate('github', {
		failureRedirect: '/login',
		session: true,
	}),
	(req, res) => {
		res.redirect('/');
	}
);

module.exports = router;
