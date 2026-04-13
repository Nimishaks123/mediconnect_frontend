// Router mapping
import { Route } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import { ROLES } from "../constants/roles";
import UserLayout from "../layouts/UserLayout";

import UserDashboard from "../pages/UserDashboard";
import DoctorListPage from "../pages/DoctorListPage";
import DoctorAvailabilityPage from "../pages/DoctorAvailabilityPage";
import DoctorAppointmentPage from "../pages/DoctorAppointmentPage";
import PatientAppointmentsPage from "../pages/PatientAppointmentsPage";
import PatientAppointmentDetailsPage from "../pages/PatientAppointmentDetailsPage";
import PatientWalletPage from "../pages/PatientWalletPage";
import PatientProfilePage from "../pages/PatientProfilePage";

import PaymentSuccessPage from "../pages/PaymentSuccessPage";
import PaymentCancelledPage from "../pages/PaymentCancelledPage";

import { ROUTES } from "../constants/routes";

export const PatientRoutes = () => (
  <Route element={<ProtectedRoute allowedRoles={[ROLES.PATIENT]} />}>
    <Route element={<UserLayout />}>
      <Route path={ROUTES.USER_DASHBOARD} element={<UserDashboard />} />
      <Route path={ROUTES.DOCTORS} element={<DoctorListPage />} />
      <Route path={ROUTES.DOCTOR_AVAILABILITY} element={<DoctorAvailabilityPage />} />
      <Route path="/patient/appointments/:doctorId" element={<DoctorAppointmentPage />} />
      <Route path={ROUTES.PATIENT_APPOINTMENTS} element={<PatientAppointmentsPage />} />
      <Route path="/appointments/:id" element={<PatientAppointmentDetailsPage />} />
      <Route path={ROUTES.PATIENT_WALLET} element={<PatientWalletPage />} />
      <Route path={ROUTES.PATIENT_PROFILE} element={<PatientProfilePage />} />
      <Route path="/payment-success/:appointmentId" element={<PaymentSuccessPage />} />
      <Route path="/payment-cancelled" element={<PaymentCancelledPage />} />
    </Route>
  </Route>
);