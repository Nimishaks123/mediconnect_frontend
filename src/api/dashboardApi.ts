import { api } from "../api/api";

export const dashboardApi = {
  getDashboard: async () => {
    const response = await api.get("/patient/dashboard");
    return response.data;
  },
};