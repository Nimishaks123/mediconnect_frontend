import { api } from "./api";

export const forgotPasswordApi = {
  sendOtp: (email: string) => {
    return api.post("/auth/forgot-password/send-otp", { email });
    
  },

  verifyOtp: (email: string, code: string) => {
    return api.post("/auth/forgot-password/verify-otp", { email, code });
  },

  resetPassword: (email: string, newPassword: string) => {
    return api.post("/auth/forgot-password/reset", { email, newPassword });
  }


}