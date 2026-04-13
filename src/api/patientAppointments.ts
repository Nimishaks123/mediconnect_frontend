import { api } from "./api";

export const getMyAppointments = async () => {
  const res = await api.get("/patient/appointments");
  return res.data.data;
};

export const cancelAppointment = async (appointmentId: string) => {
  const res = await api.patch(`/patient/appointments/${appointmentId}/cancel`);
  return res.data;
};

export const getMyWallet = async () => {
  const res = await api.get("/patient/wallet");
  return res.data.data;
};

export const checkoutAppointment = async (appointmentId: string) => {
  const res = await api.post(`/appointments/${appointmentId}/checkout`);
  return res.data;
};
