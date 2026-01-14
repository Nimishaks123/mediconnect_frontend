
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import ActionButtons from "../components/dashboard/ActionButtons";
import SpecialistsList from "../components/dashboard/SpecialistsList";

import  {fetchVerifiedDoctors}  from "../store/doctor/doctorSlice";

const actions = [
  { label: "Find Doctor", icon: "🩺", active: true },
  { label: "Appointments", icon: "📅" },
  { label: "Upload", icon: "⬆️" },
  { label: "Wallet", icon: "💳" },
  { label: "Messages", icon: "💬" },
  { label: "Prescription", icon: "📄" },
];

const UserDashboard = () => {
  const dispatch = useAppDispatch();
  const { doctors, loading } = useAppSelector((state) => state.doctor);

  useEffect(() => {
      console.log("Dispatching fetchVerifiedDoctors");
    dispatch(fetchVerifiedDoctors());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-gray-900">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        <DashboardHeader />
        <ActionButtons actions={actions} />

        <SpecialistsList
          doctors={doctors}
          loading={loading}
        />
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
