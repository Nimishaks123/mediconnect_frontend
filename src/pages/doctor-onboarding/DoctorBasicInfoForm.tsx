import DoctorBasicInfoForm from "../../components/doctor/doctor-onboarding/DoctorBasicInfoForm"
interface Props {
  userId: string;
  onNext: () => void;
}

export default function DoctorBasicInfoPage({
  userId,
  onNext,
}: Props) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">
        Doctor Onboarding – Step 1
      </h1>
      <p className="text-gray-600 mb-6">
        Basic Professional Information
      </p>

      <DoctorBasicInfoForm
        userId={userId}
        onSuccess={onNext}
      />
    </div>
  );
}
