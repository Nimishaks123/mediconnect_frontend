import { api } from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
export const patientApi = {
  getProfile: () => api.get(API_ENDPOINTS.PATIENT_PROFILE.GET),
  createProfile: (data: any) => api.post( API_ENDPOINTS.PATIENT_PROFILE.CREATE, data),
  updateProfile: (data: any) => api.put( API_ENDPOINTS.PATIENT_PROFILE.UPDATE, data),
};
