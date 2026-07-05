import type { RootState } from "../../index";

export const selectUpcomingAppointments = (
    state: RootState
) => state.doctorAppointments.upcoming;

export const selectRecentAppointments = (
    state: RootState
) => state.doctorAppointments.recent;

export const selectPastAppointments = (
    state: RootState
) => state.doctorAppointments.past;

export const selectDoctorAppointmentsLoading = (
  state: RootState
) => state.doctorAppointments.loading;

export const selectDoctorAppointmentsError = (
  state: RootState
) => state.doctorAppointments.error;