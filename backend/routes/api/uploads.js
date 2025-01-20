const express = require('express');
const multer = require('multer');
// const uploadToS3 = require('../../utils/s3.js').uploadToS3;
const {
	uploadToS3,
	generateGetPresignedUrl,
	generatePutPresignedUrl,
} = require('../../utils/s3.js');

const router = express.Router();

// Configure multer
const storage = multer.memoryStorage(); // Store files in memory before uploading to S3
const upload = multer({ storage });

// Generate a presigned URL for file upload
router.get('/upload-url', async (req, res) => {
  const { key, contentType } = req.query;

  if (!key || !contentType) {
    return res.status(400).json({ error: 'Key and contentType are required' });
  }

  try {
    const url = await generatePutPresignedUrl(key, contentType);
    return res.status(200).json({ url });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

// Generate a presigned URL for file upload
router.get('/upload-url', async (req, res) => {
  const { key, contentType } = req.query;

  if (!key || !contentType) {
    return res.status(400).json({ error: 'Key and contentType are required' });
  }

  try {
    const url = await generatePutPresignedUrl(key, contentType);
    return res.status(200).json({ url });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

// File upload endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
	const file = req.file;

	if (!file) {
		return res.status(400).json({ error: 'No file uploaded' });
	}

	try {
		const key = `uploads/${file.originalname}`; // Define the file path in the bucket
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
