import { api } from "./api";
import type { Role } from "../store/auth/authSlice";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
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
    api.post<LoginResponse>( API_ENDPOINTS.AUTH.LOGIN, { email, password }),

  signup: (data: SignupPayload) => api.post( API_ENDPOINTS.AUTH.SIGNUP, data),

  getMe: () =>
  api.get<{
    success: boolean;
    user: LoginResponse["user"];
    accessToken: string;
  }>(API_ENDPOINTS.AUTH.ME),

  logout: () => 
    api.post(API_ENDPOINTS.AUTH.LOGOUT
    ),
    changePassword:(currentPassword:string,newPassword:string)=>
      api.patch(API_ENDPOINTS.AUTH.CHANGE_PASSWORD,{currentPassword,newPassword}),


};

