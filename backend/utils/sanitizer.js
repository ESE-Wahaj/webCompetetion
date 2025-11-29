/**
 * XSS Prevention Utilities
 * Sanitize user inputs to prevent cross-site scripting attacks
 */

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHTML(text) {
  if (typeof text !== 'string') return text;

  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Remove script tags and dangerous content
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
function stripScriptTags(text) {
  if (typeof text !== 'string') return text;

  // Remove script tags and their content
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers
  text = text.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  text = text.replace(/on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: protocol
  text = text.replace(/javascript:/gi, '');

  return text;
}

/**
 * Sanitize search query
 * @param {string} query - Search query to sanitize
 * @returns {string} Sanitized query
 */
function sanitizeSearchQuery(query) {
  if (typeof query !== 'string') return '';

  // Remove special SQL characters
  query = query.replace(/[;'"\\]/g, '');

  // Trim and limit length
  query = query.trim().substring(0, 100);

  return query;
}

/**
 * Sanitize user input for database
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
function cleanUserInput(input) {
  if (typeof input !== 'string') return input;

  // Strip dangerous content
  input = stripScriptTags(input);

  // Trim whitespace
  input = input.trim();

  return input;
}

/**
 * Sanitize object properties
 * @param {Object} obj - Object to sanitize
 * @param {Array} fields - Fields to sanitize
 * @returns {Object} Sanitized object
 */
function sanitizeObject(obj, fields) {
  const sanitized = { ...obj };

  fields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = cleanUserInput(sanitized[field]);
    }
  });

  return sanitized;
}

module.exports = {
  escapeHTML,
  stripScriptTags,
  sanitizeSearchQuery,
  cleanUserInput,
  sanitizeObject
};
