import { api } from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const getDashboardOverview = async () => {
  const res = await api.get(
    API_ENDPOINTS.DASHBOARD.OVERVIEW
  );

  return res.data.data;
};

export const getRevenueTrend = async () => {
  const res = await api.get(
    API_ENDPOINTS.DASHBOARD.REVENUE_TREND
  );

  return res.data.data;
};

export const getAppointmentStatusAnalytics = async () => {
  const res = await api.get(
    API_ENDPOINTS.DASHBOARD.APPOINTMENT_STATUS
  );

  return res.data.data;
};