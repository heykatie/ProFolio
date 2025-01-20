const { v4: uuidv4 } = require('uuid');

/**
 * Generate a unique filename using uuid.
 * @param {string} originalFilename - The original filename (e.g., "image.png").
 * @returns {string} - A unique filename (e.g., "unique-id-image.png").
 */
const getUniqueFilename = (originalFilename) => {
	const uuid = uuidv4(); // Generate a unique identifier
	const fileExtension = originalFilename.split('.').pop(); // Get file extension
	return `${uuid}-${Date.now()}.${fileExtension}`; // Combine UUID, timestamp, and extension
};

module.exports = getUniqueFilename;
