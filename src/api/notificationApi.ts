import { api } from "./api";

import { API_ENDPOINTS }
from "../constants/apiEndpoints";

export const notificationApi = {

  getUnreadCount: async () => {

    const res = await api.get(
      API_ENDPOINTS.NOTIFICATIONS
        .UNREAD_COUNT
    );

    return res.data;

  },

};