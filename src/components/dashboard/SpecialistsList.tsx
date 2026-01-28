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
      {doctors.map((doc) => (
        <div
          key={doc.id}
          className="bg-white p-4 rounded-lg shadow flex gap-4"
        >
          <img
            src={doc.photo}
            alt={doc.name}
            className="w-16 h-16 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://ui-avatars.com/api/?name=Doctor&background=0D8ABC&color=fff";
            }}
          />

          <div className="flex-1">
            <h3 className="font-semibold">{doc.name}</h3>
            <p className="text-sm text-gray-600">{doc.specialty}</p>

            <button
              onClick={() =>
                navigate(`/patient/appointments/${doc.id}`)
              }
              className="mt-3 text-sm bg-sky-600 text-white px-4 py-1.5 rounded hover:bg-sky-700"
            >
              Book Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
