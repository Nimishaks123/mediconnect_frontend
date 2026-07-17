import { Route } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import { ROLES } from "../constants/roles";
import PatientDashboardLayout from "../components/layout/PatientDashboardLayout";
import UserDashboard from "../pages/UserDashboard";
import DoctorAvailabilityPage from "../pages/DoctorAvailabilityPage";
import DoctorAppointmentPage from "../pages/DoctorAppointmentPage";
import PatientAppointmentsPage from "../pages/PatientAppointmentsPage";
import PatientAppointmentDetailsPage from "../pages/PatientAppointmentDetailsPage";
import PatientWalletPage from "../pages/PatientWalletPage";
import PatientProfilePage from "../pages/PatientProfilePage";

import PaymentSuccessPage from "../pages/PaymentSuccessPage";
import PaymentCancelledPage from "../pages/PaymentCancelledPage";
import WalletTopupSuccessPage from "../pages/WalletTopupSuccessPage";
import WalletTopupCancelPage from "../pages/WalletTopupCancelPage";

import { ROUTES } from "../constants/routes";
import PrescriptionPage from "../pages/doctor/PrescriptionPage";

export const PatientRoutes = () => (
  <Route element={<ProtectedRoute allowedRoles={[ROLES.PATIENT]} />}>
    {/* <Route element={<UserLayout />}> */}
    <Route element={<PatientDashboardLayout />}>
      <Route path={ROUTES.USER_DASHBOARD} element={<UserDashboard />} />
      <Route path={ROUTES.DOCTOR_AVAILABILITY} element={<DoctorAvailabilityPage />} />
      <Route path="/patient/appointments/:doctorId" element={<DoctorAppointmentPage />} />
      <Route path={ROUTES.PATIENT_APPOINTMENTS} element={<PatientAppointmentsPage />} />
      <Route path="/appointments/:id" element={<PatientAppointmentDetailsPage />} />
      <Route path={ROUTES.PATIENT_WALLET} element={<PatientWalletPage />} />
      <Route path={ROUTES.PATIENT_PROFILE} element={<PatientProfilePage />} />
      <Route path="/payment-success/:appointmentId" element={<PaymentSuccessPage />} />
      <Route path="/payment-cancelled" element={<PaymentCancelledPage />} />
      <Route path="/prescriptions/:appointmentId" element={<PrescriptionPage/>}/>
      <Route
  path="/wallet/success"
  element={<WalletTopupSuccessPage />}
/>

<Route
  path="/wallet/cancel"
  element={<WalletTopupCancelPage />}
/>
    </Route>
  </Route>
);