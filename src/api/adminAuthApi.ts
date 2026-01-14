import { api } from "./api";

export interface AdminLoginResponse {
  accessToken: string;
  refreshToken: string;
  admin: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN";
  };
}

export const adminAuthApi = {
  login: (email: string, password: string) =>
    api.post<AdminLoginResponse>("/admin/auth/login", { email, password }),
};

