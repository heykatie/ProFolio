const {
  S3Client,
  GetObjectCommand,
	PutObjectCommand,
	DeleteObjectCommand,
} = require('@aws-sdk/client-s3');
const config = require('dotenv').config;
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

config(); // Load .env variables

// Create an S3 client
const s3 = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS,
		secretAccessKey: process.env.AWS_SECRET,
	},
});

// Generate a presigned URL for downloading a file (GET)
const generateGetPresignedUrl = async (key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key, // File path in the bucket
  };

  const command = new GetObjectCommand(params);
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1-hour expiration
  return url;
};

// Generate a presigned URL for uploading a file (PUT)
const generatePutPresignedUrl = async (key, contentType) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key, // File path in the bucket
    ContentType: contentType, // Ensure correct content type
  };

  const command = new PutObjectCommand(params);
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1-hour expiration
  return url;
};

const uploadToS3 = async (fileBuffer, key, contentType) => {
	const params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: key, // File path in the bucket
		Body: fileBuffer,
		ContentType: contentType, // Ensure the correct content type
		ACL: 'public-read', // Make the file publicly readable
	};

	try {
		const command = new PutObjectCommand(params);
		const result = await s3.send(command);
		console.log('File uploaded successfully:', result);
		return {
			Location: `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
		};
	} catch (error) {
		console.error('Error uploading to S3:', error);
		throw error;
	}
};

const deleteFromS3 = async (key) => {
	const params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: key, // File path to delete
	};

	try {
		const command = new DeleteObjectCommand(params);
		await s3.send(command);
		console.log('File deleted successfully');
	} catch (error) {
		console.error('Error deleting from S3:', error);
		throw error;
	}
};

module.exports = {
	uploadToS3,
	deleteFromS3,
	generateGetPresignedUrl,
	generatePutPresignedUrl,
};
