/**
 * Custom validation functions
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} {valid: boolean, message: string}
 */
function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required' };
  }

  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }

  if (password.length > 100) {
    return { valid: false, message: 'Password is too long' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }

  return { valid: true, message: 'Password is strong' };
}

/**
 * Validate price
 * @param {number} price - Price to validate
 * @returns {boolean} True if valid
 */
function isValidPrice(price) {
  const numPrice = parseFloat(price);
  return !isNaN(numPrice) && numPrice >= 0 && numPrice <= 999999.99;
}

/**
 * Validate quantity
 * @param {number} quantity - Quantity to validate
 * @returns {boolean} True if valid
 */
function isValidQuantity(quantity) {
  const numQty = parseInt(quantity, 10);
  return Number.isInteger(numQty) && numQty > 0 && numQty <= 10000;
}

/**
 * Validate product ID
 * @param {number} id - Product ID to validate
 * @returns {boolean} True if valid
 */
function isValidProductId(id) {
  const numId = parseInt(id, 10);
  return Number.isInteger(numId) && numId > 0;
}

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {Object} {valid: boolean, message: string}
 */
function validateUsername(username) {
  if (!username || typeof username !== 'string') {
    return { valid: false, message: 'Username is required' };
  }

  if (username.length < 3) {
    return { valid: false, message: 'Username must be at least 3 characters long' };
  }

  if (username.length > 50) {
    return { valid: false, message: 'Username is too long' };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, message: 'Username can only contain letters, numbers, and underscores' };
  }

  return { valid: true, message: 'Username is valid' };
}

/**
 * Validate card number (simple format validation)
 * @param {string} cardNumber - Card number to validate
 * @returns {boolean} True if valid format
 */
function isValidCardNumberFormat(cardNumber) {
  if (!cardNumber || typeof cardNumber !== 'string') return false;

  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '');

  // Check if 13-19 digits (common card lengths)
  if (!/^\d{13,19}$/.test(cleaned)) return false;

  return true;
}

/**
 * Validate CVV
 * @param {string} cvv - CVV to validate
 * @returns {boolean} True if valid
 */
function isValidCVV(cvv) {
  if (!cvv || typeof cvv !== 'string') return false;
  return /^\d{3,4}$/.test(cvv);
}

/**
 * Validate expiry date (MM/YY format)
 * @param {string} expiry - Expiry date to validate
 * @returns {boolean} True if valid and not expired
 */
function isValidExpiryDate(expiry) {
  if (!expiry || typeof expiry !== 'string') return false;

  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;

  const month = parseInt(match[1], 10);
  const year = parseInt('20' + match[2], 10);

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const expiryDate = new Date(year, month - 1);

  return expiryDate > now;
}

module.exports = {
  isValidEmail,
  validatePassword,
  isValidPrice,
  isValidQuantity,
  isValidProductId,
  validateUsername,
  isValidCardNumberFormat,
  isValidCVV,
  isValidExpiryDate
};
