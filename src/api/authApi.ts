import { api } from "./api";
import type { Role } from "../store/auth/authSlice";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role?: Role; 
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>("/auth/login", { email, password }),

  signup: (data: SignupPayload) => api.post("/auth/signup", data),
};
