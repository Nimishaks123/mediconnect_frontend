import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { patientApi } from "../../api/patientApi";
import type { AxiosError } from "axios";

export interface PatientProfile {
  id: string;
  userId: string;
  name: string;
  age: number;
  gender: "MALE" | "FEMALE" | "OTHER";
  phone: string;
  address: string | null;
  profileImage: string | null;
  dateOfBirth: string | null;
  medicalHistory: Record<string, any>;
  allergies: string[];
  bloodGroup: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
}

interface PatientState {
  profile: PatientProfile | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PatientState = {
  profile: null,
  status: "idle",
  error: null,
};

export const getPatientProfile = createAsyncThunk(
  "patient/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await patientApi.getProfile();
      // Backend returns { user, patient }
      return response.data.patient;
    } catch (error) {
      const axiosErr = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosErr.response?.data?.message || "Failed to fetch profile");
    }
  }
);

export const createPatientProfile = createAsyncThunk(
  "patient/createProfile",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await patientApi.createProfile(data);
      return response.data.patient;
    } catch (error) {
      const axiosErr = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosErr.response?.data?.message || "Failed to create profile");
    }
  }
);

export const updatePatientProfile = createAsyncThunk(
  "patient/updateProfile",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await patientApi.updateProfile(data);
      return response.data.patient;
    } catch (error) {
      const axiosErr = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosErr.response?.data?.message || "Failed to update profile");
    }
  }
);

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getPatientProfile
      .addCase(getPatientProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getPatientProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(getPatientProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // createPatientProfile
      .addCase(createPatientProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createPatientProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(createPatientProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // updatePatientProfile
      .addCase(updatePatientProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updatePatientProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(updatePatientProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearProfileError } = patientSlice.actions;
export default patientSlice.reducer;
