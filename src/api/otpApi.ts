import { api } from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
export const otpApi = {
  verifyOtp: (email: string, code: string) =>
    api.post(API_ENDPOINTS.AUTH.VERIFY_OTP, { email, code }),

  resendOtp: (email: string) =>
    api.post(API_ENDPOINTS.AUTH.RESEND_OTP, { email }),
};
