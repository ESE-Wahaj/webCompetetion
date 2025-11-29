const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../middleware/validateInput');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiter');

/**
 * Authentication Routes
 */

// POST /api/auth/register - Register new user
router.post('/register', registerLimiter, validateRegistration, authController.register);

// POST /api/auth/login - Login user
router.post('/login', loginLimiter, validateLogin, authController.login);

// POST /api/auth/logout - Logout user (requires authentication)
router.post('/logout', authenticateToken, authController.logout);

// GET /api/auth/me - Get current user (requires authentication)
router.get('/me', authenticateToken, authController.getCurrentUser);

// PUT /api/auth/profile - Update user profile (requires authentication)
router.put('/profile', authenticateToken, authController.updateProfile);

module.exports = router;
