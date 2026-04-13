import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setOnboardingStatus } from "../../store/auth/authSlice";
import { ROUTES } from "../../constants/routes";
import { doctorOnboardingApi } from "../../api/doctorOnboardingApi";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/auth/authSlice";
import { toast } from "react-hot-toast";

export default function DoctorReviewSubmit() {
  const user = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!user?.id) {
      toast.error("User not found");
      return;
    }

    try {
      setIsSubmitting(true);
      await doctorOnboardingApi.submitForVerification();
      toast.success("Profile submitted successfully!");
      
      // Update local state to trigger ProtectedRoute logic
      dispatch(setOnboardingStatus("SUBMITTED"));
      
      // Force navigation to the pending page
      navigate(ROUTES.DOCTOR_PENDING, { replace: true });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Review & Submit</h2>

      <button
        onClick={submit}
        disabled={isSubmitting}
        className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
          isSubmitting 
            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit for Verification"
        )}
      </button>
    </div>
  );
}
