import type { RootState } from "../index";

export const selectNotifications = (state: RootState) =>
  state.notifications.notifications;

export const selectUnreadNotificationCount = (
  state: RootState
) => state.notifications.unreadCount;

export const selectNotificationLoading = (
  state: RootState
) => state.notifications.loading;