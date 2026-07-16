import { api } from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const getDashboardOverview = async () => {
  const res = await api.get(
    API_ENDPOINTS.DASHBOARD.OVERVIEW
  );

  return res.data.data;
};