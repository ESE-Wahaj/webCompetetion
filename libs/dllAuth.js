const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../backend/.env' });

/**
 * DLL Authentication Layer
 * Provides double authentication: DLL password AND user JWT validation
 */

/**
 * Validate DLL password
 * @param {string} providedPassword - Password provided by caller
 * @returns {boolean} True if password matches
 */
function validateDLLPassword(providedPassword) {
  const dllPassword = process.env.DLL_PASSWORD;

  if (!dllPassword) {
    throw new Error('DLL_PASSWORD not configured in environment');
  }

  return providedPassword === dllPassword;
}

/**
 * Validate and decode user JWT token
 * @param {string} token - JWT token to validate
 * @returns {Object} Decoded token payload {userId, email, role}
 */
function validateUserToken(token) {
  try {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured in environment');
    }

    const decoded = jwt.verify(token, jwtSecret);

    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
  } catch (error) {
    throw new Error(`Invalid JWT token: ${error.message}`);
  }
}

/**
 * Check if user has admin role
 * @param {string} token - JWT token
 * @returns {boolean} True if user is admin
 */
function requireAdmin(token) {
  const user = validateUserToken(token);
  return user.role === 'admin';
}

/**
 * Combined authentication function
 * Validates both DLL password and user token
 * @param {string} dllPassword - DLL password
 * @param {string} userToken - User JWT token
 * @param {boolean} requireAdminRole - Whether admin role is required
 * @returns {Object} {success: boolean, user: Object, message: string}
 */
function authenticateDLL(dllPassword, userToken, requireAdminRole = false) {
  try {
    // Step 1: Validate DLL password
    if (!validateDLLPassword(dllPassword)) {
      return {
        success: false,
        message: 'Invalid DLL password'
      };
    }

    // Step 2: Validate user JWT token
    const user = validateUserToken(userToken);

    // Step 3: Check admin role if required
    if (requireAdminRole && user.role !== 'admin') {
      return {
        success: false,
        message: 'Admin privileges required for this operation'
      };
    }

    return {
      success: true,
      user,
      message: 'Authentication successful'
    };
  } catch (error) {
    return {
      success: false,
      message: `Authentication failed: ${error.message}`
    };
  }
}

module.exports = {
  validateDLLPassword,
  validateUserToken,
  requireAdmin,
  authenticateDLL
};
