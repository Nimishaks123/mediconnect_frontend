import { createSlice } from "@reduxjs/toolkit";

import type {
  Prescription,
} from "../../types/prescription";

import {
  fetchPrescription,
} from "./prescriptionThunks";

interface PrescriptionState {
  prescription:
    Prescription | null;

  loading: boolean;

  error: string | null;
}

const initialState:
  PrescriptionState = {

  prescription: null,

  loading: false,

  error: null,
};

const prescriptionSlice =
  createSlice({
    name: "prescription",

    initialState,

    reducers: {},

    extraReducers: (
      builder
    ) => {

      builder

        .addCase(
          fetchPrescription.pending,
          (state) => {
            state.loading = true;
          }
        )

        .addCase(
          fetchPrescription.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.prescription =
              action.payload;
          }
        )

        .addCase(
          fetchPrescription.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload as string;
          }
        );
    },
  });

export default
  prescriptionSlice.reducer;