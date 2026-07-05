import DashboardHeader from "../components/doctor/dashboard/DashboardHeader";
import StatsCards from "../components/doctor/dashboard/StatsCards";
import AppointmentsList from "../components/doctor/dashboard/AppointmentsList";
import QuickActions from "../components/doctor/dashboard/QuickActions";
import TodaySchedule from "../components/doctor/dashboard/TodaySchedule";
import RecentActivity from "../components/doctor/dashboard/RecentActivity";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchNotifications } from "../store/notification/notificationSlice";

import {
  selectUnreadNotificationCount,
} from "../store/notification/notificationSelectors";
import { fetchDoctorAppointments } from "../store/doctor/doctorAppointments/doctorAppointmentThunks";

import {
  selectUpcomingAppointments,
} from "../store/doctor/doctorAppointments/doctorAppointmentSelectors";

export default function DoctorDashboard() {
  const dispatch = useAppDispatch();

const appointments =
useAppSelector(
    selectUpcomingAppointments
);
const unreadNotifications = useAppSelector(
  selectUnreadNotificationCount
);

console.log("Upcoming Appointments:", appointments);
useEffect(() => {
  dispatch(fetchDoctorAppointments());
   dispatch(fetchNotifications(1));
}, [dispatch]);
  return (
    <>
      {/* Header */}
      <DashboardHeader doctorName="Neha" />

      {/* Statistics */}
      <div className="mt-6">
        <StatsCards
          stats={{
            appointments: appointments.length,
            walletBalance: 0,
            unreadMessages: unreadNotifications,
            prescriptions: 16,
          }}
        />
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6 items-start">

        {/* Appointments */}
        <div className="xl:col-span-2">
          <AppointmentsList
  appointments={appointments}
/>
        </div>

        {/* Quick Actions */}
        <QuickActions />

      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">

        <TodaySchedule appointments={appointments}/>

        <RecentActivity />

      </div>
    </>
  );
}