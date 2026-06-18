import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { getPrescription } from "../../api/prescription";
import type { Prescription } from "../../types/prescription";

export const fetchPrescription =
  createAsyncThunk<
    Prescription,
    string,
    { rejectValue: string }
  >(
    "prescription/fetchPrescription",

    async (
      appointmentId,
      { rejectWithValue }
    ) => {
      try {

        const res =
          await getPrescription(
            appointmentId
          );

        return res.data;

      } catch (error: unknown) {

        if (
          axios.isAxiosError(error)
        ) {
          return rejectWithValue(
            error.response?.data
              ?.message ||
            "Failed to fetch prescription"
          );
        }

        return rejectWithValue(
          "Unexpected error occurred"
        );
      }
    }
  );