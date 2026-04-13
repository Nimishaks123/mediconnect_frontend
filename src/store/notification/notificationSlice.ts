import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../api/api";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "APPOINTMENT" | "PAYMENT" | "CHAT" | "SYSTEM";
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  page: 1,
  totalPages: 1
};

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await api.get(`/notifications?page=${page}`);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch notifications");
    }
  }
);

export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to mark as read");
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
        state.totalPages = action.payload.pagination.totalPages;
        state.page = action.payload.pagination.page;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notif = state.notifications.find(n => n.id === action.payload);
        if (notif && !notif.isRead) {
          notif.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });
  }
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
