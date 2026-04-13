import { Route } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";

import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import PendingDoctorsPage from "../pages/PendingDoctorsPage";
import AdminUsersPage from "../pages/AdminUsersPage";
import AdminAppointmentsPage from "../pages/AdminAppointmentsPage";
import AdminAppointmentDetailsPage from "../pages/AdminAppointmentDetailsPage";
import AdminWalletsPage from "../pages/AdminWalletsPage";
import AdminWalletDetailsPage from "../pages/AdminWalletDetailsPage";
import { ROUTES } from "../constants/routes";

export const AdminRoutes = () => (
  <>
    <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />

    <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
      <Route element={<AdminLayout />}>
        <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
        <Route
          path={ROUTES.ADMIN_PENDING_DOCTORS}
          element={<PendingDoctorsPage />}
        />
        <Route path={ROUTES.ADMIN_USERS} element={<AdminUsersPage />} />
        <Route path={ROUTES.ADMIN_APPOINTMENTS} element={<AdminAppointmentsPage />} />
        <Route path={ROUTES.ADMIN_APPOINTMENT_DETAILS} element={<AdminAppointmentDetailsPage />} />
        <Route path={ROUTES.ADMIN_WALLETS} element={<AdminWalletsPage />} />
        <Route path={ROUTES.ADMIN_WALLET_DETAILS} element={<AdminWalletDetailsPage />} />
      </Route>
    </Route>
  </>
);
