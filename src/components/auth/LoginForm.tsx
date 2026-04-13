import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  loginUser,
  selectAuthStatus,
  selectAuthError,
  clearError,
} from "../../store/auth/authSlice";
import { loginSchema } from "../../validation/loginSchema";
import toast from "react-hot-toast";

const doctorImage =
  "https://images.unsplash.com/photo-1550831107-1553da8c8464?w=900&q=80&auto=format&fit=crop";

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const status = useAppSelector(selectAuthStatus);
  const serverError = useAppSelector(selectAuthError);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [localError, setLocalError] = useState<string | null>(null);

  const isSubmitting = status === "loading";
  const error = localError || serverError;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setLocalError(null);
  const parsed=loginSchema.safeParse(formData);
  if(!parsed.success){
    setLocalError(parsed.error.issues[0].message);
    return;
  }

  const result = await dispatch(
    loginUser({
      email: parsed.data.email,
      password: parsed.data.password,
      remember: parsed.data.remember,
    })
  );

  if (loginUser.fulfilled.match(result)) {
    const { user } = result.payload;
    toast.success("Welcome back, " + user.name + "!");

    if (user.role === "PATIENT") {
      navigate(ROUTES.HOME);
    } else if (user.role === "DOCTOR") {
      if (user.onboardingStatus === "APPROVED") {
        navigate(ROUTES.DOCTOR_DASHBOARD);
      } else {
        navigate(ROUTES.DOCTOR_ONBOARDING);
      }
    } else if (user.role === "ADMIN") {
      navigate(ROUTES.ADMIN_DASHBOARD);
    } else {
      navigate(ROUTES.HOME);
    }
  } else if (loginUser.rejected.match(result)) {
     toast.error(result.payload as string || "Login failed");
     dispatch(clearError());
  }
};

  const handlePatientGoogleLogin = () => {
    navigate("/auth/google-start?role=patient");
  };

  const handleDoctorGoogleLogin = () => {
    navigate("/auth/google-start?role=doctor");
  };


  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12">
        Welcome Back
      </h1>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div className="bg-white rounded-b-3xl rounded-t-lg shadow-xl overflow-hidden">
          <img
            src={doctorImage}
            alt="Doctor consulting with patient"
            className="w-full h-80 object-cover"
          />
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Log In</h2>
          <p className="text-gray-600 mb-6">
            Enter your credentials to access your MediConnect account.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off" noValidate>
          <input
    type="text"
    name="fake-username"
    autoComplete="username"
    style={{ display: "none" }}
  />
  <input
    type="password"
    name="fake-password"
    autoComplete="new-password"
    style={{ display: "none" }}
  />
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@email.com" autoComplete="off"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mediconnect-teal"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"  autoComplete="new-password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mediconnect-teal"
              
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 text-gray-600">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="w-4 h-4 text-mediconnect-teal border-gray-300 rounded focus:ring-mediconnect-teal"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
                className="text-mediconnect-teal font-semibold hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sky-600 transition-colors"
            >
              {isSubmitting ? "Signing In..." : "Log In"}
            </button>

            {/* PATIENT GOOGLE BUTTON */}
            <button
              type="button"
              onClick={handlePatientGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border py-3 rounded-lg font-semibold bg-white hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.9 0-12.5-5.6-12.5-12.5S17.1 11 24 11c3.2 0 6.2 1.2 8.5 3.3L38 8.8C34.3 5.4 29.4 3.5 24 3.5 12.6 3.5 3.5 12.6 3.5 24S12.6 44.5 24 44.5 44.5 35.4 44.5 24c0-1.1-.1-2.3-.3-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7L12.7 19.4C14.2 15.4 18.2 12.4 24 12.4c3.2 0 6.2 1.2 8.5 3.3L38 8.8C34.3 5.4 29.4 3.5 24 3.5 16.1 3.5 9.2 7.9 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44.5c5.4 0 10.3-1.9 14.1-5.1l-5.9-4.9c-2.3 2.1-5.3 3.3-8.5 3.3-5.3 0-9.7-3.4-11.3-8l-6.4 4.7C9.2 41.1 16.1 44.5 24 44.5z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-.7 2-2 3.8-3.7 5.1l5.9 4.9C41.9 34.3 44.5 29.5 44.5 24c0-1.1-.1-2.3-.3-3.5z"
                />
              </svg>
              Continue as Patient
            </button>

            {/* DOCTOR GOOGLE BUTTON */}
            <button
              type="button"
              onClick={handleDoctorGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border py-3 rounded-lg font-semibold bg-white hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.9 0-12.5-5.6-12.5-12.5S17.1 11 24 11c3.2 0 6.2 1.2 8.5 3.3L38 8.8C34.3 5.4 29.4 3.5 24 3.5 12.6 3.5 3.5 12.6 3.5 24S12.6 44.5 24 44.5 44.5 35.4 44.5 24c0-1.1-.1-2.3-.3-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7L12.7 19.4C14.2 15.4 18.2 12.4 24 12.4c3.2 0 6.2 1.2 8.5 3.3L38 8.8C34.3 5.4 29.4 3.5 24 3.5 16.1 3.5 9.2 7.9 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44.5c5.4 0 10.3-1.9 14.1-5.1l-5.9-4.9c-2.3 2.1-5.3 3.3-8.5 3.3-5.3 0-9.7-3.4-11.3-8l-6.4 4.7C9.2 41.1 16.1 44.5 24 44.5z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-.7 2-2 3.8-3.7 5.1l5.9 4.9C41.9 34.3 44.5 29.5 44.5 24c0-1.1-.1-2.3-.3-3.5z"
                />
              </svg>
              Continue as Doctor
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6 text-sm">
            Don’t have an account?{" "}
            <a
              href={ROUTES.SIGNUP}
              className="text-mediconnect-teal font-semibold hover:underline"
            >
              Sign up now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
