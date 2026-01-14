import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { sendForgotPasswordOtp } from "../../store/auth/forgotPasswordSlice";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  forgotPasswordSchema,
  
} from "../../validation/forgotPasswordSchema";
import type {forgotPasswordData} from "../../validation/forgotPasswordSchema";

export default function EmailForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error } = useAppSelector(
    (state) => state.forgotPassword
  );

  // react-hook-form + zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<forgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: forgotPasswordData) => {
    try {
      await dispatch(sendForgotPasswordOtp(data.email)).unwrap();
      navigate("/forgot-password-info/otp", {
        state: { email: data.email },
      });
    } catch {
      // server error already handled in redux slice
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      noValidate
    >
      {/* EMAIL INPUT */}
      <div>
        <input
          type="email"
          placeholder="Enter your registered email"
          className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 ${
            errors.email
              ? "border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:ring-blue-200"
          }`}
          {...register("email")}
        />

        {/* CLIENT VALIDATION ERROR */}
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* SERVER ERROR */}
      {error && (
        <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded">
          {error}
        </p>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
    </form>
  );
}

