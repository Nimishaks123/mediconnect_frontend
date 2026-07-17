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
import { getVerifiedDoctors } from "../api/doctors";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import type { Doctor } from "../types/Doctor";
import defaultDoctor from "../assets/default-doctor.jpeg";

const UserDashboard = () => {
    const navigate = useNavigate();
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

  const [recommendedDoctors, setRecommendedDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    fetchDashboardData();
    fetchRecommendedDoctors();
  }, [unreadCount]);

  const fetchRecommendedDoctors = async () => {
    try {
      const res = await getVerifiedDoctors({ limit: 4 });
      if (res.data && res.data.data && Array.isArray(res.data.data.doctors)) {
        setRecommendedDoctors(res.data.data.doctors as Doctor[]);
      } else if (res.data && Array.isArray(res.data.doctors)) {
        setRecommendedDoctors(res.data.doctors as Doctor[]);
      } else if (res.data && Array.isArray(res.data)) {
        setRecommendedDoctors(res.data as Doctor[]);
      }
    } catch (error) {
      console.error("Failed to fetch recommended doctors:", error);
    }
  };

  const fetchDashboardData =
    async () => {
      try {
   const appointments =
          await getMyAppointments();
          console.log(appointments)
 
    const today = new Date();
today.setHours(0, 0, 0, 0);

const upcomingAppointments =
  appointments
    .filter((appointment: any) => {
      const appointmentDate =
        new Date(appointment.date);

      appointmentDate.setHours(
        0,
        0,
        0,
        0
      );

      return (
        appointmentDate >= today &&
        appointment.status !== "CANCELLED"
      );
    })
    .sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );

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
        setDashboardData({
  appointments:
    upcomingAppointments,

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

        <div className="space-y-6">


        </div>

      </div>

      <div className="pt-8 border-t border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Recommended Doctors</h3>
        
        {recommendedDoctors.length === 0 ? (
          <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-xl border border-gray-100">
            <p>No recommended doctors available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedDoctors.map((doc, index) => (
              <div 
                key={index} 
                onClick={() => navigate(ROUTES.DOCTOR_DETAILS(doc.doctorId))}
                className="flex flex-col h-full text-center bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="relative inline-block mb-4">
                  <img
                    src={doc.profilePhoto || (doc as any).photo || defaultDoctor}
                    alt={doc.name || "Doctor"}
                    className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-mediconnect-green bg-gray-100"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{doc.name}</h3>
                <p className="text-mediconnect-green text-sm font-semibold mb-2">{doc.specialty}</p>
                
                {doc.experience > 0 && (
                  <p className="text-gray-500 text-xs mb-1">{doc.experience} Year{doc.experience > 1 ? 's' : ''} Experience</p>
                )}
                
                {doc.consultationFee > 0 && (
                  <p className="text-gray-700 font-medium text-xs mb-4">₹{doc.consultationFee} Consultation Fee</p>
                )}
                
                <div className="mt-auto pt-4">
                  <button 
                    className="w-full px-3 py-2 border-2 border-mediconnect-green text-mediconnect-green text-sm rounded-lg font-semibold group-hover:bg-mediconnect-green hover:bg-mediconnect-green hover:text-white transition-colors"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>

  </div>
);
};

export default UserDashboard;