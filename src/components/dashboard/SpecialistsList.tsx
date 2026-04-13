import { useNavigate } from "react-router-dom";
import type { Doctor } from "../../types/Doctor";

type Props = {
  doctors: Doctor[];
  loading?: boolean;
};

export default function SpecialistsList({ doctors, loading }: Props) {
  const navigate = useNavigate();

  if (loading) {
    return <p className="text-center text-gray-500">Loading doctors...</p>;
  }

  if (!doctors.length) {
    return (
      <p className="text-center text-gray-500">
        No doctors available right now
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {doctors.map((doc) => {
        // 🛡️ Data Integrity: Ensure we have a valid identifier
        const docWithIds = doc as Doctor & { doctorId?: string };
        const dId = docWithIds.doctorId || docWithIds.id;
        
        if (!dId) return null;

        return (
          <div
            key={dId}
            className="bg-white p-4 rounded-lg shadow flex gap-4 transition-all hover:shadow-md"
          >
            <img
              src={doc.photo}
              alt={doc.name}
              className="w-16 h-16 rounded-full object-cover bg-gray-100"
              onError={(e) => {
                e.currentTarget.src =
                  "https://ui-avatars.com/api/?name=Doctor&background=0D8ABC&color=fff";
              }}
            />

            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{doc.name}</h3>
              <p className="text-sm text-gray-500">{doc.specialty}</p>

              <button
                onClick={() => {
                  if (dId) {
                    navigate(`/patient/appointments/${dId}`);
                  }
                }}
                className="mt-3 text-sm bg-sky-600 text-white px-4 py-1.5 rounded-lg font-medium hover:bg-sky-700 active:scale-95 transition-transform"
              >
                Book Now
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
