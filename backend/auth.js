const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

// Mock function to find or create user in database
async function findOrCreateUser(profile) {
	// Replace this with your database logic
	console.log(profile); // Profile contains user data from the provider
	return { id: profile.id, username: profile.displayName };
}

// Google Strategy
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: '/api/auth/google/callback',
		},
		async (accessToken, refreshToken, profile, done) => {
			const user = await findOrCreateUser(profile);
			done(null, user);
		}
	)
);

// LinkedIn Strategy
passport.use(
	new LinkedInStrategy(
		{
			clientID: process.env.LINKEDIN_CLIENT_ID,
			clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
			callbackURL: '/api/auth/linkedin/callback',
			scope: ['r_emailaddress', 'r_liteprofile'], // Request email and profile info
		},
		async (accessToken, refreshToken, profile, done) => {
			const user = await findOrCreateUser(profile);
			done(null, user);
		}
	)
);

// GitHub Strategy
passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: '/api/auth/github/callback',
		},
		async (accessToken, refreshToken, profile, done) => {
			const user = await findOrCreateUser(profile);
			done(null, user);
		}
	)
);

// Serialize and Deserialize User
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
	// Mock user lookup by ID
	done(null, { id, username: 'mockUser' });
});
