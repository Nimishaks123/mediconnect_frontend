// src/services/authService.ts
import { authApi } from "../api/authApi";
import { adminAuthApi } from "../api/adminAuthApi";
import type { LoginResponse, SignupPayload } from "../api/authApi";

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await authApi.login(email, password);
    return res.data;
  },

  loginAdmin: async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    const res = await adminAuthApi.login(email, password);
    const { accessToken, refreshToken, admin } = res.data;

    return {
      accessToken,
      refreshToken,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    };
  },

  signup: async (payload: SignupPayload) => {
    const res = await authApi.signup(payload);
    return res.data;
  },
};
