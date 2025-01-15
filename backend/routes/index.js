// create express router
const express = require('express');
const router = express.Router();
const apiRouter = require('./api'); // import api router

router.use('/api', apiRouter); // add api router to express router

// In production, the XSRF-TOKEN will be attached to the index.html file in
// the frontend/dist folder. In the backend/routes/index.js file, serve
// the index.html file at the / route and any routes that don’t start with
// /api. Along with it, attach the XSRF-TOKEN cookie to the response.

// Static routes
// Serve React build files in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  // Serve the frontend's index.html file at the root route
  router.get('/', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    return res.sendFile(
      path.resolve(__dirname, '../../frontend', 'dist', 'index.html')
    );
  });

  // Serve the static assets in the frontend's build folder
  router.use(express.static(path.resolve("../frontend/build")));

  // Serve the frontend's index.html file at all other routes NOT starting with /api
  router.get(/^(?!\/?api).*/, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    return res.sendFile(
      path.resolve(__dirname, '../../frontend', 'build', 'index.html')
    );
  });
}

// Add a XSRF-TOKEN cookie in development
if (process.env.NODE_ENV !== 'production') {
  router.get('/api/csrf/restore', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    return res.json({});
  });
}

// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});

// render health check route
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the API!' });
});

// test route
// router.get('/hello/world', function (req, res) {
// 	res.cookie('XSRF-TOKEN', req.csrfToken());
// 	res.send('Hello World!');
// });

// Export the router
module.exports = router;