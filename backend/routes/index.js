// create express router
const express = require('express');
const router = express.Router();
const apiRouter = require('./api'); // import api router

router.use('/api', apiRouter); // add api router to express router

// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});

// test route
// router.get('/hello/world', function (req, res) {
// 	res.cookie('XSRF-TOKEN', req.csrfToken());
// 	res.send('Hello World!');
// });

// Export the router
module.exports = router;