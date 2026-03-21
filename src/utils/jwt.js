const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d'; // 7 days

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY
};