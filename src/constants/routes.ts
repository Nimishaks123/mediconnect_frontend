export const ROUTES = {
  // PUBLIC
  HOME: "/",
  SIGNUP: "/signup",
  LOGIN: "/login",
  OTP: "/otp",

  // GOOGLE AUTH
  GOOGLE_START: "/auth/google-start",
  OAUTH_SUCCESS: "/oauth-success",

  // FORGOT PASSWORD
  FORGOT_PASSWORD: "/forgot-password",
  FORGOT_PASSWORD_OTP: "/forgot-password-info/otp",
  FORGOT_PASSWORD_RESET: "/forgot-password-info/reset",

  // USER / PATIENT
  USER_DASHBOARD: "/user-dashboard",
  PATIENT_DASHBOARD: "/patient-dashboard",

  // DOCTOR
  DOCTOR_DASHBOARD: "/doctor-dashboard",
  DOCTOR_ONBOARDING: "/doctor/onboarding",
  DOCTOR_ONBOARDING_BASIC_INFO: "/doctor/onboarding/basic-info",
  DOCTOR_ONBOARDING_DOCUMENTS: "/doctor/onboarding/documents",
  DOCTOR_ONBOARDING_REVIEW: "/doctor/onboarding/review",
  DOCTOR_PROFILE: "/doctor/profile",
  DOCTORS: "/doctors",
  DOCTOR_AVAILABILITY: "/doctors/:doctorId/availability",

  // ADMIN
  ADMIN_LOGIN: "/admin/login",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_PENDING_DOCTORS: "/admin/doctors/pending",
  ADMIN_USERS: "/admin/users",
} as const;
