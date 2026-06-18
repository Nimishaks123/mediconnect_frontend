import { api } from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import type { CreatePrescriptionRequest } from "../types/prescription";
export const createPrescription = (
  data:CreatePrescriptionRequest
) => {
  return api.post(
    API_ENDPOINTS.PRESCRIPTIONS.BASE,
    data
  );
};
export const getPrescription = async (
  appointmentId: string
) => {
  const response = await api.get(
    API_ENDPOINTS.PRESCRIPTIONS.GET_BY_APPOINTMENT(
      appointmentId
    )
  );

  return response.data;
};
