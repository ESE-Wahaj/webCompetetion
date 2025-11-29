const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, 'app.log');

/**
 * Log levels
 */
const LogLevel = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  SECURITY: 'SECURITY'
};

/**
 * Format log entry
 * @param {string} level - Log level
 * @param {string} action - Action being logged
 * @param {string} details - Additional details
 * @param {Object} metadata - Additional metadata (userId, ip, etc.)
 * @returns {string} Formatted log entry
 */
function formatLog(level, action, details, metadata = {}) {
  const timestamp = new Date().toISOString();
  const userId = metadata.userId || 'ANONYMOUS';
  const ip = metadata.ip || 'UNKNOWN';

  return `[${timestamp}] [${level}] [USER:${userId}] [IP:${ip}] [${action}] ${details}\n`;
}

/**
 * Write log to file and console
 * @param {string} level - Log level
 * @param {string} action - Action being logged
 * @param {string} details - Additional details
 * @param {Object} metadata - Additional metadata
 */
function log(level, action, details, metadata = {}) {
  const logEntry = formatLog(level, action, details, metadata);

  // Write to console
  console.log(logEntry.trim());

  // Write to file
  fs.appendFile(logFile, logEntry, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
}

/**
 * Log info message
 */
function info(action, details, metadata = {}) {
  log(LogLevel.INFO, action, details, metadata);
}

/**
 * Log warning message
 */
function warning(action, details, metadata = {}) {
  log(LogLevel.WARNING, action, details, metadata);
}

/**
 * Log error message
 */
function error(action, details, metadata = {}) {
  log(LogLevel.ERROR, action, details, metadata);
}

/**
 * Log security event
 */
function security(action, details, metadata = {}) {
  log(LogLevel.SECURITY, action, details, metadata);
}

module.exports = {
  info,
  warning,
  error,
  security,
  LogLevel
};
