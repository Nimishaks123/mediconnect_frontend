import { z } from "zod";

/* ───────────── Time window ───────────── */
export const timeWindowSchema = z.object({
  start: z
    .string()
    .regex(/^([0-1]\d|2[0-3]):[0-5]\d$/, "Invalid start time"),
  end: z
    .string()
    .regex(/^([0-1]\d|2[0-3]):[0-5]\d$/, "Invalid end time"),
}).refine(
  (val) => val.start < val.end,
  {
    message: "End time must be after start time",
    path: ["end"],
  }
);

/* ───────────── Main form schema ───────────── */
export const scheduleSchema = z.object({
  slotDuration: z
    .number()
    .min(5, "Minimum slot duration is 5 minutes"),

  validFrom: z
    .string()
    .min(1, "Valid From is required"),

  validTo: z
    .string()
    .min(1, "Valid To is required"),

  rrule: z
    .string()
    .min(1, "Please select working days"),

  timeWindows: z
    .array(timeWindowSchema)
    .min(1, "At least one time window is required"),
}).refine(
  (data) => data.validFrom <= data.validTo,
  {
    message: "Valid To must be after Valid From",
    path: ["validTo"],
  }
);

/* ───────────── Form type ───────────── */
export type ScheduleFormData = z.infer<typeof scheduleSchema>;
