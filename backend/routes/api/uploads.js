const express = require('express');
const multer = require('multer');
const {
	// uploadToS3,
	generateGetPresignedUrl,
	generatePutPresignedUrl,
} = require('../../utils/s3.js');
const {
	getUniqueFilename,
	validateFileExtension,
} = require('../../utils/filename');
const { User } = require('../../db/models');

const router = express.Router();

// Configure multer
// const storage = multer.memoryStorage(); // Store files in memory before uploading to S3
// const upload = multer({ storage });

// Generate a presigned URL for file upload
router.get('/upload-url', async (req, res) => {
	const { key, contentType, fileSize } = req.query;

	if (!key || !contentType || !fileSize) {
		return res
			.status(400)
			.json({ error: 'Key and contentType are required' });
	}

	// Validate file extension
	if (!validateFileExtension(key)) {
		return res
			.status(400)
			.json({
				error: 'Invalid file extension. Allowed extensions are png, jpg, jpeg, gif.',
			});
	}

	const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
	if (parseInt(fileSize, 10) > MAX_FILE_SIZE) {
		return res
			.status(400)
			.json({ error: 'File size exceeds the 5MB limit.' });
	}

	try {
		const uniqueKey = getUniqueFilename(key);
		const url = await generatePutPresignedUrl(uniqueKey, contentType);
		return res.status(200).json({ url, uniqueKey });
	} catch (error) {
		console.error('Error generating upload URL:', error);
		return res.status(500).json({ error: 'Failed to generate upload URL' });
	}
});

// Generate a presigned URL for file download
router.get('/download-url', async (req, res) => {
  const { key } = req.query;

  if (!key) {
    return res.status(400).json({ error: 'Key is required' });
  }

  try {
    const url = await generateGetPresignedUrl(key);
    return res.status(200).json({ url });
  } catch (error) {
    console.error('Error generating download URL:', error);
    return res.status(500).json({ error: 'Failed to generate download URL' });
  }
});

router.post('/upload', async (req, res) => {
	const { userId, fileUrl } = req.body;

	// Validate input
	if (!userId || !fileUrl) {
		return res
			.status(400)
			.json({ error: 'User ID and file URL are required' });
	}

	// Extract the key from the fileUrl
	const urlPath = new URL(fileUrl).pathname; // Extract the path from the URL
	const key = urlPath.startsWith('/') ? urlPath.slice(1) : urlPath; // Remove leading slash

	// Validate key prefix
	const expectedPrefix = 'uploads/';
	if (!key.startsWith(expectedPrefix)) {
		return res.status(400).json({ error: 'Invalid file URL format' });
	}

	try {
		// Find the user in the database
		const user = await User.findByPk(userId);
		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		// Save the key instead of the full URL
		user.profileImageUrl = key;
		await user.save();

		return res.status(200).json({
			message: 'File key saved successfully',
			key,
		});
	} catch (error) {
		console.error('Error saving file key:', error);
		return res.status(500).json({ error: 'Failed to save file key' });
	}
});

// router.post('/upload', async (req, res) => {
// 	const { userId, fileUrl } = req.body;
// 	const expectedPrefix = 'uploads/';
// 	const urlPath = new URL(fileUrl).pathname; // Extract the path from the URL
// 	const key = urlPath.startsWith('/') ? urlPath.slice(1) : urlPath; // Remove leading slash

// 	if (!key.startsWith(expectedPrefix)) {
// 		return res.status(400).json({ error: 'Invalid file URL format' });
// 	}

// 	// Validate input
// 	if (!userId || !fileUrl) {
// 		return res
// 			.status(400)
// 			.json({ error: 'User ID and file URL are required' });
// 	}

// 	try {
// 		// Find the user in the database
// 		const user = await User.findByPk(userId);
// 		if (!user) {
// 			return res.status(404).json({ error: 'User not found' });
// 		}

// 		// Update the user's profile image URL
// 		user.profileImageUrl = fileUrl;
// 		await user.save();

// 		return res.status(200).json({
// 			message: 'File URL saved successfully',
// 			url: fileUrl,
// 		});
// 	} catch (error) {
// 		console.error('Error saving file URL:', error);
// 		return res.status(500).json({ error: 'Failed to save file URL' });
// 	}
// });

module.exports = router;

// // File upload endpoint
// router.post('/upload', upload.single('file'), async (req, res) => {
// 	const file = req.file;

// 	if (!file) {
// 		return res.status(400).json({ error: 'No file uploaded' });
//   }

// 	try {
// 		const key = `uploads/${getUniqueFilename(file.originalname)}`; // Define the file path in the bucket
// 		const result = await uploadToS3(file.buffer, key, file.mimetype);

// 		return res.status(200).json({
// 			message: 'File uploaded successfully',
// 			url: result.Location, // S3 URL
// 		});
// 	} catch (err) {
// 		console.error(err);
// 		return res.status(500).json({ error: 'Failed to upload file' });
// 	}
// });