const {
	S3Client,
	GetObjectCommand,
	PutObjectCommand,
	DeleteObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3 = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS,
		secretAccessKey: process.env.AWS_SECRET,
	},
});

const generatePutPresignedUrl = async (key, contentType) => {
	const params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: key,
		ContentType: contentType,
	};
	const command = new PutObjectCommand(params);
	return await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1-hour expiration
};

const generateGetPresignedUrl = async (key) => {
	const params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: `uploads/${key}`,
	};

	const command = new GetObjectCommand(params);
	return await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1-hour expiration
};

const s3Client = new S3Client({ region: process.env.AWS_REGION });

const deleteFromS3 = async (key) => {
	try {
		const command = new DeleteObjectCommand({
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: key, // The S3 object key (file path in the bucket)
		});
		await s3Client.send(command);
		console.log(`File deleted successfully: ${key}`);
		return { success: true };
	} catch (error) {
		console.error(`Failed to delete file: ${key}`, error);
		return { success: false, error: error.message };
	}
};

module.exports = {
	generatePutPresignedUrl,
	generateGetPresignedUrl,
	deleteFromS3,
};
