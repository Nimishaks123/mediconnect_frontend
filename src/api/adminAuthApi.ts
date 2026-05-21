import { api } from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
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
    api.post<AdminLoginResponse>(API_ENDPOINTS.ADMIN_AUTH.LOGIN, { email, password }),
};

