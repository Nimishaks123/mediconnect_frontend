import { createSlice } from "@reduxjs/toolkit";
import type  { Doctor } from "../../types/Doctor";
import type { DoctorAvailability } from "../../types/DoctorAvailability"
import {
  fetchVerifiedDoctors,
  fetchDoctorAvailability,
  bookAppointmentThunk,
} from "./appointmentThunks";

//types
interface AppointmentState {
  doctors: Doctor[];
  availability: DoctorAvailability[];
  loading: boolean;
  error: string | null;
  bookingSuccess: boolean;
}
const initialState: AppointmentState = {
  doctors: [],
  availability: [],
  loading: false,
  error: null,
  bookingSuccess: false,
};
//slice

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    clearBookingState(state) {
      state.bookingSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
    //verified doctors
      .addCase(fetchVerifiedDoctors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVerifiedDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchVerifiedDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    //availability
      .addCase(fetchDoctorAvailability.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoctorAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availability = action.payload;
      })
      .addCase(fetchDoctorAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
    //book appointment
      .addCase(bookAppointmentThunk.pending, (state) => {
        state.loading = true;
        state.bookingSuccess = false;
      })
      .addCase(bookAppointmentThunk.fulfilled, (state) => {
        state.loading = false;
        state.bookingSuccess = true;
      })
      .addCase(bookAppointmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBookingState } = appointmentSlice.actions;
export default appointmentSlice.reducer;
