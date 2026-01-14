// src/store/doctor/doctorSelectors.ts
import type { RootState } from "../index";

export const selectDoctorProfile = (state: RootState) =>
  state.doctor.profile;

export const selectDoctorLoading = (state: RootState) =>
  state.doctor.loading;
