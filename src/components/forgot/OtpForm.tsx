// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../../store/hooks";
// import {
//   verifyForgotPasswordOtp,
//   sendForgotPasswordOtp,
// } from "../../store/auth/forgotPasswordSlice";
// import { ROUTES } from "../../constants/routes";
// import toast from "react-hot-toast";

// export default function ForgotPasswordOtpForm() {
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [timer, setTimer] = useState(60);

//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   const forgotState = useAppSelector((state) => state.forgotPassword);

//   const email =
//     (location.state?.email as string) ||
//     forgotState.email ||
//     "";

//   const { loading, error } = forgotState;

//   // Redirect if email missing
//   useEffect(() => {
//     if (!email) navigate(ROUTES.FORGOT_PASSWORD);
//   }, [email, navigate]);

//   // Timer
//   useEffect(() => {
//     if (timer <= 0) return;
//     const interval = setInterval(() => setTimer((t) => t - 1), 1000);
//     return () => clearInterval(interval);
//   }, [timer]);

//   const handleOtpChange = (value: string, index: number) => {
//     if (!/^\d*$/.test(value)) return;
//     const updated = [...otp];
//     updated[index] = value;
//     setOtp(updated);
//     if (value && index < 5) {
//       document.getElementById(`otp-${index + 1}`)?.focus();
//     }
//   };

//   const handleResendOtp = async () => {
//     try {
//       await dispatch(sendForgotPasswordOtp(email)).unwrap();
//       setTimer(60);
//       toast.success("OTP resent successfully");
//     } catch (error:unknown) {
//       console.error("Failed to resend OTP", error);
//       if (axios.isAxiosError(error)) {
//       toast.error(
//         error.response?.data?.error || "Failed to resend OTP"
//       );
//     } else {
//       toast.error("Something went wrong");
//     }
//   }
//     }
  

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const code = otp.join("");

//     try {
//       await dispatch(
//         verifyForgotPasswordOtp({ email, code })
//       ).unwrap();

//       navigate(ROUTES.FORGOT_PASSWORD_RESET, {
//         state: { email },
//       });
//     } catch (err) {
//       console.error("OTP verification failed", err);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="flex justify-center gap-3">
//         {otp.map((digit, index) => (
//           <input
//             key={index}
//             id={`otp-${index}`}
//             maxLength={1}
//             value={digit}
//             onChange={(e) =>
//               handleOtpChange(e.target.value, index)
//             }
//             className="w-12 h-12 border rounded-xl text-center text-xl"
//           />
//         ))}
//       </div>

//       {error && (
//         <p className="text-red-500 text-center text-sm">
//           {error}
//         </p>
//       )}

//       <div className="text-center text-sm text-gray-600">
//         {timer > 0 ? (
//           <p>
//             Resend OTP in{" "}
//             <span className="font-semibold">{timer}s</span>
//           </p>
//         ) : (
//           <button
//             type="button"
//             onClick={handleResendOtp}
//             className="text-blue-600 hover:underline"
//           >
//             Resend OTP
//           </button>
//         )}
//       </div>

//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full bg-blue-600 text-white py-3 rounded-lg"
//       >
//         {loading ? "Verifying..." : "Verify OTP"}
//       </button>
//     </form>
//   );
// }
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  verifyForgotPasswordOtp,
  sendForgotPasswordOtp,
} from "../../store/auth/forgotPasswordSlice";
import { ROUTES } from "../../constants/routes";
import toast from "react-hot-toast";
import axios from "axios";

export default function ForgotPasswordOtpForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const forgotState = useAppSelector((state) => state.forgotPassword);
  const { loading, error } = forgotState;

  const email =
    (location.state?.email as string) ||
    forgotState.email ||
    "";

  // Redirect if email missing
  useEffect(() => {
    if (!email) navigate(ROUTES.FORGOT_PASSWORD);
  }, [email, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(
      () => setTimer((t) => t - 1),
      1000
    );
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
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
      await dispatch(sendForgotPasswordOtp(email)).unwrap();
      setTimer(60);
      toast.success("OTP resent successfully");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error || "Failed to resend OTP"
        );
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      await dispatch(
        verifyForgotPasswordOtp({ email, code })
      ).unwrap();

      navigate(ROUTES.FORGOT_PASSWORD_RESET, {
        state: { email },
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error || "Invalid OTP"
        );
      } else {
        toast.error("OTP verification failed");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-center gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            maxLength={1}
            value={digit}
            onChange={(e) =>
              handleOtpChange(e.target.value, index)
            }
            className="w-12 h-12 border rounded-xl text-center text-xl"
          />
        ))}
      </div>

      {error && (
        <p className="text-red-500 text-center text-sm">
          {error}
        </p>
      )}

      <div className="text-center text-sm text-gray-600">
        {timer > 0 ? (
          <p>
            Resend OTP in{" "}
            <span className="font-semibold">{timer}s</span>
          </p>
        ) : (
          <button
            type="button"
            disabled={loading}
            onClick={handleResendOtp}
            className="text-blue-600 hover:underline disabled:opacity-50"
          >
            Resend OTP
          </button>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </form>
  );
}
