import {api} from "./api"; 

export type CreateAppointmentPayload = {
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
};

export const createAppointment = async (
  payload: { doctorId: string; slotId: string; date?: string }
) => {
  console.log("Sending appointment payload:", payload);
  const res = await api.post("/appointments", payload);
  return res.data;
};


export const getDoctorAppointments = async () => {
  const res = await api.get("/doctor/appointments");
  return res.data;
};

export const cancelDoctorAppointment = async (id: string) => {
    const res = await api.patch(`/doctor/appointments/${id}/cancel`);
    return res.data;
};

export const rescheduleDoctorAppointment = async (id: string, newSlotId: string) => {
    const res = await api.patch(`/doctor/appointments/${id}/reschedule`, { newSlotId });
    return res.data;
};
