const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../db/models/user')

// Serialize user for session
passport.serializeUser((user, done) => {
	done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findByPk(id);
		done(null, user);
	} catch (err) {
		done(err, null);
	}
});

// Google OAuth Strategy
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: '/api/auth/google/callback',
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const [user] = await User.findOrCreate({
					where: { googleId: profile.id },
					defaults: {
						username: profile.displayName,
						email: profile.emails[0].value,
					},
				});
				done(null, user);
			} catch (err) {
				done(err, null);
			}
		}
	)
);

// LinkedIn OAuth Strategy
passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: '/api/auth/linkedin/callback',
      scope: ['r_liteprofile', 'r_emailaddress'], // Ensure these are correct
      state: true, // Recommended for security
    },
		async (accessToken, refreshToken, profile, done) => {
      try {
				// Logic for finding or creating a user in the database
				const [user] = await User.findOrCreate({
					where: { linkedinId: profile.id },
					defaults: {
						username: profile.displayName,
						email: profile.emails?.[0]?.value || null, // Safely access email
					},
				});
				done(null, user);
			} catch (err) {
				done(err, null);
			}
		}
	)
);

// profile.emails?.[0]?.value || `${profile.id}@linkedin.com`,

// passport.use(
// 	new LinkedInStrategy(
// 		{
// 			clientID: process.env.LINKEDIN_CLIENT_ID,
// 			clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
// 			callbackURL: '/api/auth/linkedin/callback',
// 		},
// 		async (accessToken, refreshToken, profile, done) => {
// 			try {
// 				const [user] = await User.findOrCreate({
// 					where: { linkedinId: profile.id },
// 					defaults: {
// 						username: profile.displayName,
// 					},
// 				});
// 				done(null, user);
// 			} catch (err) {
// 				done(err, null);
// 			}
// 		}
// 	)
// );

// passport.use(
// 	new LinkedInStrategy(
// 		{
// 			clientID: process.env.LINKEDIN_CLIENT_ID,
// 			clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
// 			callbackURL: '/api/auth/linkedin/callback',
// 			scope: ['r_liteprofile', 'r_emailaddress'], // Requesting profile and email
// 			state: true, // Recommended for security (prevents CSRF attacks)
// 		},
// 		(accessToken, refreshToken, profile, done) => {
// 			// Handle the user profile
// 			User.findOrCreate({ where: { linkedinId: profile.id } })
// 				.then(([user]) => done(null, user))
// 				.catch((err) => done(err));
// 		}
// 	)
// );

// GitHub OAuth Strategy
passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: '/api/auth/github/callback',
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const [user] = await User.findOrCreate({
					where: { githubId: profile.id },
					defaults: {
						username: profile.username,
						email: profile.emails[0].value,
					},
				});
				done(null, user);
			} catch (err) {
				done(err, null);
			}
		}
	)
);

module.exports = passport;
