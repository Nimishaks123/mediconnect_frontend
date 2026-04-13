export const ROLES = {
  ADMIN: "ADMIN",
  DOCTOR: "DOCTOR",
  PATIENT: "PATIENT",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
