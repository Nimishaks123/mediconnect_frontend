import { api } from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const getDoctorWallet = async () => {
  const res = await api.get(
    API_ENDPOINTS.DOCTOR_WALLET.WALLET
  );

  return res.data.data;
};

export const getDoctorWalletTransactions = async (
  page = 1,
  limit = 10
) => {
  const res = await api.get(
    `${API_ENDPOINTS.DOCTOR_WALLET.TRANSACTIONS}?page=${page}&limit=${limit}`
  );

  return res.data.data;
};