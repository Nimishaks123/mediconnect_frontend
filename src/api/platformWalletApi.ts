import { api } from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const getPlatformWallet = async () => {

  const res = await api.get(
    API_ENDPOINTS.PLATFORM_WALLET.GET
  );

  return res.data.data;
};

export const getPlatformWalletTransactions = async (
  page: number,
  limit: number
) => {

  const res = await api.get(
    API_ENDPOINTS.PLATFORM_WALLET.TRANSACTIONS,
    {
      params: {
        page,
        limit,
      },
    }
  );

  return res.data.data;
};