import React, { useState, useEffect } from "react";
import { otpApi } from "../../api/otpApi";
import { ROUTES } from "../../constants/routes";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import { useAppDispatch } from "../../store/hooks";
import { loginSuccess } from "../../store/auth/authSlice";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export default function OtpForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const email = localStorage.getItem("signupEmail") || "";
  const signupPassword = localStorage.getItem("signupPassword") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);


  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };


  const handleResendOtp = async () => {
    try {
      await otpApi.resendOtp(email);
    toast.success("OTP resent successfully!");
      setTimer(60);
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
     toast.error(err.response?.data?.error || "Failed to resend OTP");
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const code = otp.join("");

    try {
      const verifyRes = await otpApi.verifyOtp(email, code);
      const verifiedUser = verifyRes?.data?.user;

      if (!verifiedUser) {
        toast.error("User data missing from OTP response.");
        return;
      }

    
      const loginRes = await authApi.login(email, signupPassword);
      const loggedInUser = loginRes.data.user;
      const token = loginRes.data.accessToken;

      
      dispatch(loginSuccess({ user: loggedInUser, accessToken: token }));
      localStorage.setItem("currentUser", JSON.stringify(loggedInUser));
      localStorage.setItem("accessToken", token);

      localStorage.removeItem("signupEmail");
      localStorage.removeItem("signupPassword");

      if (loggedInUser.role === "DOCTOR") {
        navigate(ROUTES.DOCTOR_ONBOARDING);
      } else {
        navigate(ROUTES.USER_DASHBOARD);
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
 toast.error(err.response?.data?.error || "Invalid OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  
  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
        Enter OTP
      </h2>

      <p className="text-gray-600 text-center mb-6">
        OTP sent to <br />
        <span className="text-mediconnect-teal">{email}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(e, index)}
              className="w-12 h-12 border border-gray-400 rounded-xl text-center text-xl font-semibold focus:ring-2 focus:ring-mediconnect-teal"
            />
          ))}
        </div>

        {/* TIMER */}
        <div className="text-center text-gray-600">
          {timer > 0 ? (
            <p>
              Resend OTP in{" "}
              <span className="font-semibold text-mediconnect-teal">{timer}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-mediconnect-teal font-semibold hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-sky-600 text-white py-3 rounded-lg font-semibold 
                     hover:bg-sky-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
}
