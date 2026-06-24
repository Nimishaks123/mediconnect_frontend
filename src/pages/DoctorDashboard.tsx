import StatCard from "../components/doctor/dashboard/StatCard";
import AppointmentsList from "../components/doctor/dashboard/AppointmentsList";
import InfoCard from "../components/doctor/dashboard/InfoCard";

export default function DoctorDashboard() {
  return (
    <>
  {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <StatCard label="Total Revenue" value="850000" icon="💰" />
          <StatCard label="New Patients" value={76} icon="🧑‍⚕️" />
          <StatCard label="Appointments" value={50} icon="📅" />
        </div>

        {/* Chart placeholder */}
        <div className="bg-white rounded-xl p-6 shadow mb-8 h-64 flex items-center justify-center text-gray-400">
          📈 Statistics Chart (Recharts / Chart.js)
        </div>

        {/* Bottom section */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <AppointmentsList />
          </div>
          <InfoCard />
        </div>
  
    </>
  );
}
