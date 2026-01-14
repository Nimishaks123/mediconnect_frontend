import { api } from "./api";

/* -------------------- TYPES -------------------- */
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

/* -------------------- API -------------------- */
export const adminUserApi = {
  getAllUsers: (params: GetAllUsersParams) =>
    api.get<GetAllUsersResponse>("/admin/users", {
      params,
    }),

  blockUser: (userId: string) =>
    api.post("/admin/block-user", { userId }),

  unblockUser: (userId: string) =>
    api.post("/admin/unblock-user", { userId }),
};
