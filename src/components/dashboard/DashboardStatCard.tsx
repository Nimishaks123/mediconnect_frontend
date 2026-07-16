type DashboardStatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
};

export default function DashboardStatCard({
  title,
  value,
  icon,
  iconBg,
}: DashboardStatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">

      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}
      >
        {icon}
      </div>

      <p className="mt-5 text-sm font-medium text-gray-500">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-bold text-gray-900">
        {value}
      </h2>

    </div>
  );
}