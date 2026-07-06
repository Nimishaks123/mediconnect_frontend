import { api } from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export interface PlatformSettings {
  platformFee: number;
  refundPercentage: number;
}

export const getPlatformSettings = async () => {
  const res = await api.get(
    API_ENDPOINTS.ADMIN_SETTINGS.GET
  );

  return res.data.data;
};

export const updatePlatformSettings = async (
  data: PlatformSettings
) => {

  const res = await api.patch(
    API_ENDPOINTS.ADMIN_SETTINGS.UPDATE,
    data
  );

  return res.data;
};