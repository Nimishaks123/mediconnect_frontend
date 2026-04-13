// src/components/common/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/auth/authSlice";
import { ROUTES } from "../../constants/routes";
import type { AuthUser, Role } from "../../store/auth/authSlice";

type ProtectedRouteProps = {
  allowedRoles?: Role[];
};

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const reduxUser = useAppSelector(selectCurrentUser);
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");

  const [hydratedUser, setHydratedUser] = useState<AuthUser | null | undefined>(
    undefined
  );

  // 🟦 Hydrate from Redux or localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");

    if (reduxUser) {
      setHydratedUser(reduxUser);
    } else if (storedUser) {
      try {
        setHydratedUser(JSON.parse(storedUser));
      } catch {
        setHydratedUser(null);
      }
    } else {
      setHydratedUser(null);
    }
  }, [reduxUser]);

  // 🟧 Still hydrating? Wait.
  if (hydratedUser === undefined) {
    return <div />; // prevents redirect loops
  }

  // 🔴 No token OR no user → force login
  if (!accessToken || !hydratedUser) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }


  // 🔒 Doctor onboarding check (MUST be approved to access non-onboarding doctor routes)
  if (hydratedUser.role === "DOCTOR") {
    const path = location.pathname;
    const isAccessingOnboarding = path.startsWith("/doctor/onboarding");
    const isAccessingStatusPages = path === ROUTES.DOCTOR_PENDING || path === ROUTES.DOCTOR_REJECTED || path === ROUTES.DOCTOR_PROFILE;

    if (hydratedUser.onboardingStatus === "APPROVED") {
      // Approved doctors shouldn't be stuck on onboarding or pending pages
      if (isAccessingOnboarding || path === ROUTES.DOCTOR_PENDING) {
        return <Navigate to={ROUTES.DOCTOR_DASHBOARD} replace />;
      }
    } else if (hydratedUser.onboardingStatus === "REJECTED") {
      if (path !== ROUTES.DOCTOR_REJECTED && path !== ROUTES.DOCTOR_PROFILE) {
        return <Navigate to={ROUTES.DOCTOR_REJECTED} replace />;
      }
    } else if (hydratedUser.onboardingStatus === "SUBMITTED") {
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
  if (allowedRoles && !allowedRoles.includes(hydratedUser.role)) {
    const fallback =
      hydratedUser.role === "ADMIN"
        ? ROUTES.ADMIN_DASHBOARD
        : hydratedUser.role === "DOCTOR"
        ? ROUTES.DOCTOR_ONBOARDING
        : ROUTES.USER_DASHBOARD;

    return <Navigate to={fallback} replace />;
  }

  // 🟢 All good — allow page
  return <Outlet />;
}
