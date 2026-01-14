// import { useState } from "react";
// import { useAppDispatch, useAppSelector } from "../../store/hooks";
// import { resetPassword } from "../../store/auth/forgotPasswordSlice";
// import { useLocation, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// export default function ResetPasswordForm() {
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");

//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const email = location.state?.email;
//   const { loading, error } = useAppSelector((state) => state.forgotPassword);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
  
//     if (password !== confirm) {
//   toast.error("Passwords do not match");
//       return;
//     }
  
//     try {
//       await dispatch(
//         resetPassword({ email, newPassword: password })
//       ).unwrap();
  
//       navigate("/login");
//     } catch (err) {
//       console.error("Password reset failed:", err);
//     }
//   };
  

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <input
//         type="password"
//         placeholder="New Password"
//         className="w-full px-4 py-3 border border-gray-300 rounded-lg"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//       />

//       <input
//         type="password"
//         placeholder="Confirm Password"
//         className="w-full px-4 py-3 border border-gray-300 rounded-lg"
//         value={confirm}
//         onChange={(e) => setConfirm(e.target.value)}
//         required
//       />

//       {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}

//       <button
//         type="submit"
//         className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
//         disabled={loading}
//       >
//         {loading ? "Resetting..." : "Reset Password"}
//       </button>
//     </form>
//   );
// }
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { resetPassword } from "../../store/auth/forgotPasswordSlice";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { ROUTES } from "../../constants/routes";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const { loading, error } = useAppSelector(
    (state) => state.forgotPassword
  );

  // 🚨 Redirect if email missing (page refresh case)
  useEffect(() => {
    if (!email) {
      toast.error("Session expired. Please retry forgot password.");
      navigate(ROUTES.FORGOT_PASSWORD);
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await dispatch(
        resetPassword({ email, newPassword: password })
      ).unwrap();

      toast.success("Password reset successfully");
      navigate(ROUTES.LOGIN);
    } catch (error: unknown) {
      console.error("Password reset failed:", error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            "Password reset failed"
        );
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="password"
        placeholder="New Password"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Confirm Password"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
      />

      {error && (
        <p className="text-red-500 text-sm bg-red-50 p-2 rounded">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}
