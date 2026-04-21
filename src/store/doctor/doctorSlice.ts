import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/api";
import type { Doctor } from "../../types/Doctor";
import { mapDoctorFromApi } from "../../mappers/doctorMapper";

/* -------------------- THUNKS -------------------- */

export const fetchDoctorProfile = createAsyncThunk<
  Doctor | null,
  void,
  { rejectValue: string }
>("doctor/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/doctor/profile");

    // Handle 304 or empty success responses
    if (res.status === 304 || !res.data) {
      return null;
    }

    // Backend returns data in a 'data' wrapper now (success: true, data: {...})
    const doctorData = res.data.data || res.data;
    return mapDoctorFromApi(doctorData);
  } catch (error: any) {
    // 404 means the user is a doctor but hasn't completed onboarding yet
    if (error.response?.status === 404) {
      return null;
    }

    const message = error.response?.data?.message || "Failed to load doctor profile";
    return rejectWithValue(message);
  }
});


export const fetchVerifiedDoctors = createAsyncThunk<
  Doctor[],
  void,
  { rejectValue: string }
>("doctor/fetchVerifiedDoctors", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/doctors/verified");
    return res.data.map(mapDoctorFromApi);
  } catch {
    return rejectWithValue("Failed to fetch doctors");
  }
});

/* -------------------- STATE -------------------- */

export interface DoctorState {
  profile: Doctor | null;
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
}

const initialState: DoctorState = {
  profile: null,
  doctors: [],
  loading: false,
  error: null,
};

/* -------------------- SLICE -------------------- */

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    clearDoctorState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // ---------------- PROFILE ----------------
      .addCase(fetchDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load doctor profile";
      })

      // ---------------- VERIFIED DOCTORS ----------------
      .addCase(fetchVerifiedDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVerifiedDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchVerifiedDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch doctors";
      });
  }

});

export const { clearDoctorState } = doctorSlice.actions;
export default doctorSlice.reducer;
