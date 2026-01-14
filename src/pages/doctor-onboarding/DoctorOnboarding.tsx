
import { useState, useEffect } from "react";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/auth/authSlice";
import { doctorOnboardingApi } from "../../api/doctorOnboardingApi";

import DoctorBasicInfoForm from "./DoctorBasicInfoForm";
import DoctorDocumentsForm from "../../components/doctor/doctor-onboarding/DoctorDocumentsForm";
import DoctorReviewSubmit from "./DoctorReviewSubmit";

export default function DoctorOnboarding() {
  const currentUser = useAppSelector(selectCurrentUser);

  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const init = async () => {
  //     if (!currentUser?.id) {
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       await doctorOnboardingApi.startOnboarding();
  //       const res = await doctorOnboardingApi.getProfile(currentUser.id);

  //       const id =
  //         res?.data?.doctor?.doctor?.userId || res?.data?.doctor?.userId;

  //       if (!id) throw new Error("Doctor ID missing");

  //       setDoctorId(id);
  //       setStep(1);
  //     } catch (err) {
  //       console.error("Onboarding init error", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   init();
  // }, [currentUser]);
  useEffect(() => {
  const init = async () => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ Ensure doctor exists (idempotent)
      const startRes = await doctorOnboardingApi.startOnboarding();
      const doctor = startRes.data.doctor;

      setDoctorId(doctor.userId);

      switch (doctor.onboardingStatus) {
        case "BASIC_INFO":
          setStep(1);
          break;

        case "DOCUMENTS_PENDING":
          setStep(2);
          break;

        case "SUBMITTED":
        case "APPROVED":
        case "REJECTED":
          setStep(3);
          break;

        default:
          setStep(1);
      }
    } catch (err) {
      console.error("Onboarding init error", err);
    } finally {
      setLoading(false);
    }
  };

  init();
}, [currentUser]);



  if (loading) return <p>Loading…</p>;
  if (!doctorId) return <p>Error: Doctor ID missing.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {step === 1 && (
        <DoctorBasicInfoForm userId={doctorId} onNext={() => setStep(2)} />
      )}

      {step === 2 && (
        <DoctorDocumentsForm userId={doctorId} onNext={() => setStep(3)} />
      )}

      {step === 3 && <DoctorReviewSubmit userId={doctorId} />}
    </div>
  );
}
