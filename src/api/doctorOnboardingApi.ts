
import { api } from "../api/api";

export const doctorOnboardingApi = {
  startOnboarding: () =>
    api.post("/doctor/onboarding/start"),

  getProfile: () =>
    api.get("/doctor/profile"),

  updateBasicInfo: (data: unknown) =>
    api.patch("/doctor/profile", data), 

uploadDocuments: (formData: FormData) =>
  api.post("/doctor/upload-documents", formData),


  submitForVerification: () =>
    api.post("/doctor/submit"),
};
