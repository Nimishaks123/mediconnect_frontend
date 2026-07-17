import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import { getAppointmentStatusAnalytics } from "../../api/adminDashboardApi";
import type { AppointmentStatusAnalyticsItem } from "../../types/adminDashboard";

const COLORS = ["#0ea5e9", "#22c55e", "#eab308", "#ef4444", "#a855f7", "#64748b"];

export default function AppointmentStatusChart() {
  const [data, setData] = useState<AppointmentStatusAnalyticsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const analytics = await getAppointmentStatusAnalytics();
        setData(analytics);
      } catch (err) {
        console.error(err);
        setError("Failed to load appointment status analytics.");
        toast.error("Failed to load appointment status analytics.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
        <h2 className="font-bold text-red-600">{error}</h2>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Appointment Status
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
