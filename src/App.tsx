import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useAppDispatch } from "./store/hooks";
import { loadUserFromToken } from "./store/auth/authSlice";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import OtpPage from "./pages/OtpPage";
import UserDashboard from "./pages/UserDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import OAuthSuccess from "./pages/OAuthSuccess";
import GoogleStart from "./pages/GoogleStart";
import PendingDoctorsPage from "./pages/PendingDoctorsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import DoctorOnboarding from "./pages/doctor-onboarding/DoctorOnboarding";
import DoctorDashboard from "./pages/DoctorDashboard";
import ForgotPasswordEmailPage from "./pages/ForgotPasswordEmailPage";
import ForgotPasswordOtpPage from "./pages/ForgotPasswordOtpPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DoctorListPage from "./pages/DoctorListPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import DoctorAvailabilityPage from "./pages/DoctorAvailabilityPage";
import { ROUTES } from "./constants/routes";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      dispatch(loadUserFromToken(token));
    }
  }, [dispatch]);
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* PUBLIC */}
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<SignUp />} />
        <Route path={ROUTES.OTP} element={<OtpPage />} />

        {/* GOOGLE AUTH */}
        <Route path={ROUTES.GOOGLE_START} element={<GoogleStart />} />
        <Route path={ROUTES.OAUTH_SUCCESS} element={<OAuthSuccess />} />

        {/* FORGOT PASSWORD */}
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordEmailPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD_OTP} element={<ForgotPasswordOtpPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD_RESET} element={<ResetPasswordPage />} />

        {/* ADMIN */}
        <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
          <Route path={ROUTES.ADMIN_PENDING_DOCTORS} element={<PendingDoctorsPage />} />
          <Route path={ROUTES.ADMIN_USERS} element={<AdminUsersPage />} />
        </Route>

        {/* PATIENT */}
        {/* <Route element={<ProtectedRoute allowedRoles={["PATIENT"]} />}>
          <Route path={ROUTES.USER_DASHBOARD} element={<UserDashboard />} />
        </Route> */}
        <Route element={<ProtectedRoute allowedRoles={["PATIENT"]} />}>
  <Route path={ROUTES.USER_DASHBOARD} element={<UserDashboard />} />
  <Route path={ROUTES.DOCTORS} element={<DoctorListPage />} />
  <Route
    path={ROUTES.DOCTOR_AVAILABILITY}
    element={<DoctorAvailabilityPage />}
  />
</Route>

        {/* DOCTOR */}
        <Route element={<ProtectedRoute allowedRoles={["DOCTOR"]} />}>
  <Route
    path={ROUTES.DOCTOR_DASHBOARD}
    element={<DoctorDashboard />}
  />
  <Route
    path={ROUTES.DOCTOR_ONBOARDING}
    element={<DoctorOnboarding />}
  />
</Route>
        
      </Routes>
    </>
  );
};

export default App;
