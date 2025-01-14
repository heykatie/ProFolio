const router = require('express').Router(); // create express router
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const { restoreUser } = require('../../utils/auth.js'); // GET /api/restore-user

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
	// must be first middleware connected to router before any route handlers
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;

// auth test routes
// router.get(
//   '/restore-user',
//   (req, res) => {
//     return res.json(req.user);
//   }
// );

// GET /api/require-auth
// const { requireAuth } = require('../../utils/auth.js');
// router.get(
//   '/require-auth',
//   requireAuth,
//   (req, res) => {
//     return res.json(req.user);
//   }
// );

// GET /api/set-token-cookie
// const { setTokenCookie } = require('../../utils/auth.js');
// const { User } = require('../../db/models');
// router.get('/set-token-cookie', async (_req, res) => {
// 	const user = await User.findOne({
// 		where: {
// 			username: 'Demo-lition'
// 		}
// 	});
// 	setTokenCookie(res, user);
// 	return res.json({ user: user });
// });

// test api route
// router.post('/test', function (req, res) {
// 	res.json({ requestBody: req.body });
// });
