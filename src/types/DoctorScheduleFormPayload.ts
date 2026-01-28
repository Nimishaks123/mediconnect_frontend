export type TimeWindowPayload = {
  start: string;
  end: string;
};

export type DoctorScheduleFormPayload = {
  rrule: string;
  timeWindows: TimeWindowPayload[];
  slotDuration: number;
  validFrom: string;
  validTo: string;
  timezone?: string;
};
