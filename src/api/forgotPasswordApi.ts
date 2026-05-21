import { api } from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
export const forgotPasswordApi = {
  sendOtp: (email: string) => {
    return api.post(API_ENDPOINTS.FORGOT_PASSWORD.SEND_OTP, { email });
    
  },

  verifyOtp: (email: string, code: string) => {
    return api.post(   API_ENDPOINTS.FORGOT_PASSWORD.VERIFY_OTP, { email, code });
  },

  resetPassword: (email: string, newPassword: string) => {
    return api.post(API_ENDPOINTS.FORGOT_PASSWORD.RESET_PASSWORD, { email, newPassword });
  }


}