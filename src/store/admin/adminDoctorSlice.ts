import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import { adminDoctorApi } from "../../api/adminDoctorApi";
import type { PendingDoctor } from "../../types/adminDoctor";
export const fetchPendingDoctors = createAsyncThunk<
  PendingDoctor[],
  void,
  { rejectValue: string }
>("adminDoctors/fetchPending", async (_, { rejectWithValue }) => {
  try {
   const res = await adminDoctorApi.getAdminDoctors({
  status: "PENDING",
  page: 1,
  limit: 100,
});
    return res.data.doctors as PendingDoctor[];
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch pending doctors"
    );
  }
});

export const approveDoctor = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("adminDoctors/approve", async (userId, { rejectWithValue }) => {
  try {
    await adminDoctorApi.approveDoctor(userId);
    return userId;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || "Doctor approval failed"
    );
  }
});

export const rejectDoctor = createAsyncThunk<
  string,
  { userId: string; reason: string },
  { rejectValue: string }
>("adminDoctors/reject", async ({ userId, reason }, { rejectWithValue }) => {
  try {
    await adminDoctorApi.rejectDoctor(userId, reason);
    return userId;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || "Doctor rejection failed"
    );
  }
});

interface AdminDoctorState {
  pendingDoctors: PendingDoctor[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminDoctorState = {
  pendingDoctors: [],
  loading: false,
  error: null,
};

const adminDoctorSlice = createSlice({
  name: "adminDoctors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchPendingDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingDoctors.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.pendingDoctors = payload;
      })
      .addCase(fetchPendingDoctors.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload ?? "Something went wrong";
      })

      // APPROVE
      .addCase(approveDoctor.fulfilled, (state, { payload: userId }) => {
        state.pendingDoctors = state.pendingDoctors.filter(
          (item) => item.user.id !== userId
        );
      })

      // REJECT
      .addCase(rejectDoctor.fulfilled, (state, { payload: userId }) => {
        state.pendingDoctors = state.pendingDoctors.filter(
          (item) => item.user.id !== userId
        );
      });
  },
});

export default adminDoctorSlice.reducer;
