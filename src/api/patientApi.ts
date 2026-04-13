import { api } from "./api";

export const patientApi = {
  getProfile: () => api.get("/patient/profile"),
  createProfile: (data: any) => api.post("/patient/profile", data),
  updateProfile: (data: any) => api.put("/patient/profile", data),
};
