import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { AxiosError } from "axios";

import { adminUserApi } from "../../api/adminUserApi";
import type { AdminUser } from "../../api/adminUserApi";

//types
export interface FetchUsersParams {
  page: number;
  limit: number;
  search: string;
  role?: string;
  status?: string;
}

interface AdminUserState {
  users: AdminUser[];
  page: number;
  limit: number;
  total: number;
  loading: boolean;
  error: string | null;
}

//initial state
const initialState: AdminUserState = {
  users: [],
  page: 1,
  limit: 6,
  total: 0,
  loading: false,
  error: null,
};

//fetch users
export const fetchAllUsers = createAsyncThunk<
  {
    users: AdminUser[];
    total: number;
    page: number;
    limit: number;
  },
  FetchUsersParams,
  { rejectValue: string }
>("adminUsers/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await adminUserApi.getAllUsers(params);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch users"
      );
    }
    return rejectWithValue("Unexpected error occurred");
  }
});

//block users
export const blockUser = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("adminUsers/block", async (userId, { rejectWithValue }) => {
  try {
    await adminUserApi.blockUser(userId);
    return userId;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || "Failed to block user"
    );
  }
});

//unblock users
export const unblockUser = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("adminUsers/unblock", async (userId, { rejectWithValue }) => {
  try {
    await adminUserApi.unblockUser(userId);
    return userId;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || "Failed to unblock user"
    );
  }
});

//slice
const adminUserSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* -------- FETCH USERS -------- */
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.users = payload.users;
        state.total = payload.total;
        state.page = payload.page;
        state.limit = payload.limit;
      })
      .addCase(fetchAllUsers.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload ?? "Failed to load users";
      })

     //block users
      .addCase(blockUser.fulfilled, (state, { payload: userId }) => {
        const user = state.users.find((u) => u.id === userId);
        if (user) user.blocked = true;
      })

   //unblock users
      .addCase(unblockUser.fulfilled, (state, { payload: userId }) => {
        const user = state.users.find((u) => u.id === userId);
        if (user) user.blocked = false;
      });
  },
});

export default adminUserSlice.reducer;
