import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getVerifiedDoctors,
  getDoctorAvailability,
  bookAppointment,
} from "../../api/appointmentApi";
import axios from "axios";
import type { Doctor } from "../../types/Doctor";
import type { DoctorAvailability } from "../../types/DoctorAvailability";


/* ================= DOCTORS ================= */


export const fetchVerifiedDoctors = createAsyncThunk<
  Doctor[],
  void,
  { rejectValue: string }
>(
  "appointments/fetchVerifiedDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getVerifiedDoctors();
      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to load doctors"
        );
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);

// Fetch doctor availability

export const fetchDoctorAvailability = createAsyncThunk<
  DoctorAvailability[],
  { doctorId: string; date: string },
  { rejectValue: string }
>(
  "appointments/fetchDoctorAvailability",
  async ({ doctorId, date }, { rejectWithValue }) => {
    try {
      const res = await getDoctorAvailability(doctorId, date);
      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to load availability"
        );
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);

// Book appointment
export const bookAppointmentThunk = createAsyncThunk<
  boolean,
  { doctorId: string; availabilityId: string },
  { rejectValue: string }
>(
  "appointments/bookAppointment",
  async ({ doctorId, availabilityId }, { rejectWithValue }) => {
    try {
      await bookAppointment({ doctorId, availabilityId });
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Booking failed"
        );
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);
