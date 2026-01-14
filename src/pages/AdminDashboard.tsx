import { AdminSidebar } from "../components/admin/AdminSidebar";
import { AdminHeader } from "../components/admin/AdminHeader";
import { StatCards } from "../components/admin/StatCards";
import { PerformanceChart } from "../components/admin/PerformanceChart";
import { TopDoctors } from "../components/admin/TopDoctors";
import { TopPatients } from "../components/admin/TopPatients";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
          <StatCards />
          <PerformanceChart />

          <section className="grid gap-6 lg:grid-cols-2">
            <TopDoctors />
            <TopPatients />
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;


