const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { ValidationError } = require('sequelize');

// Create a variable called isProduction that will be true if the environment
// is in production or not by checking the environment key in the configuration
// file (backend/config/index.js):
const { environment } = require('./config');
const isProduction = environment === 'production';

// Initialize the Express application:
const app = express();

// import routes
const routes = require('./routes');

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

// middleware: catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

// error-handling middleware: process sequelize errors
app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = 'Validation error';
    err.errors = errors;
  }
  next(err);
});

// Error formatter
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  });
});

// export app
module.exports = app;