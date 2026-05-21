
import { api } from "../api/api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
export const doctorOnboardingApi = {
  startOnboarding: () =>
    api.post(API_ENDPOINTS.DOCTOR_ONBOARDING.START),

  getProfile: () =>
    api.get(API_ENDPOINTS.DOCTOR_ONBOARDING.PROFILE),

  updateBasicInfo: (data: unknown) =>
    api.patch(API_ENDPOINTS.DOCTOR_ONBOARDING.UPDATE_PROFILE,data), 

uploadDocuments: (formData: FormData) =>
  api.post( API_ENDPOINTS.DOCTOR_ONBOARDING.UPLOAD_DOCUMENTS,formData),


  submitForVerification: () =>
    api.post(API_ENDPOINTS.DOCTOR_ONBOARDING.SUBMIT),
};
