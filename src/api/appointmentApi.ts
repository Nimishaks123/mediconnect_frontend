import { api } from "./api";

/* ================= DOCTORS ================= */

// Get verified doctors
export const getVerifiedDoctors = () =>
  api.get("/doctors/verified");

// Get availability for a doctor
export const getDoctorAvailability = (
  doctorId: string,
  date: string
) =>
  api.get(`/doctors/${doctorId}/availability`, {
    params: { date },
  });

/* ================= APPOINTMENTS ================= */

// Book appointment (PATIENT)
export const bookAppointment = (data: {
  doctorId: string;
  availabilityId: string;
}) =>
  api.post("/appointments", data);

// Cancel appointment
export const cancelAppointment = (appointmentId: string) =>
  api.patch(`/appointments/${appointmentId}/cancel`);
