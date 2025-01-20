const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const {
	S3Client,
	GetObjectCommand,
	PutObjectCommand,
	DeleteObjectCommand,
} = require('@aws-sdk/client-s3');
const config = require('dotenv').config;

config(); // Load .env variables

// Create an S3 client
const s3 = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS,
		secretAccessKey: process.env.AWS_SECRET,
	},
});

console.log('AWS Region:', process.env.AWS_REGION);
console.log('AWS Access Key:', process.env.AWS_ACCESS);
console.log('AWS Secret Key:', process.env.AWS_SECRET);

// Generate a presigned URL for downloading a file (GET)
// const generateGetPresignedUrl = async (key) => {
//   const params = {
// 		Bucket: process.env.AWS_BUCKET_NAME,
// 		Key: key, // File path in the bucket
//   };

//   const command = new GetObjectCommand(params);
//   const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1-hour expiration
// 	return url;
// };

const generateGetPresignedUrl = async (key) => {
	const client = new S3Client({ region: process.env.AWS_REGION });
	const command = new GetObjectCommand({
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: key.startsWith('uploads/') ? key : `uploads/${key}`,
	});

	try {
		const url = await getSignedUrl(client, command, { expiresIn: 3600 }); // 1-hour expiration
		console.log('Generated Presigned Download URL:', url);
		return url;
	} catch (error) {
		console.error('Error generating download URL:', error);
		throw error;
	}
};

// Generate a presigned URL for uploading a file (PUT)
const generatePutPresignedUrl = async (key, contentType) => {
  const params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: key.startsWith('uploads/') ? key : `uploads/${key}`, // File path in the bucket
		ContentType: contentType, // Ensure correct content type
  };

  const command = new PutObjectCommand(params);
	try {
		const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1-hour expiration
		console.log('Generated Presigned URL:', url); // Debug output
		return url;
	} catch (error) {
		console.error('Error generating presigned URL:', error);
		throw new Error('Failed to generate upload URL');
	}
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

const testGeneratePutPresignedUrl = async () => {
	try {
		const url = await generatePutPresignedUrl(
			'test-file.png', // Example key
			'image/png' // Example content type
		);
		console.log('Test Presigned URL:', url);
	} catch (error) {
		console.error('Test Error:', error.message);
	}
};

testGeneratePutPresignedUrl();

// const testGenerateGetPresignedUrl = async () => {
// 	try {
// 		const url = await generateGetPresignedUrl(
// 			'uploads/16b5b84f-362f-4fcf-86a2-45e91dd35278-1737362717369.jpeg'
// 		);
// 		console.log('Generated Download URL:', url);
// 	} catch (error) {
// 		console.error('Test Error:', error.message);
// 	}
// };

// testGenerateGetPresignedUrl();

module.exports = {
	uploadToS3,
	deleteFromS3,
	generateGetPresignedUrl,
	generatePutPresignedUrl,
};