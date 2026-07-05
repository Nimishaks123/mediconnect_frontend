import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { getDoctorAppointments } from "../../../api/appointments";

import type { DoctorAppointmentsResponse } from "../../../types/DoctorAppointment";

export const fetchDoctorAppointments = createAsyncThunk<
  DoctorAppointmentsResponse,
  void,
  { rejectValue: string }
>(
  "doctorAppointments/fetchDoctorAppointments",

  async (_, { rejectWithValue }) => {
    try {
      const res = await getDoctorAppointments();
      console.log("Doctor Appointments API:", res);

console.log("Doctor Appointments API Data:", res.data);


      return res;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ??
            "Failed to load appointments"
        );
      }

      return rejectWithValue(
        "Unexpected error occurred"
      );
    }
  }
);