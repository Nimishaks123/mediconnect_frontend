import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getVerifiedDoctors
} from "../../api/doctors";
import {
  getDoctorAvailability,
  bookAppointment,
} from "../../api/appointmentApi";
import axios from "axios";
 import type { Doctor } from "../../types/Doctor";
 import type { DoctorAvailability } from "../../types/DoctorAvailability";
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
export const bookAppointmentThunk =
  createAsyncThunk<
    boolean,
    {
      doctorId: string;
      slotId: string;
      date?: string;
    },
    { rejectValue: string }
  >(
    "appointments/bookAppointment",

    async (
      {
        doctorId,
        slotId,
        date,
      },
      { rejectWithValue }
    ) => {

      try {

        await bookAppointment({
          doctorId,
          slotId,
          date,
        });

        return true;

      } catch (error: unknown) {

        if (
          axios.isAxiosError(error)
        ) {

          return rejectWithValue(
            error.response?.data
              ?.message ||
              "Booking failed"
          );
        }

        return rejectWithValue(
          "Unexpected error occurred"
        );
      }
    }
  );
export interface FetchDoctorsParams {
  page: number;
  limit: number;
  specialty?: string;
  experience?: string;
  sortBy?:string;
}

export const fetchVerifiedDoctors = createAsyncThunk<
  {
    doctors: Doctor[];
    total: number;
  },
  FetchDoctorsParams,
  { rejectValue: string }
>(
  "appointments/fetchVerifiedDoctors",

  async (params, { rejectWithValue }) => {
    try {

      const res =
        await getVerifiedDoctors(params);

      return res.data;

    } catch (error: unknown) {

      if (axios.isAxiosError(error)) {

        return rejectWithValue(
          error.response?.data?.message ||
          "Failed to load doctors"
        );
      }

      return rejectWithValue(
        "Unexpected error occurred"
      );
    }
  }
);