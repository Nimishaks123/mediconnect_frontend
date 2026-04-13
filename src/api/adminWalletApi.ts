import { api } from "./api";

export const adminWalletApi = {
  getWallets: (params: { page: number; limit: number; search?: string; sort?: string }) =>
    api.get("/admin/wallets", { params }),
    
  getTransactions: (userId: string, params: { 
    page: number; 
    limit: number; 
    type?: string; 
    search?: string; 
    sort?: string 
  }) =>
    api.get(`/admin/wallets/${userId}/transactions`, { params }),
};
