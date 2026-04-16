// src/components/common/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { selectAuth } from "../../store/auth/authSlice";
import { ROUTES } from "../../constants/routes";
import type { Role } from "../../store/auth/authSlice";

type ProtectedRouteProps = {
  allowedRoles?: Role[];
};

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, accessToken, status, isInitialized } = useAppSelector(selectAuth);
  const location = useLocation();

  // 1. Wait for initialization (initial token check)
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // 2. If we have no token, definitely not logged in
  if (!accessToken) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // 3. If we have a token but no user, and we're not loading something else
  if (!user && status !== "loading") {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // 4. Loading state with no user yet
  if (status === "loading" && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) return null;

  // 🔒 Doctor onboarding check
  if (user.role === "DOCTOR") {
    const path = location.pathname;
    const isAccessingOnboarding = path.startsWith("/doctor/onboarding");
    const isAccessingStatusPages = path === ROUTES.DOCTOR_PENDING || path === ROUTES.DOCTOR_REJECTED || path === ROUTES.DOCTOR_PROFILE;

    if (user.onboardingStatus === "APPROVED") {
      if (isAccessingOnboarding || path === ROUTES.DOCTOR_PENDING) {
        return <Navigate to={ROUTES.DOCTOR_DASHBOARD} replace />;
      }
    } else if (user.onboardingStatus === "REJECTED") {
      if (path !== ROUTES.DOCTOR_REJECTED && path !== ROUTES.DOCTOR_PROFILE) {
        return <Navigate to={ROUTES.DOCTOR_REJECTED} replace />;
      }
    } else if (user.onboardingStatus === "SUBMITTED") {
      if (path !== ROUTES.DOCTOR_PENDING && path !== ROUTES.DOCTOR_PROFILE) {
        return <Navigate to={ROUTES.DOCTOR_PENDING} replace />;
      }
    } else {
      // BASIC_INFO or DOCUMENTS_PENDING
      if (!isAccessingOnboarding && path !== ROUTES.DOCTOR_PROFILE) {
        return <Navigate to={ROUTES.DOCTOR_ONBOARDING} replace />;
      }
    }
  }

  // 🔒 Role-based protection
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const fallback =
      user.role === "ADMIN"
        ? ROUTES.ADMIN_DASHBOARD
        : user.role === "DOCTOR"
        ? (user.onboardingStatus === "APPROVED" ? ROUTES.DOCTOR_DASHBOARD : ROUTES.DOCTOR_ONBOARDING)
        : ROUTES.USER_DASHBOARD;

    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}
