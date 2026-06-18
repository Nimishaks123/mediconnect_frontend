import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchVerifiedDoctors } from "../store/appointments/appointmentThunks";
import SpecialistsList from "../components/dashboard/SpecialistsList";
import { getDoctorSpecialties } from "../api/doctors";
import { socketService } from "../services/socketService";

export default function DoctorListPage() {
  const dispatch = useAppDispatch();

  const [page, setPage] = useState(1);
  const [specialty, setSpecialty] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [experience, setExperience] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);

  const {
    doctors,
    loading,
    error,
    total,
  } = useAppSelector(
    (state) => state.appointments
  );

  const PAGE_SIZE = 2;

  // Fetch doctors
  useEffect(() => {
    dispatch(
      fetchVerifiedDoctors({
        page,
        limit: PAGE_SIZE,
        specialty,
        experience,
        sortBy
      })
    );
  }, [
    dispatch,
    page,
    specialty,
    experience,
    sortBy
  ]);

  // Listen for doctor block/unblock events
  useEffect(() => {
    const socket =
      socketService.getSocket();

    if (!socket) return;

    const handleBlockStatusChange = (
      data: {
        userId: string;
        role: string;
        blocked: boolean;
      }
    ) => {
      console.log(
        "BLOCK STATUS EVENT",
        data
      );

      if (
        data.role === "DOCTOR"
      ) {
        dispatch(
          fetchVerifiedDoctors({
            page,
            limit: PAGE_SIZE,
            specialty,
            experience,
            sortBy
          })
        );
      }
    };

    socket.on(
      "user_block_status_changed",
      handleBlockStatusChange
    );

    return () => {
      socket.off(
        "user_block_status_changed",
        handleBlockStatusChange
      );
    };
  }, [
    dispatch,
    page,
    specialty,
    experience,
    sortBy
  ]);

  // Fetch specialties
  useEffect(() => {
    const loadSpecialties =
      async () => {
        try {
          const response =
            await getDoctorSpecialties();

          setSpecialties(
            response.data
          );
        } catch (error) {
          console.error(
            "Failed to load specialties",
            error
          );
        }
      };

    loadSpecialties();
  }, []);

  console.log(
    "Current Page:",
    page
  );
  console.log(
    "Total:",
    total
  );
  console.log(
    "Doctors:",
    doctors.length
  );

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

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      {/* <h2 className="text-2xl font-semibold">
        Available Doctors
      </h2> */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
  <h2 className="text-2xl font-semibold">
    Available Doctors
  </h2>

  <select
    value={sortBy}
    onChange={(e) => {
      setSortBy(e.target.value);
      setPage(1);
    }}
    className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-sm"
  >
    <option value="">Newest First</option>

    <option value="oldest">
      Oldest First
    </option>

    <option value="experience_desc">
      Experience (High → Low)
    </option>

    <option value="experience_asc">
      Experience (Low → High)
    </option>

    <option value="fee_desc">
      Consultation Fee (High → Low)
    </option>

    <option value="fee_asc">
      Consultation Fee (Low → High)
    </option>

    <option value="name_asc">
      Name (A → Z)
    </option>

    <option value="name_desc">
      Name (Z → A)
    </option>
  </select>
</div>
 <SpecialistsList
  doctors={doctors}
  loading={loading}
  specialties={specialties}
  selectedSpecialty={specialty}
  onSpecialtyChange={setSpecialty}
  selectedExperience={experience}
  onExperienceChange={setExperience}
  currentPage={page}
  total={total}
  onPageChange={setPage}
/>
    </div>
  );
}