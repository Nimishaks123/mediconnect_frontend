import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import {
  Users,
  UserCheck,
  CalendarDays,
  IndianRupee,
  Wallet,
  Clock,
} from "lucide-react";

import DashboardStatCard from "./DashboardStatCard";

import { getDashboardOverview } from "../../api/adminDashboardApi";

import type{ DashboardOverview as DashboardOverviewType } from "../../types/adminDashboard";

export default function DashboardOverview() {
  const [overview, setOverview] =
    useState<DashboardOverviewType | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {

    const loadDashboard =
      async () => {

        try {

          setLoading(true);

          const data =
            await getDashboardOverview();

          setOverview(data);

        } catch (err) {

          console.error(err);

          setError(
            "Failed to load dashboard."
          );

          toast.error(
            "Failed to load dashboard."
          );

        } finally {

          setLoading(false);

        }
      };

    loadDashboard();

  }, []);

  if (loading) {

    return (
      <div className="flex justify-center items-center h-64">

        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>

      </div>
    );
  }

  if (error || !overview) {

    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">

        <h2 className="font-bold text-red-600">
          {error}
        </h2>

      </div>
    );
  }

  return (

    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

      <DashboardStatCard
        title="Total Revenue"
        value={`₹${overview.totalRevenue.toLocaleString()}`}
        icon={<IndianRupee size={22} />}
        iconBg="bg-green-100 text-green-600"
      />

      <DashboardStatCard
        title="Platform Revenue"
        value={`₹${overview.platformRevenue.toLocaleString()}`}
        icon={<Wallet size={22} />}
        iconBg="bg-sky-100 text-sky-600"
      />

      <DashboardStatCard
        title="Patients"
        value={overview.totalPatients}
        icon={<Users size={22} />}
        iconBg="bg-orange-100 text-orange-600"
      />

      <DashboardStatCard
        title="Doctors"
        value={overview.totalDoctors}
        icon={<UserCheck size={22} />}
        iconBg="bg-purple-100 text-purple-600"
      />

      <DashboardStatCard
        title="Appointments"
        value={overview.totalAppointments}
        icon={<CalendarDays size={22} />}
        iconBg="bg-indigo-100 text-indigo-600"
      />

      <DashboardStatCard
        title="Today's Appointments"
        value={overview.todayAppointments}
        icon={<Clock size={22} />}
        iconBg="bg-yellow-100 text-yellow-600"
      />

    </section>
  );
}