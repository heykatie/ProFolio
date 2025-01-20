const express = require('express');
const multer = require('multer');
// const uploadToS3 = require('../../utils/s3.js').uploadToS3;
const {
	uploadToS3,
	generateGetPresignedUrl,
	generatePutPresignedUrl,
} = require('../../utils/s3.js');
const {
	getUniqueFilename,
	validateFileExtension,
} = require('../../utils/filename');

const router = express.Router();

// Configure multer
const storage = multer.memoryStorage(); // Store files in memory before uploading to S3
const upload = multer({ storage });

// Generate a presigned URL for file upload
router.get('/upload-url', async (req, res) => {
	const { key, contentType } = req.query;

	if (!key || !contentType) {
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

	try {
		const uniqueKey = `uploads/${getUniqueFilename(key)}`;
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

// File upload endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
	const file = req.file;

	if (!file) {
		return res.status(400).json({ error: 'No file uploaded' });
	}

	// Validate file extension
	if (!validateFileExtension(file.originalname)) {
		return res
			.status(400)
			.json({
				error: 'Invalid file extension. Allowed extensions are png, jpg, jpeg, gif.',
			});
	}

	try {
		const key = `uploads/${getUniqueFilename(file.originalname)}`; // Define the file path in the bucket
		const result = await uploadToS3(file.buffer, key, file.mimetype);

		return res.status(200).json({
			message: 'File uploaded successfully',
			url: result.Location, // S3 URL
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: 'Failed to upload file' });
	}
});

module.exports = router;
