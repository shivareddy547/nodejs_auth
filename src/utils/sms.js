// This is a placeholder. Implement with your actual SMS service (Twilio, etc.)
const sendSMS = async (phoneNumber, message) => {
  console.log(`[SMS] To: ${phoneNumber}, Message: ${message}`);

  // For development, just log the SMS
  // In production, implement actual SMS sending here

  return true;
};

const sendOTPSMS = async (phoneNumber, otp) => {
  const message = `Your OTP code is: ${otp}. This code will expire in 10 minutes.`;
  return sendSMS(phoneNumber, message);
};

module.exports = {
  sendOTPSMS
};