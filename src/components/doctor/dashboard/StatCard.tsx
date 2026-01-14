// src/components/doctor/StatCard.tsx
interface Props {
  label: string;
  value: string | number;
  icon: string;
}

export default function StatCard({ label, value, icon }: Props) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow">
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
