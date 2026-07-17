export const API_ENDPOINTS = {
  AUTH: {
    BASE: "/auth",
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    REFRESH: "/auth/refresh",
    VERIFY_OTP: "/auth/verify-otp",
    RESEND_OTP: "/auth/resend-otp",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
    CHANGE_PASSWORD:"/auth/change-password",
  },
  ADMIN_AUTH: {
  BASE: "/admin/auth",
  LOGIN: "/admin/auth/login",
},
ADMIN_USERS: {
  BASE: "/admin/users",

  GET_ALL: "/admin/users",

  BLOCK: "/admin/block-user",

  UNBLOCK: "/admin/unblock-user",
},
  NOTIFICATIONS: {
    UNREAD_COUNT: "/notifications/unread-count",
  },
  
  ADMIN_APPOINTMENTS: {
    BASE: "/admin/appointments",

    GET_ALL: "/admin/appointments",

    GET_DETAILS: (id: string) =>
      `/admin/appointments/${id}`,
  },
  ADMIN_WALLETS: {
  BASE: "/admin/wallets",

  GET_ALL: "/admin/wallets",

  GET_TRANSACTIONS: (userId: string) =>
    `/admin/wallets/${userId}/transactions`,
},
ADMIN_SETTINGS: {
  BASE: "/admin/settings",

  GET: "/admin/settings",

  UPDATE: "/admin/settings",
},
PLATFORM_WALLET: {
  GET: "/admin/platform-wallet",
  TRANSACTIONS: "/admin/platform-wallet/transactions",
},
DASHBOARD: {
    OVERVIEW: "/admin/dashboard/overview",
    REVENUE_TREND: "/admin/dashboard/revenue-trend",
    APPOINTMENT_STATUS: "/admin/dashboard/appointment-status",
},
DOCTOR_DASHBOARD: {
    RECENT_ACTIVITY: "/doctor/dashboard/recent-activity",
},
DOCTORS: {
  VERIFIED: "/doctors/verified",
  GET_BY_ID:(
    doctorId:string
  )=>`/doctor/public/${doctorId}`,
   SPECIALTIES: "/doctor/specialties",
},

DOCTOR_SCHEDULES: {
  BASE: "/doctor/schedules",

  CREATE: "/doctor/schedules",

  GET_SLOTS: "/doctor/schedules/slots",

  GET_SLOTS_WITH_BOOKING:
    "/doctor/schedules/slots-with-booking",

  DELETE_SLOT: (slotId: string) =>
    `/doctor/schedules/slots/${slotId}`,
},

PATIENT_DOCTORS: {
  GET_AVAILABILITY: (doctorId: string) =>
    `/patient/doctors/slots/${doctorId}`,
},

APPOINTMENTS: {
  BASE: "/appointments",

  CREATE: "/appointments",

  CANCEL: (appointmentId: string) =>
    `/appointments/${appointmentId}/cancel`,
  CHECKOUT: (appointmentId: string) =>
  `/appointments/${appointmentId}/checkout`,
},
DOCTOR_APPOINTMENTS: {
  BASE: "/doctor/appointments",

  GET_ALL: "/doctor/appointments",

  CANCEL: (id: string) =>
    `/doctor/appointments/${id}/cancel`,

  RESCHEDULE: (id: string) =>
    `/doctor/appointments/${id}/reschedule`,
},
DOCTOR_ONBOARDING: {
  START: "/doctor/onboarding/start",

  PROFILE: "/doctor/profile",

  UPDATE_PROFILE: "/doctor/profile",

  UPLOAD_DOCUMENTS: "/doctor/upload-documents",

  SUBMIT: "/doctor/submit",
},
FORGOT_PASSWORD: {
  SEND_OTP: "/auth/forgot-password/send-otp",

  VERIFY_OTP: "/auth/forgot-password/verify-otp",

  RESET_PASSWORD: "/auth/forgot-password/reset",
},
PATIENT_PROFILE: {
  BASE: "/patient/profile",

  GET: "/patient/profile",

  CREATE: "/patient/profile",

  UPDATE: "/patient/profile",
},
PATIENT_APPOINTMENTS: {
  BASE: "/patient/appointments",

  GET_ALL: "/patient/appointments",

  CANCEL: (appointmentId: string) =>
    `/patient/appointments/${appointmentId}/cancel`,
  PAY_WITH_WALLET:"/patient/appointments/pay-with-wallet",
},

PATIENT_WALLET: {
  BASE: "/patient/wallet",

  GET: "/patient/wallet",
  TOPUP: "/patient/topup",
  TRANSACTIONS:
    "/patient/wallet/transactions",

},
DOCTOR_WALLET: {
    WALLET: "/doctor/wallet",
    TRANSACTIONS: "/doctor/wallet/transactions",
},
  ADMIN_DOCTORS: {
  BASE: "/admin/doctors",

  GET_ALL: "/admin/doctors",

  APPROVE: "/admin/approve-doctor",

  REJECT: "/admin/reject-doctor",
},
UPLOADS: {
  GET_SIGNATURE: "/upload/signature",
},
REVIEWS:{
  CREATE:"/reviews",
  GET_DOCTOR_REVIEWS:(doctorId:string)=>
    `/reviews/doctor/${doctorId}`,
  },

PRESCRIPTIONS: {
  BASE: "/prescriptions",

  GET_BY_APPOINTMENT: (
    appointmentId: string
  ) => `/prescriptions/${appointmentId}`,
},
}
