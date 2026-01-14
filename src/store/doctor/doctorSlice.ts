import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {api} from "../../api/api";
import type { Doctor } from "../../types/Doctor";
import { mapDoctorFromApi } from "../../mappers/doctorMapper";

/* -------------------- THUNKS -------------------- */

export const fetchDoctorProfile = createAsyncThunk<
  Doctor,
  void,
  { rejectValue: string }
>("doctor/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/api/doctor/profile");
    return mapDoctorFromApi(res.data);
  } catch {
    return rejectWithValue("Failed to load doctor profile");
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
