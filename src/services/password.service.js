// src/services/password.service.js
import api from './auth.service'; // your axios instance (with baseURL & interceptors)

export const passwordService = {
  sendOtp(email) {
    return api.post('/password/send-otp', { email });
  },
  verifyOtp(email, otp) {
    return api.post('/password/verify-otp', { email, otp });
  },
  updatePassword(email, newPassword, confirmPassword) {
    return api.post('/password/update-password', { email, newPassword, confirmPassword });
  }
};
