const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// Sign up
router.post(
  '/',
  async (req, res, next) => {
    const { email, password, username, firstName, lastName } = req.body;

    try {
      // Create a new user with the plain-text `password`
      const user = await User.create({ email, username, password, firstName, lastName });

      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
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

// router.post(
//   '/',
//   async (req, res) => {
//     const { email, password, username, firstName, lastName} = req.body;
//     const passwordHash = bcrypt.hashSync(password);
//     const user = await User.create({ email, username, passwordHash, firstName, lastName });

//     const safeUser = {
//       id: user.id,
//       email: user.email,
//       username: user.username,
//       firstName: user.firstName,
//       lastName: user.lastName,
//     };

//     await setTokenCookie(res, safeUser);

//     return res.json({
//       user: safeUser
//     });
//   }
// );

module.exports = router;