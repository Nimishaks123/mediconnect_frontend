import { api } from "./api";

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

/* ================= DOCTOR APIs ================= */

export const createDoctorSchedule = (
  data: CreateDoctorSchedulePayload
) => {
  return api.post("/doctor/schedules", data);
};

export const getDoctorSlots = (from: string, to: string) => {
  return api.get<DoctorSlot[]>(
    "/doctor/schedules/slots",
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
    `/patient/doctors/slots/${doctorId}`,
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
    "/doctor/schedules/slots-with-booking",
    { params: { from, to } }
  );
};

export const deleteSlot = (slotId: string) => {
  return api.delete(`/doctor/schedules/slots/${slotId}`);
};


