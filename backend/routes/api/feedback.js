const express = require('express');
const router = express.Router();
const { Feedback } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// Get all feedback for a specific user
router.get('/:userId', async (req, res) => {
	const { userId } = req.params;
	const feedback = await Feedback.findAll({
		where: { userId, isPublic: true },
	});
	res.json(feedback);
});

// Create new feedback
router.post('/', async (req, res) => {
	const { userId, authorName, message, rating, isPublic, portfolioId } =
		req.body;

	try {
		const newFeedback = await Feedback.create({
			userId,
			authorName,
			message,
			rating,
      isPublic,
      portfolioId
		});
		res.status(201).json(newFeedback);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// Update feedback
router.put('/:id', requireAuth, async (req, res) => {
	const { id } = req.params;
	const { authorName, message, rating, isPublic } = req.body;

	const feedback = await Feedback.findByPk(id);
	if (!feedback) {
		return res.status(404).json({ error: 'Feedback not found' });
	}

	await feedback.update({ authorName, message, rating, isPublic });
	res.json(feedback);
});

// Delete feedback
router.delete('/:id', requireAuth, async (req, res) => {
	const { id } = req.params;

	const feedback = await Feedback.findByPk(id);
	if (!feedback) {
		return res.status(404).json({ error: 'Feedback not found' });
	}

	await feedback.destroy();
	res.status(204).end();
});

module.exports = router;
