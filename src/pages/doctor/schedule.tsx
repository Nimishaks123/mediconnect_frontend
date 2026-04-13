import ScheduleForm from "../../components/doctor/ScheduleForm";
import { createDoctorSchedule } from "../../api/schedule";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { DoctorScheduleFormPayload } from "../../types/DoctorScheduleFormPayload";

export default function DoctorSchedulePage() {
  const navigate = useNavigate();

  const handleSubmit = async (form: DoctorScheduleFormPayload) => {
    try {
      await createDoctorSchedule({
        ...form,
        timezone: form.timezone ?? "Asia/Kolkata",
      });

      toast.success("Schedule saved successfully");
      navigate("/doctor/slots");
    } catch {
      toast.error("Failed to create schedule.");
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-xl bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-semibold mb-4 text-center">
          Manage Schedule
        </h1>

        <ScheduleForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
