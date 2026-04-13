import { api } from "./api";

/* ================= DOCTORS ================= */

// Get verified doctors
export const getVerifiedDoctors = () =>
  api.get("/doctors/verified");


export const getDoctorAvailability = (
  doctorId: string,
  date: string
) =>
  api.get(`/patient/doctors/slots/${doctorId}`, {
    params: {
      from: date,
      to: date,
    },
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
