const express = require('express');
const {
	generateGetPresignedUrl,
	generatePutPresignedUrl,
} = require('../../utils/s3.js');
const {
	getUniqueFilename,
	validateFileExtension,
} = require('../../utils/filename');
const { User } = require('../../db/models');

const router = express.Router();

router.get('/upload-url', async (req, res) => {
	const { key, contentType, fileSize } = req.query;

	if (!key || !contentType || !fileSize) {
		return res
			.status(400)
			.json({ error: 'Key, contentType, and fileSize are required' });
	}

	if (!validateFileExtension(key)) {
		return res
			.status(400)
			.json({
				error: 'Invalid file extension. Allowed extensions: png, jpg, jpeg, gif',
			});
	}

	const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
	if (parseInt(fileSize, 10) > MAX_FILE_SIZE) {
		return res
			.status(400)
			.json({ error: 'File size exceeds the 5MB limit.' });
	}

	try {
		const uniqueKey = `uploads/${getUniqueFilename(key)}`;
		const url = await generatePutPresignedUrl(uniqueKey, contentType);
		res.status(200).json({ url, uniqueKey });
	} catch (error) {
		console.error('Error generating upload URL:', error);
		res.status(500).json({ error: 'Failed to generate upload URL' });
	}
});

router.post('/upload', async (req, res) => {
	const { userId, fileUrl } = req.body;

	if (!userId || !fileUrl) {
		return res
			.status(400)
			.json({ error: 'User ID and file URL are required' });
	}

	// If the fileUrl is a full URL, extract the key
	let key;
	if (fileUrl.startsWith('https://')) {
		const keyMatch = fileUrl.match(/^https:\/\/.+\/(.+)$/);
		key = keyMatch ? keyMatch[1] : null;
	} else {
		// Assume fileUrl is the key
		key = fileUrl;
	}

	if (!key) {
		return res.status(400).json({ error: 'Invalid file URL format' });
	}

	try {
		const user = await User.findByPk(userId);
		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		// Save the S3 URL with the correct bucket and region
		user.profileImageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
		await user.save();

		res.status(200).json({
			message: 'File key saved successfully',
			key,
		});
	} catch (error) {
		console.error('Error saving file key:', error);
		res.status(500).json({ error: 'Failed to save file key' });
	}
});

module.exports = router;
