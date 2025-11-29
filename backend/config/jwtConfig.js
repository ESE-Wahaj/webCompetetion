require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'fallback_secret_key_change_this',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',

  // Cookie options for JWT
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  }
};
