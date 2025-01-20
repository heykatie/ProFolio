const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.themePreference || 'light' );
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// update user's theme preference
router.put('/update', requireAuth, async (req, res) => {
    const { theme } = req.body;

    if (!['light', 'dark'].includes(theme)) {
        return res.status(400).json({ error: 'Invalid theme value' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

  user.themePreference = theme;
  user.save()
    return await res.json( user.themePreference );
});

module.exports = router;