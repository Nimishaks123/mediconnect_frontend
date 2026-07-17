import { api } from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import type{ RecentActivityItem } from "../types/doctorDashboard";

export const getRecentActivity = async (): Promise<RecentActivityItem[]> => {
  const res = await api.get(API_ENDPOINTS.DOCTOR_DASHBOARD.RECENT_ACTIVITY);
  return res.data.data;
};
