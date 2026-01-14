interface DoctorReviewSubmitProps {
  userId: string;
}

import { useState } from "react";
import { doctorOnboardingApi } from "../../api/doctorOnboardingApi";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/auth/authSlice";

export default function DoctorReviewSubmit({ userId }: DoctorReviewSubmitProps) {
  const user = useAppSelector(selectCurrentUser);
  const [message, setMessage] = useState("");

  const submit = async () => {
    if (!user?.id) {
      alert("User not found");
      return;
    }

    await doctorOnboardingApi.submitForVerification(userId);

    setMessage(
      "Your profile has been submitted successfully! You will be notified once the admin reviews and approves your verification."
    );
  };

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Review & Submit</h2>

      <button
        onClick={submit}
        className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
      >
        Submit for Verification
      </button>

      {message && (
        <p className="mt-4 text-green-700 font-semibold">
          {message}
        </p>
      )}
    </div>
  );
}
