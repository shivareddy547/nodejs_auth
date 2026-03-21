const { User, Session, OTP } = require('../../models');
const { generateAccessToken, generateRefreshToken, verifyAccessToken } = require('../utils/jwt');
const { generateOTP, generateResetToken } = require('../utils/otp');
const { sendPasswordResetEmail, sendOTPEmail } = require('../utils/email');
const { sendOTPSMS } = require('../utils/sms');
const { Op } = require('sequelize');

class AuthService {
  // Signup with email/password
  async signup(userData) {
    const { name, email, password, phoneNumber } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email },
          ...(phoneNumber ? [{ phoneNumber }] : [])
        ]
      }
    });

    if (existingUser) {
      throw new Error('User already exists with this email or phone number');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phoneNumber,
      password
    });

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken();

    // Create session
    await Session.create({
      userId: user.id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    // Return user data without password
    const userDataResponse = user.toJSON();
    delete userDataResponse.password;

    return {
      user: userDataResponse,
      accessToken,
      refreshToken
    };
  }

  // Login with email and password
  async loginWithEmail(email, password, userAgent, ipAddress) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await user.isValidPassword(password);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken();

    // Create session
    await Session.create({
      userId: user.id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userAgent,
      ipAddress
    });

    const userDataResponse = user.toJSON();
    delete userDataResponse.password;

    return {
      user: userDataResponse,
      accessToken,
      refreshToken
    };
  }

  // Send OTP for phone login
  async sendPhoneLoginOTP(phoneNumber) {
    const user = await User.findOne({ where: { phoneNumber } });

    if (!user) {
      throw new Error('User not found with this phone number');
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database
    await OTP.create({
      userId: user.id,
      otp,
      type: 'phone_login',
      expiresAt
    });

    // Send OTP via SMS
    await sendOTPSMS(phoneNumber, otp);

    return { message: 'OTP sent successfully' };
  }

  // Verify OTP and login with phone
  async loginWithPhoneOTP(phoneNumber, otp, userAgent, ipAddress) {
    const user = await User.findOne({ where: { phoneNumber } });

    if (!user) {
      throw new Error('User not found');
    }

    // Find valid OTP
    const otpRecord = await OTP.findOne({
      where: {
        userId: user.id,
        otp,
        type: 'phone_login',
        isUsed: false,
        expiresAt: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!otpRecord) {
      throw new Error('Invalid or expired OTP');
    }

    // Mark OTP as used
    await otpRecord.update({ isUsed: true });

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken();

    // Create session
    await Session.create({
      userId: user.id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userAgent,
      ipAddress
    });

    const userDataResponse = user.toJSON();
    delete userDataResponse.password;

    return {
      user: userDataResponse,
      accessToken,
      refreshToken
    };
  }

  // Forgot password - send reset email
  async forgotPassword(email) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // For security, don't reveal if user exists
      return { message: 'If your email is registered, you will receive a password reset link' };
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save reset token to user
    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpires
    });

    // Send reset email
    await sendPasswordResetEmail(email, resetToken);

    return { message: 'Password reset email sent' };
  }

  // Reset password with token
  async resetPassword(token, newPassword) {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    // Update password
    await user.update({
      password: newPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    // Invalidate all existing sessions
    await Session.destroy({
      where: { userId: user.id }
    });

    return { message: 'Password reset successful' };
  }

  // Refresh access token
  async refreshToken(refreshToken, userAgent, ipAddress) {
    const session = await Session.findOne({
      where: {
        refreshToken,
        expiresAt: {
          [Op.gt]: new Date()
        }
      },
      include: [{ model: User }]
    });

    if (!session) {
      throw new Error('Invalid or expired refresh token');
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(session.userId);
    const newRefreshToken = generateRefreshToken();

    // Update session with new refresh token
    await session.update({
      refreshToken: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userAgent,
      ipAddress
    });

    const userDataResponse = session.User.toJSON();
    delete userDataResponse.password;

    return {
      user: userDataResponse,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

  // Logout
  async logout(refreshToken) {
    await Session.destroy({
      where: { refreshToken }
    });

    return { message: 'Logged out successfully' };
  }

  // Logout from all devices
  async logoutAll(userId) {
    await Session.destroy({
      where: { userId }
    });

    return { message: 'Logged out from all devices' };
  }
}

module.exports = new AuthService();