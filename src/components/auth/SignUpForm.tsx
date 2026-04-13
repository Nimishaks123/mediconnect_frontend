import type { AxiosError } from "axios";
import { useState } from "react";
import { api } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import toast from "react-hot-toast";
import { z } from "zod";

// ------------------- ZOD VALIDATION SCHEMA -------------------

const SignupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Enter a valid email address"),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be 10 digits")
      .max(10, "Phone number must be 10 digits")
      .regex(/^[0-9]+$/, "Phone number must contain only digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignupFormData = z.infer<typeof SignupSchema>;
type SignupErrors = Partial<Record<keyof SignupFormData, string>>;

// ------------------------------------------------------------------

export default function SignUpForm() {
  const navigate = useNavigate();

  const [userType, setUserType] = useState<"PATIENT" | "DOCTOR">("PATIENT");

  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<SignupErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof SignupFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const result = SignupSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: SignupErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof SignupFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        role: userType,
      };

      const response = await api.post("/auth/signup", payload);

      toast.success(response.data.message || "Signup successful!");

      localStorage.setItem("signupEmail", payload.email);
      localStorage.setItem("signupPassword", payload.password);
      localStorage.setItem("signupRole", payload.role);

      navigate(ROUTES.OTP);
    } catch (error) {
      const axiosErr = error as AxiosError<{ error?: string; message?: string }>;
      const backendMsg =
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        "Signup failed";
      toast.error(backendMsg);
    }
  };

  //  Google signup using navigation 
  const handleGoogleSignup = () => {
    navigate("/auth/google-start?role=" + userType.toLowerCase());
  };

  return (
    <div className="max-w-md mx-auto bg-gray-100 rounded-lg shadow-xl p-8">
      {/* TOGGLE BUTTONS */}
      <div className="flex mb-6 border-b border-gray-300">
        <button
          type="button"
          onClick={() => setUserType("PATIENT")}
          className={`flex-1 py-3 text-center font-medium ${
            userType === "PATIENT"
              ? "text-mediconnect-teal border-b-2 border-mediconnect-teal"
              : "text-gray-700"
          }`}
        >
          PATIENT
        </button>

        <div className="w-px bg-gray-300" />

        <button
          type="button"
          onClick={() => setUserType("DOCTOR")}
          className={`flex-1 py-3 text-center font-medium ${
            userType === "DOCTOR"
              ? "text-mediconnect-teal border-b-2 border-mediconnect-teal"
              : "text-gray-700"
          }`}
        >
          DOCTOR
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Sign Up</h1>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* NAME */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-mediconnect-teal rounded-lg bg-white"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="text" // IMPORTANT: disables browser validation
            name="email"
            autoComplete="off"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-mediconnect-teal rounded-lg bg-white"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* PHONE */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Phone Number
          </label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-mediconnect-teal rounded-lg bg-white"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-mediconnect-teal rounded-lg bg-white"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-mediconnect-teal rounded-lg bg-white"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>

        {/* TERMS */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleInputChange}
            className="w-4 h-4 text-mediconnect-teal border-gray-300 rounded"
          />
          <label className="ml-2 text-gray-700">
            I accept the terms and conditions
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="text-red-500 text-sm">{errors.acceptTerms}</p>
        )}

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600"
        >
          Sign Up
        </button>

        {/* GOOGLE BUTTON */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-3 border py-3 rounded-lg font-semibold bg-white hover:bg-gray-100"
        >
          {/* Google Logo */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
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

          Continue with Google
        </button>
      </form>
    </div>
  );
}
