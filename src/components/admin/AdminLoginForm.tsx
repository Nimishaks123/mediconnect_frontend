import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

import {
  loginAdmin,
  selectAuthStatus,
  selectAuthError,
  clearError,
} from "../../store/auth/authSlice";
import toast from "react-hot-toast";

const adminImage =
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&q=80&auto=format&fit=crop";

export default function AdminLoginForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const status = useAppSelector(selectAuthStatus);
  const serverError = useAppSelector(selectAuthError);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [localError, setLocalError] = useState<string | null>(null);

  const isSubmitting = status === "loading";
  const error = localError || serverError;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);

    if (!formData.email || !formData.password) {
      setLocalError("Please fill in all fields");
      return;
    }

    const result = await dispatch(
      loginAdmin({
        email: formData.email,
        password: formData.password,
      })
    );

    if (loginAdmin.fulfilled.match(result)) {
      toast.success("Admin access granted");
      navigate(ROUTES.ADMIN_DASHBOARD);
    } else if (loginAdmin.rejected.match(result)) {
      toast.error(result.payload as string || "Admin login failed");
      dispatch(clearError());
    }
  };

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12">
        Admin Portal
      </h1>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div className="bg-white rounded-b-3xl rounded-t-lg shadow-xl overflow-hidden">
          <img
            src={adminImage}
            alt="Admin dashboard"
            className="w-full h-80 object-cover"
          />
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin Login</h2>
          <p className="text-gray-600 mb-6">
            Enter your admin credentials to access the MediConnect admin panel.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@mediconnect.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
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
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing In..." : "Log In"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6 text-sm">
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="text-blue-600 font-semibold hover:underline"
            >
              Back to Home
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
