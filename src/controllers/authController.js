const authService = require('../services/authService');

class AuthController {
  async signup(req, res) {
    try {
      const result = await authService.signup(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async loginWithEmail(req, res) {
    try {
      const { email, password } = req.body;
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip || req.connection.remoteAddress;

      const result = await authService.loginWithEmail(email, password, userAgent, ipAddress);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async sendPhoneLoginOTP(req, res) {
    try {
      const { phoneNumber } = req.body;
      const result = await authService.sendPhoneLoginOTP(phoneNumber);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async loginWithPhoneOTP(req, res) {
    try {
      const { phoneNumber, otp } = req.body;
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip || req.connection.remoteAddress;

      const result = await authService.loginWithPhoneOTP(phoneNumber, otp, userAgent, ipAddress);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      const result = await authService.resetPassword(token, newPassword);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip || req.connection.remoteAddress;

      const result = await authService.refreshToken(refreshToken, userAgent, ipAddress);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async logout(req, res) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.logout(refreshToken);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async logoutAll(req, res) {
    try {
      const userId = req.user.id;
      const result = await authService.logoutAll(userId);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();