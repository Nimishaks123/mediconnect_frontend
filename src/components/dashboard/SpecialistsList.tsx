import type { Doctor } from "../../types/Doctor";

type Props = {
  doctors: Doctor[];
  loading?: boolean;
};

export default function SpecialistsList({ doctors, loading }: Props) {
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
      {doctors.map((doc, index) => (
        
        <div
          key={doc.id ?? `doctor-${index}`}
          className="bg-white p-4 rounded-lg shadow"
        >
      
          <img
  src={doc.photo}
  alt={doc.name}
  className="w-16 h-16 rounded-full object-cover"
  key={doc.photo}
  onError={(e) => {
    e.currentTarget.src =
      "https://ui-avatars.com/api/?name=Doctor&background=0D8ABC&color=fff";
  }}
/>

          <h3 className="font-semibold">{doc.name}</h3>
          <p>{doc.specialty}</p>
        </div>
      ))}
   </div>
  );
}
