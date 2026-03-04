/**
 * Wraps async route handlers to catch errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Parse pagination params from query string
 */
const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 20));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

/**
 * Generate a unique filename for uploads
 */
const generateFileName = (originalName) => {
  const { v4: uuidv4 } = require('uuid');
  const ext = originalName.split('.').pop();
  return `${uuidv4()}.${ext}`;
};

module.exports = {
  asyncHandler,
  parsePagination,
  generateFileName,
};
