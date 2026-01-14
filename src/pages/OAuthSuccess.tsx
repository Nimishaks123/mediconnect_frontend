// src/pages/OAuthSuccess.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { ROUTES } from "../constants/routes";
import { useAppDispatch } from "../store/hooks";
import { loginSuccess } from "../store/auth/authSlice";

interface DecodedToken {
  id: string;
  email: string;
  role: "PATIENT" | "DOCTOR" | "ADMIN";
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
        };

        // Store in localStorage
        localStorage.setItem("accessToken", token);
        localStorage.setItem("currentUser", JSON.stringify(user));

        // Delay slightly so ProtectedRoute hydrates correctly
        await new Promise((res) => setTimeout(res, 150));

        if (mounted) {
          dispatch(loginSuccess({ user, accessToken: token }));
        }

        toast.success("Login successful!");

        // Redirect based on role
        switch (user.role) {
          case "PATIENT":
            return navigate(ROUTES.USER_DASHBOARD, { replace: true });
          case "DOCTOR":
            return navigate(ROUTES.DOCTOR_ONBOARDING, { replace: true });
          case "ADMIN":
            return navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
        }
      } catch (error) {
        console.error("OAuth error:", error);
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
