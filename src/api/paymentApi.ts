
import {api} from "./api";
export const createCheckoutSession = async (
  appointmentId: string
) => {
  const res = await api.post(
    `/appointments/${appointmentId}/checkout`
  );

  return res.data; // { checkoutUrl }
};
