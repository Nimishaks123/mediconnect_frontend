import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchVerifiedDoctors } from "../store/appointments/appointmentThunks";
import DoctorCard from "../components/doctor/dashboard/DoctorCard";
import { useNavigate } from "react-router-dom";


export default function DoctorListPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { doctors, loading, error } = useAppSelector(
    (state) => state.appointments
  );

  useEffect(() => {
    dispatch(fetchVerifiedDoctors());
  }, [dispatch]);

  const handleSelectDoctor = (doctorId: string) => {
    navigate(`/doctors/${doctorId}/availability`);
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Loading doctors...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 mt-10">
        {error}
      </p>
    );
  }

  if (!doctors.length) {
    return (
      <p className="text-center text-gray-500 mt-10">
        No doctors available right now
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <h2 className="text-2xl font-semibold">
        Available Doctors
      </h2>

      <div className="grid gap-4">
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            onSelect={handleSelectDoctor}
          />
        ))}
      </div>
    </div>
  );
}
