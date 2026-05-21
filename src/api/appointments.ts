// import {api} from "./api"; 
// import { API_ENDPOINTS } from "../constants/apiEndpoints";
// export type CreateAppointmentPayload = {
//   doctorId: string;
//   date: string;
//   startTime: string;
//   endTime: string;
// };

// export const createAppointment = async (
//   payload: { doctorId: string; slotId: string; date?: string }
// ) => {
//   console.log("Sending appointment payload:", payload);
//   const res = await api.post( API_ENDPOINTS.APPOINTMENTS.CREATE, payload);
//   return res.data;
// };


// export const getDoctorAppointments = async () => {
//   const res = await api.get( API_ENDPOINTS.DOCTOR_APPOINTMENTS.GET_ALL);
//   return res.data;
// };

// export const cancelDoctorAppointment = async (id: string) => {
//     const res = await api.patch(API_ENDPOINTS.DOCTOR_APPOINTMENTS.CANCEL(
//         id
//       ));
//     return res.data;
// };

// export const rescheduleDoctorAppointment = async (id: string, newSlotId: string) => {
//     const res = await api.patch(  API_ENDPOINTS.DOCTOR_APPOINTMENTS.RESCHEDULE(
//         id
//       ), { newSlotId });
//     return res.data;
// };
import { api } from "./api";

import { API_ENDPOINTS }
from "../constants/apiEndpoints";

export type CreateAppointmentPayload = {
  doctorId: string;
  slotId: string;
  date?: string;
};

export const createAppointment = async (
  payload: CreateAppointmentPayload
) => {

  console.log(
    "Sending appointment payload:",
    payload
  );

  const res = await api.post(
    API_ENDPOINTS.APPOINTMENTS.CREATE,
    payload
  );

  return res.data;
};

export const getDoctorAppointments =
  async () => {

    const res = await api.get(
      API_ENDPOINTS
        .DOCTOR_APPOINTMENTS
        .GET_ALL
    );

    return res.data;
};

export const cancelDoctorAppointment =
  async (id: string) => {

    const res = await api.patch(
      API_ENDPOINTS
        .DOCTOR_APPOINTMENTS
        .CANCEL(id)
    );

    return res.data;
};

export const rescheduleDoctorAppointment =
  async (
    id: string,
    newSlotId: string
  ) => {

    const res = await api.patch(
      API_ENDPOINTS
        .DOCTOR_APPOINTMENTS
        .RESCHEDULE(id),
      { newSlotId }
    );

    return res.data;
};