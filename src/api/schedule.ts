import { api } from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
export interface DoctorSlot {
  date: string;        // YYYY-MM-DD
  startTime: string;   // HH:mm
  endTime: string;     // HH:mm
}
export interface DoctorSlotWithBooking {
  _id?: string;
  date: string;
  startTime: string;
  endTime: string;

  isBooked: boolean;

  appointmentId?: string;

  patient?: {
    id: string;
    name: string;
  };

  status?: "CONFIRMED" | "PAYMENT_PENDING" | "CANCELLED";
}

export interface TimeWindowPayload {
  start: string;
  end: string;
}

export interface CreateDoctorSchedulePayload {
  rrule: string;
  timeWindows: TimeWindowPayload[];
  slotDuration: number;
  validFrom: string;
  validTo: string;
  timezone?: string;
}


export const createDoctorSchedule = (
  data: CreateDoctorSchedulePayload
) => {
  return api.post(API_ENDPOINTS.DOCTOR_SCHEDULES.CREATE, data);
};

export const getDoctorSlots = (from: string, to: string) => {
  return api.get<DoctorSlot[]>(
    API_ENDPOINTS.DOCTOR_SCHEDULES.GET_SLOTS,
    { params: { from, to } }
  );
};
// export const getDoctorSlotsForPatient = (
//   doctorId: string,
//   from: string,
//   to: string
// ) => {
//   return api.get<DoctorSlot[]>(
//     `/patient/doctors/${doctorId}/slots`,
//     { params: { from, to } }
//   );
// };
//
// export const getDoctorSlotsForPatient = (
//   doctorId: string,
//   from: string,
//   to: string
// ) => {
//   return api.get<DoctorSlot[]>(
//     "/patient/doctors/slots",
//     {
//       params: {
//         doctorId,
//         from,
//         to
//       }
//     }
//   );
// };
export const getDoctorSlotsForPatient = (
  doctorId: string,
  from: string,
  to: string
) => {
  return api.get<DoctorSlot[]>(
    API_ENDPOINTS.PATIENT_DOCTORS.GET_AVAILABILITY(
      doctorId
    ),
    {
      params: { from, to }
    }
  );
};
export const getDoctorSlotsWithBooking = (
  from: string,
  to: string
) => {
  return api.get<DoctorSlotWithBooking[]>(
    API_ENDPOINTS.DOCTOR_SCHEDULES.GET_SLOTS_WITH_BOOKING,
    { params: { from, to } }
  );
};

export const deleteSlot = (slotId: string) => {
  return api.delete( API_ENDPOINTS.DOCTOR_SCHEDULES.DELETE_SLOT(
      slotId
    ));
};


