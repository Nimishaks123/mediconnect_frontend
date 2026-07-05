
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import forgotPasswordReducer from "./auth/forgotPasswordSlice";
import adminDoctorReducer from "./admin/adminDoctorSlice";
import adminUserReducer from "./admin/adminUserSlice";
import pendingDoctorsReducer from "./admin/pendingDoctorsSlice";
import doctorReducer from "./doctor/doctorSlice";
import appointmentReducer from "./appointments/appointmentSlice"
import patientReducer from "./patient/patientSlice";
import notificationReducer from "./notification/notificationSlice";
import chatReducer from "./chat/chatSlice";
import callReducer from "./call/callSlice";
import prescriptionReducer from "./prescription/prescriptionSlice";
import doctorAppointmentReducer
from "./doctor/doctorAppointments/doctorAppointmentSlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    forgotPassword: forgotPasswordReducer,
     adminDoctors: adminDoctorReducer,
    adminUsers: adminUserReducer,
    pendingDoctors: pendingDoctorsReducer,
        doctor: doctorReducer, 
    appointments: appointmentReducer,
    patient: patientReducer,
    notifications: notificationReducer,
    chat: chatReducer,
    call: callReducer,
    prescription:prescriptionReducer,
    doctorAppointments:
      doctorAppointmentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
