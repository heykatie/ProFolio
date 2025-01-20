const {
	S3Client,
	GetObjectCommand,
	PutObjectCommand,
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

module.exports = {
	generatePutPresignedUrl,
	generateGetPresignedUrl,
};
