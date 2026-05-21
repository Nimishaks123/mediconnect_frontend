import { api } from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
export const adminWalletApi = {
  getWallets: (params: { page: number; limit: number; search?: string; sort?: string }) =>
    api.get( API_ENDPOINTS.ADMIN_WALLETS.GET_ALL, { params }),
    
  getTransactions: (userId: string, params: { 
    page: number; 
    limit: number; 
    type?: string; 
    search?: string; 
    sort?: string 
  }) =>
    api.get( API_ENDPOINTS.ADMIN_WALLETS.GET_TRANSACTIONS(userId), { params }),
};
