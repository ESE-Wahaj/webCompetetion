const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const userModel = require('../models/userModel');
const logger = require('../utils/logger');
const { validatePassword, validateUsername } = require('../utils/validator');

/**
 * Authentication Controller
 * Handles user registration, login, and authentication
 */

/**
 * Register a new user
 */
async function register(req, res) {
  try {
    const { username, email, password, first_name, last_name, phone, address } = req.body;

    // Additional password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message
      });
    }

    // Additional username validation
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      return res.status(400).json({
        success: false,
        message: usernameValidation.message
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      logger.warning('REGISTRATION_FAILED', `Email already exists: ${email}`, {
        ip: req.ip
      });
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Check if username already exists
    const existingUsername = await userModel.findUserByUsername(username);
    if (existingUsername) {
      logger.warning('REGISTRATION_FAILED', `Username already exists: ${username}`, {
        ip: req.ip
      });
      return res.status(409).json({
        success: false,
        message: 'Username already taken'
      });
    }

    // Create user
    const user = await userModel.createUser({
      username,
      email,
      password,
      first_name,
      last_name,
      phone,
      address
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    logger.info('USER_REGISTERED', `User registered: ${email}`, {
      userId: user.id,
      ip: req.ip
    });

    // Set httpOnly cookie
    res.cookie('token', token, jwtConfig.cookieOptions);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name
      }
    });
  } catch (error) {
    logger.error('REGISTRATION_ERROR', error.message, {
      ip: req.ip,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
}

/**
 * Login user
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      logger.security('LOGIN_FAILED', `User not found: ${email}`, {
        ip: req.ip
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await userModel.verifyPassword(password, user.hashed_password);
    if (!isPasswordValid) {
      logger.security('LOGIN_FAILED', `Invalid password for: ${email}`, {
        userId: user.id,
        ip: req.ip
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    logger.info('USER_LOGGED_IN', `User logged in: ${email}`, {
      userId: user.id,
      ip: req.ip
    });

    // Set httpOnly cookie
    res.cookie('token', token, jwtConfig.cookieOptions);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name
      }
    });
  } catch (error) {
    logger.error('LOGIN_ERROR', error.message, {
      ip: req.ip,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
}

/**
 * Logout user
 */
function logout(req, res) {
  logger.info('USER_LOGGED_OUT', `User logged out: ${req.user?.email}`, {
    userId: req.user?.userId,
    ip: req.ip
  });

  // Clear cookie
  res.clearCookie('token');

  res.json({
    success: true,
    message: 'Logout successful'
  });
}

/**
 * Get current user info
 */
async function getCurrentUser(req, res) {
  try {
    const user = await userModel.findUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        address: user.address,
        created_at: user.created_at
      }
    });
  } catch (error) {
    logger.error('GET_USER_ERROR', error.message, {
      userId: req.user?.userId,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user information'
    });
  }
}

/**
 * Update user profile
 */
async function updateProfile(req, res) {
  try {
    const { first_name, last_name, phone, address } = req.body;

    const updatedUser = await userModel.updateUser(req.user.userId, {
      first_name,
      last_name,
      phone,
      address
    });

    logger.info('PROFILE_UPDATED', `Profile updated for: ${req.user.email}`, {
      userId: req.user.userId,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    logger.error('UPDATE_PROFILE_ERROR', error.message, {
      userId: req.user?.userId,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
}

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile
};
