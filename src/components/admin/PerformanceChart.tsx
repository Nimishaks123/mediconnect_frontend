import { useMemo, useState } from "react";

type ChartPoint = {
  month: string;
  doctors: number;
  patients: number;
  highlight?: boolean;
};

const chartData: ChartPoint[] = [
  { month: "Jan", doctors: 25, patients: 10 },
  { month: "Feb", doctors: 45, patients: 30 },
  { month: "Mar", doctors: 70, patients: 40 },
  { month: "Apr", doctors: 35, patients: 25 },
  { month: "May", doctors: 50, patients: 30 },
  { month: "Jun", doctors: 65, patients: 55 },
  { month: "Jul", doctors: 90, patients: 60, highlight: true },
  { month: "Aug", doctors: 60, patients: 40 },
  { month: "Sep", doctors: 40, patients: 20 },
  { month: "Oct", doctors: 75, patients: 55 },
  { month: "Nov", doctors: 95, patients: 65 },
  { month: "Dec", doctors: 55, patients: 30 },
];

const rangeFilters = ["Weekly", "Monthly", "Yearly"] as const;

export const PerformanceChart = () => {
  const [range, setRange] =
    useState<(typeof rangeFilters)[number]>("Monthly");

  const maxValue = useMemo(
    () => Math.max(...chartData.flatMap((d) => [d.doctors, d.patients])),
    []
  );

  const buildAreaPath = (key: "doctors" | "patients") =>
    chartData
      .map((point, index) => {
        const x = (index / (chartData.length - 1)) * 100;
        const y = 100 - (point[key] / maxValue) * 90;
        return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ") + " L 100 100 L 0 100 Z";

  const buildLinePath = (key: "doctors" | "patients") =>
    chartData
      .map((point, index) => {
        const x = (index / (chartData.length - 1)) * 100;
        const y = 100 - (point[key] / maxValue) * 90;
        return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ");

  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Statics</h2>
          <p className="text-sm text-gray-500">
            Last 12 months performance overview
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-gradient-to-b from-violet-50 to-white p-6">
        <div className="relative h-72">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <path d={buildAreaPath("patients")} fill="rgba(16, 185, 129, 0.15)" />
            <path d={buildAreaPath("doctors")} fill="rgba(59, 130, 246, 0.15)" />

            <path d={buildLinePath("patients")} stroke="#10B981" strokeWidth={1.5} />
            <path d={buildLinePath("doctors")} stroke="#3B82F6" strokeWidth={1.5} />
          </svg>
        </div>

        <div className="flex gap-4 mt-6">
          {rangeFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setRange(filter)}
              className={`px-6 py-2 rounded-full font-semibold ${
                range === filter
                  ? "bg-mediconnect-green text-white"
                  : "bg-white text-gray-600 shadow"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
