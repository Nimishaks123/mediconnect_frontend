import type { Doctor } from "../../../types/Doctor";

type Props = {
  doctor: Doctor;
  onSelect: (doctorId: string) => void;
};

export default function DoctorCard({ doctor, onSelect }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex gap-4">
      <img
        src={doctor.photo}
        alt={doctor.name}
        className="w-16 h-16 rounded-full object-cover"
      />

      <div className="flex-1">
        <h3 className="font-semibold text-lg">{doctor.name}</h3>
        <p className="text-sm text-gray-600">{doctor.specialty}</p>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {doctor.about}
        </p>
      </div>

      <button
        onClick={() => onSelect(doctor.id)}
        className="self-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Book
      </button>
    </div>
  );
}
