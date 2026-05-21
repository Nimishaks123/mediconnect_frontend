import { API_ENDPOINTS } from "../constants/apiEndpoints";
import {api} from "./api";
export const createCheckoutSession = async (
  appointmentId: string
) => {
  const res = await api.post(
   API_ENDPOINTS.APPOINTMENTS.CHECKOUT(
        appointmentId
      )
  );

  return res.data; // { checkoutUrl }
};
