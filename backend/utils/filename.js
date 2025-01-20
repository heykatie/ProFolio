const { v4: uuidv4 } = require('uuid');

const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif'];

/**
 * Validate if the file extension is allowed.
 * @param {string} filename - The original filename (e.g., "image.png").
 * @returns {boolean} - Returns true if the extension is allowed, false otherwise.
 */
const validateFileExtension = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext);
};

/**
 * Generate a unique filename using uuid.
 * @param {string} originalFilename - The original filename (e.g., "image.png").
 * @returns {string} - A unique filename (e.g., "unique-id-image.png").
 */
const getUniqueFilename = (originalFilename) => {
	const uuid = uuidv4(); // Generate a unique identifier
	const fileExtension = originalFilename.split('.').pop().toLowerCase(); // Get file extension
	return `${uuid}-${Date.now()}.${fileExtension}`; // Combine UUID, timestamp, and extension
};

module.exports = { getUniqueFilename, validateFileExtension }