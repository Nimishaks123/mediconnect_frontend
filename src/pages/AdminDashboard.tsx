import { StatCards } from "../components/admin/StatCards";
import { PerformanceChart } from "../components/admin/PerformanceChart";
import { TopDoctors } from "../components/admin/TopDoctors";
import { TopPatients } from "../components/admin/TopPatients";

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <StatCards />
      <PerformanceChart />

      <section className="grid gap-6 lg:grid-cols-2">
        <TopDoctors />
        <TopPatients />
      </section>
    </div>
  );
};

export default AdminDashboard;
