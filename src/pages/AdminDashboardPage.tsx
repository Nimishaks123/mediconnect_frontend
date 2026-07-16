import DashboardOverview from "../components/dashboard/DashboardOverview";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 p-6">

      <div>

        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Monitor platform activity and key statistics.
        </p>

      </div>

      <DashboardOverview />

    </div>
  );
}