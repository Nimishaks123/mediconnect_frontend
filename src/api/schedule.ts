import { api } from "./api";

/* ================= TYPES ================= */

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

export interface DoctorSlot {
  date: string;
  startTime: string;
  endTime: string;
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

/* ================= PATIENT APIs ================= */

export const getDoctorSlotsForPatient = (
  doctorId: string,
  from: string,
  to: string
) => {
  return api.get<DoctorSlot[]>(
    `/patient/doctors/${doctorId}/slots`,
    { params: { from, to } }
  );
};
