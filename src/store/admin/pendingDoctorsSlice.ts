import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

import { adminDoctorApi } from "../../api/adminDoctorApi";
import type { PendingDoctor } from "../../api/adminDoctorApi";

/* -------------------- STATE -------------------- */
interface PendingDoctorsState {
  loading: boolean;
  error: string | null;
  doctors: PendingDoctor[];
  total: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    total: number;
  };
}

const initialState: PendingDoctorsState = {
  loading: false,
  error: null,
  doctors: [],
  total: 0,
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  },
};

/* -------------------- FETCH ADMIN DOCTORS -------------------- */
export const fetchAdminDoctors = createAsyncThunk<
  { doctors: PendingDoctor[]; pagination: any; total: number },
  { status: "PENDING" | "APPROVED" | "REJECTED"; page: number; limit: number; search?: string; sort?: string },
  { rejectValue: string }
>("admin/fetchAdminDoctors", async (params, { rejectWithValue }) => {
  try {
    const response = await adminDoctorApi.getAdminDoctors(params);
    return {
      doctors: response.data.doctors,
      pagination: response.data.pagination,
      total: response.data.total
    };
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || "Failed to load doctors"
    );
  }
});

/* -------------------- APPROVE DOCTOR -------------------- */
export const approveDoctor = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("admin/approveDoctor", async (userId, { rejectWithValue }) => {
  try {
    await adminDoctorApi.approveDoctor(userId);
    return userId;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || "Failed to approve doctor"
    );
  }
});

/* -------------------- REJECT DOCTOR -------------------- */
export const rejectDoctor = createAsyncThunk<
  string,
  { userId: string; reason: string },
  { rejectValue: string }
>("admin/rejectDoctor", async ({ userId, reason }, { rejectWithValue }) => {
  try {
    await adminDoctorApi.rejectDoctor(userId, reason);
    return userId;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || "Failed to reject doctor"
    );
  }
});

/* -------------------- SLICE -------------------- */
const pendingDoctorsSlice = createSlice({
  name: "pendingDoctors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchAdminDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDoctors.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.doctors = payload.doctors;
        state.pagination = payload.pagination;
        state.total = payload.total;
      })
      .addCase(fetchAdminDoctors.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload ?? "Failed to load doctors";
      })

      // APPROVE
      .addCase(approveDoctor.fulfilled, (state, { payload: userId }) => {
        state.doctors = state.doctors.filter(
          (d) => d.doctor.userId !== userId
        );
      })

      // REJECT
      .addCase(rejectDoctor.fulfilled, (state, { payload: userId }) => {
        state.doctors = state.doctors.filter(
          (d) => d.doctor.userId !== userId
        );
      });
  },
});

export default pendingDoctorsSlice.reducer;
