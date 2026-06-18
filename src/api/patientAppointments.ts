import { api } from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
export const getMyAppointments = async () => {
  const res = await api.get(API_ENDPOINTS.PATIENT_APPOINTMENTS.GET_ALL);
  return res.data.data;
};

export const cancelAppointment = async (appointmentId: string) => {
  const res = await api.patch(API_ENDPOINTS.PATIENT_APPOINTMENTS.CANCEL(
      appointmentId
    ));
  return res.data;
};

export const getMyWallet = async () => {
  const res = await api.get(API_ENDPOINTS.PATIENT_WALLET.GET);
  return res.data.data;
};

export const checkoutAppointment = async (appointmentId: string) => {
  const res = await api.post(API_ENDPOINTS.APPOINTMENTS.CHECKOUT(
      appointmentId
    ));
  return res.data;
};
export const payWithWallet=async(appointmentId:string)=>{
  const res=await api.post(API_ENDPOINTS.PATIENT_APPOINTMENTS.PAY_WITH_WALLET,{appointmentId});
  return res.data;
};
export const topupWallet = async (
  amount: number
) => {
  
  console.log(
    "TOPUP REQUEST:",
    { amount }
  );

  const res =
    await api.post(
      API_ENDPOINTS.PATIENT_WALLET.TOPUP,
      { amount }
    );

  return res.data;
};
export const getWalletTransactions =
  async (
    page = 1,
    limit = 3
  ) => {

    const res =
      await api.get(
        `${API_ENDPOINTS.PATIENT_WALLET.TRANSACTIONS}?page=${page}&limit=${limit}`
      );

    return res.data.data;
  };