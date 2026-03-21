const router = require('express').Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public routes
router.post('/signup', authController.signup);
router.post('/login/email', authController.loginWithEmail);
router.post('/login/phone/send-otp', authController.sendPhoneLoginOTP);
router.post('/login/phone/verify', authController.loginWithPhoneOTP);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/refresh', authController.refreshToken);

// Protected routes (require authentication)
router.post('/logout', authMiddleware, authController.logout);
router.post('/logout-all', authMiddleware, authController.logoutAll);

module.exports = router;