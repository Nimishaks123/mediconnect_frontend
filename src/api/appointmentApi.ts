import { api } from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
// Get verified doctors
export const getVerifiedDoctors = () =>
  api.get(API_ENDPOINTS.DOCTORS.VERIFIED);


export const getDoctorAvailability = (
  doctorId: string,
  date: string
) =>
  api.get(API_ENDPOINTS.PATIENT_DOCTORS.GET_AVAILABILITY(
      doctorId
    ), {
    params: {
      from: date,
      to: date,
    },
  });

export const bookAppointment = (
  data: {
    doctorId: string;
    slotId: string;
    date?: string;
  }
) =>
  api.post(
    API_ENDPOINTS.APPOINTMENTS.CREATE,
    data
  );

// Cancel appointment
export const cancelAppointment = (appointmentId: string) =>
  api.patch(API_ENDPOINTS.APPOINTMENTS.CANCEL(
      appointmentId
    ));
