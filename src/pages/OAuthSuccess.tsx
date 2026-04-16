// src/pages/OAuthSuccess.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { ROUTES } from "../constants/routes";
import { useAppDispatch } from "../store/hooks";
import { setCredentials } from "../store/auth/authSlice";

interface DecodedToken {
  id: string;
  email: string;
  role: "PATIENT" | "DOCTOR" | "ADMIN";
  onboardingStatus?: string;
  name?: string;
  exp?: number;
}

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    let mounted = true;

    const processOAuth = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
          toast.error("OAuth token missing");
          return navigate(ROUTES.LOGIN, { replace: true });
        }

        const decoded = jwtDecode<DecodedToken>(token);

        if (!decoded?.id || !decoded?.role) {
          toast.error("Invalid token data");
          return navigate(ROUTES.LOGIN, { replace: true });
        }

        const user = {
          id: decoded.id,
          name: decoded.name ?? decoded.email.split("@")[0],
          email: decoded.email,
          role: decoded.role,
          onboardingStatus: decoded.onboardingStatus,
        };

        if (mounted) {
          dispatch(setCredentials({ user, accessToken: token }));
        }

        toast.success("Login successful!");

        // Redirect based on role
        switch (user.role) {
          case "PATIENT":
            return navigate(ROUTES.HOME, { replace: true });
          case "DOCTOR":
            if (decoded.onboardingStatus === "APPROVED") {
              return navigate(ROUTES.DOCTOR_DASHBOARD, { replace: true });
            }
            return navigate(ROUTES.DOCTOR_ONBOARDING, { replace: true });
          case "ADMIN":
            return navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
          default:
            return navigate(ROUTES.HOME, { replace: true });
        }
      } catch (error) {
        toast.error("Google authentication failed");
        navigate(ROUTES.LOGIN, { replace: true });
      }
    };

    processOAuth();

    return () => {
      mounted = false;
    };
  }, [dispatch, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-700 text-lg">Completing sign in…</p>
      </div>
    </div>
  );
}
