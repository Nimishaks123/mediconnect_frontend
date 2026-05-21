import { useState, useEffect } from "react";

import { useAppSelector }
from "../store/hooks";

import WelcomeSection from "../components/dashboard/WelcomeSection";

import StatsCards from "../components/dashboard/StatCards";

import UpcomingAppointment from "../components/dashboard/UpcomingAppointment";

import {
  getMyAppointments,
  getMyWallet,
} from "../api/patientAppointments";

const UserDashboard = () => {
    const unreadCount =
    useAppSelector(
      (state) =>
        state.notifications.unreadCount
    );
  const [dashboardData, setDashboardData] =
    useState({
      appointments: [] as any[],

      wallet: null as any,

      stats: {
        appointments: 0,

        walletBalance: 0,

        unreadMessages: 0,

        prescriptions: 0,
      },
    });

  useEffect(() => {
    fetchDashboardData();
  }, [unreadCount]);

  const fetchDashboardData =
    async () => {
      try {
   const appointments =
          await getMyAppointments();
          console.log(appointments)

        const wallet =
          await getMyWallet();

        setDashboardData({
          appointments,

          wallet,

          stats: {
            appointments:
              appointments.length,

            walletBalance:
              wallet?.balance || 0,

            unreadMessages:
   unreadCount || 0,

            prescriptions: 0,
          },
        });
      } catch (error) {
        console.error(
          "Dashboard fetch error",
          error
        );
      }
    };

  return (
  <div className="min-h-screen">

    <div className="max-w-7xl mx-auto space-y-8">

      <WelcomeSection />

      <StatsCards
        stats={{
          ...dashboardData.stats,
          unreadMessages: unreadCount,
        }}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="xl:col-span-2">

          <UpcomingAppointment
            appointment={
              dashboardData.appointments[0]
            }
          />

        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">

          {/* Future widgets */}

          {/* Recent Activity */}
          {/* Health Summary */}
          {/* Quick Actions */}

        </div>

      </div>

    </div>

  </div>
);
};

export default UserDashboard;