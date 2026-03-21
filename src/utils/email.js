// This is a placeholder. Implement with your actual email service (SendGrid, AWS SES, etc.)
const sendEmail = async (to, subject, html) => {
  console.log(`[EMAIL] To: ${to}, Subject: ${subject}`);
  console.log(`[EMAIL] Content: ${html}`);

  // For development, just log the email
  // In production, implement actual email sending here

  return true;
};

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  const html = `
    <h1>Password Reset Request</h1>
    <p>You requested to reset your password. Click the link below to reset it:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  return sendEmail(email, 'Password Reset Request', html);
};

const sendOTPEmail = async (email, otp) => {
  const html = `
    <h1>Your OTP Code</h1>
    <p>Your OTP code is: <strong>${otp}</strong></p>
    <p>This code will expire in 10 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  return sendEmail(email, 'Your OTP Code', html);
};

module.exports = {
  sendPasswordResetEmail,
  sendOTPEmail
};