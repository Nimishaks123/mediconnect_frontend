import { Route } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import { ROLES } from "../constants/roles";
import DoctorLayout from "../layouts/DoctorLayout";

import DoctorOnboarding from "../pages/doctor-onboarding/DoctorOnboarding";
import DoctorDashboard from "../pages/DoctorDashboard";
import DoctorSchedulePage from "../pages/doctor/schedule";
import DoctorSlotsPage from "../pages/doctor/slots";
import DoctorAppointmentsPage from "../pages/doctor/appointments";
import DoctorAppointmentDetailsPage from "../pages/doctor/appointmentDetails";
import DoctorProfilePage from "../pages/DoctorProfilePage";
import PendingApprovalPage from "../pages/doctor/PendingApprovalPage";
import RejectedPage from "../pages/doctor/RejectedPage";

export const DoctorRoutes = () => (
  <Route element={<ProtectedRoute allowedRoles={[ROLES.DOCTOR]} />}>
    {/* onboarding – no layout */}
    <Route path="/doctor/onboarding" element={<DoctorOnboarding />} />
    <Route path="/doctor/pending-approval" element={<PendingApprovalPage />} />
    <Route path="/doctor/rejected" element={<RejectedPage />} />

    {/* dashboard layout */}
    <Route path="/doctor" element={<DoctorLayout />}>
      <Route index element={<DoctorDashboard />} />
      <Route path="profile" element={<DoctorProfilePage />} />
      <Route path="schedule" element={<DoctorSchedulePage />} />
      <Route path="slots" element={<DoctorSlotsPage />} />
      <Route path="appointments" element={<DoctorAppointmentsPage />} />
      <Route path="appointments/:id" element={<DoctorAppointmentDetailsPage />} />
    </Route>
  </Route>
);
