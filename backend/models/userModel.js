const pool = require('../config/database');
const bcrypt = require('bcrypt');

/**
 * User Model
 * Database operations for users
 */

/**
 * Create a new user
 * @param {Object} userData - {username, email, password, first_name, last_name, phone, address}
 * @returns {Object} Created user (without password)
 */
async function createUser(userData) {
  const { username, email, password, first_name, last_name, phone, address } = userData;

  // Hash password
  const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
  const hashedPassword = await bcrypt.hash(password, bcryptRounds);

  const query = `
    INSERT INTO Users (username, email, hashed_password, first_name, last_name, phone, address, role)
    VALUES ($1, $2, $3, $4, $5, $6, $7, 'customer')
    RETURNING id, username, email, role, first_name, last_name, phone, address, created_at
  `;

  const values = [username, email, hashedPassword, first_name, last_name, phone, address];
  const result = await pool.query(query, values);

  return result.rows[0];
}

/**
 * Find user by email
 * @param {string} email
 * @returns {Object} User object with hashed_password
 */
async function findUserByEmail(email) {
  const query = 'SELECT * FROM Users WHERE email = $1 AND is_active = true';
  const result = await pool.query(query, [email]);

  return result.rows[0] || null;
}

/**
 * Find user by username
 * @param {string} username
 * @returns {Object} User object
 */
async function findUserByUsername(username) {
  const query = 'SELECT * FROM Users WHERE username = $1 AND is_active = true';
  const result = await pool.query(query, [username]);

  return result.rows[0] || null;
}

/**
 * Find user by ID
 * @param {number} userId
 * @returns {Object} User object (without password)
 */
async function findUserById(userId) {
  const query = `
    SELECT id, username, email, role, first_name, last_name, phone, address, created_at
    FROM Users
    WHERE id = $1 AND is_active = true
  `;
  const result = await pool.query(query, [userId]);

  return result.rows[0] || null;
}

/**
 * Verify user password
 * @param {string} plainPassword
 * @param {string} hashedPassword
 * @returns {boolean} True if password matches
 */
async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Update user information
 * @param {number} userId
 * @param {Object} updateData
 * @returns {Object} Updated user
 */
async function updateUser(userId, updateData) {
  const allowedFields = ['first_name', 'last_name', 'phone', 'address'];
  const updates = [];
  const values = [];
  let paramCount = 1;

  for (const [key, value] of Object.entries(updateData)) {
    if (allowedFields.includes(key)) {
      updates.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  }

  if (updates.length === 0) {
    throw new Error('No valid fields to update');
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(userId);

  const query = `
    UPDATE Users
    SET ${updates.join(', ')}
    WHERE id = $${paramCount}
    RETURNING id, username, email, role, first_name, last_name, phone, address, updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
}

/**
 * Get all users (admin only)
 * @returns {Array} All users (without passwords)
 */
async function getAllUsers() {
  const query = `
    SELECT id, username, email, role, first_name, last_name, phone, is_active, created_at
    FROM Users
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query);

  return result.rows;
}

/**
 * Update user role (admin only)
 * @param {number} userId
 * @param {string} newRole - 'customer' or 'admin'
 * @returns {Object} Updated user
 */
async function updateUserRole(userId, newRole) {
  if (!['customer', 'admin'].includes(newRole)) {
    throw new Error('Invalid role');
  }

  const query = `
    UPDATE Users
    SET role = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING id, username, email, role, updated_at
  `;

  const result = await pool.query(query, [newRole, userId]);
  return result.rows[0];
}

/**
 * Deactivate user (soft delete)
 * @param {number} userId
 * @returns {Object} Result
 */
async function deactivateUser(userId) {
  const query = `
    UPDATE Users
    SET is_active = false, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING id
  `;

  const result = await pool.query(query, [userId]);
  return result.rows[0];
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserByUsername,
  findUserById,
  verifyPassword,
  updateUser,
  getAllUsers,
  updateUserRole,
  deactivateUser
};
