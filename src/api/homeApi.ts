import { api } from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import type{ PlatformStats } from "../types/home";

export const getPlatformStats = async (): Promise<PlatformStats> => {
  const response = await api.get(API_ENDPOINTS.PUBLIC.STATS);
  return response.data.data;
};
