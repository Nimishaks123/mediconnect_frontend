import { api } from "./api";

export const otpApi = {
  verifyOtp: (email: string, code: string) =>
    api.post("/auth/verify-otp", { email, code }),

  resendOtp: (email: string) =>
    api.post("/auth/resend-otp", { email }),
};
