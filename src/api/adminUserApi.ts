import { api } from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "PATIENT" | "DOCTOR" | "ADMIN";
  blocked: boolean;
  isVerified: boolean;
}

export interface GetAllUsersParams {
  page: number;
  limit: number;
  search: string;
}

export interface GetAllUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
}
export const adminUserApi = {
  getAllUsers: (params: GetAllUsersParams) =>
    api.get<GetAllUsersResponse>(API_ENDPOINTS.ADMIN_USERS.GET_ALL, {
      params,
    }),

  blockUser: (userId: string) =>
    api.post( API_ENDPOINTS.ADMIN_USERS.BLOCK,{ userId }),

  unblockUser: (userId: string) =>
    api.post(API_ENDPOINTS.ADMIN_USERS.UNBLOCK, { userId }),
};
