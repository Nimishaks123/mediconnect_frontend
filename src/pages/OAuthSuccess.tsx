// src/pages/OAuthSuccess.tsx
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ROUTES } from "../constants/routes";
import { useAppDispatch } from "../store/hooks";
import { setCredentials } from "../store/auth/authSlice";
import { authApi } from "../api/authApi";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const finalizeLogin = async () => {
      try {
        // Fetch user profile using the HTTP-only cookie (handled by axios withCredentials)
        const response = await authApi.getMe();
        
        if (!response.data.success || !response.data.user) {
          throw new Error("Failed to fetch user profile");
        }

        const { user, accessToken } = response.data;

        // Sync with Redux store (and localStorage via slice)
        dispatch(setCredentials({ 
          user: user as any, 
          accessToken: accessToken ?? "" // Backend getMe returns this for sync
        }));

        toast.success("Login successful!");

        // Route based on role
        if (user.role === "ADMIN") {
          navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
        } else if (user.role === "DOCTOR") {
          const status = (user as any).onboardingStatus;
          if (status === "APPROVED") {
            navigate(ROUTES.DOCTOR_DASHBOARD, { replace: true });
          } else {
            navigate(ROUTES.DOCTOR_ONBOARDING, { replace: true });
          }
        } else {
          navigate(ROUTES.HOME, { replace: true });
        }
      } catch (error) {
        console.error("OAuth Finalization Error:", error);
        toast.error("Authentication failed. Please try again.");
        navigate(ROUTES.LOGIN, { replace: true });
      }
    };

    finalizeLogin();
  }, [dispatch, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-700 text-lg font-medium">Authenticating with Google…</p>
        <p className="text-gray-400 text-sm mt-2">Please wait while we set up your session</p>
      </div>
    </div>
  );
}

