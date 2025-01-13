const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

// Create a variable called isProduction that will be true if the environment
// is in production or not by checking the environment key in the configuration
// file (backend/config/index.js):
const { environment } = require('./config');
const isProduction = environment === 'production';

// import routes
const routes = require('./routes');

// Initialize the Express application:
const app = express();

// Connect the morgan middleware for logging information about requests and
// responses:
app.use(morgan('dev'));

// Add the cookie-parser middleware for parsing cookies and the express.json
// middleware for parsing JSON bodies of requests with Content-Type of
// "application/json".
app.use(cookieParser());
app.use(express.json());

// pre-request security middlewares

/* Only allow CORS (Cross-Origin Resource Sharing) in development using the
cors middleware because the React frontend will be served from a different
server than the Express server. CORS isn’t needed in production since all of our
React and Express resources will come from the same origin. CORS */

/* Enable better overall security with the helmet middleware */

if (!isProduction) {
  // enable cors only in development
  app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"  // allow images with URLs to render in deployment
  })
);

// csurf middleware adds a hidden CSRF token to forms or API requests.
// Set the _csrf token and create req.csrfToken method
// will add a _csrf cookie that is HTTP-only (can’t be read by JavaScript) to any server response
// adds a method on all requests (req.csrfToken) that will be set to another cookie (XSRF-TOKEN)
// These two cookies work together to provide CSRF (Cross-Site Request Forgery) protection
app.use(
	csurf({
		cookie: {
			secure: isProduction, // Use secure cookies (HTTPS only) in production
			sameSite: isProduction && 'Lax', // Prevents cross-site usage of the cookie unless coming from the same site
			httpOnly: true, // Prevents JavaScript from reading the cookie (for security)
		},
	})
);

// connect all the routes
app.use(routes)

// export app
module.exports = app;