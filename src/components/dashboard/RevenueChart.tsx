import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { getRevenueTrend } from "../../api/adminDashboardApi";
import type { RevenueTrendItem } from "../../types/adminDashboard";

export default function RevenueChart() {
  const [data, setData] =
    useState<RevenueTrendItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {

    const load = async () => {

      try {

        setLoading(true);

        const trend = await getRevenueTrend();

        setData(trend);

      } catch (err) {

        console.error(err);

        setError("Failed to load revenue trend.");

        toast.error("Failed to load revenue trend.");

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

        <h2 className="font-bold text-red-600">
          {error}
        </h2>

      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Revenue Trend
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${v.toLocaleString()}`}
          />

          <Tooltip
           formatter={(value) => [
  `₹${Number(value ?? 0)}`,
  "Revenue",
]}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />

          <Bar
            dataKey="revenue"
            fill="#0ea5e9"
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}
