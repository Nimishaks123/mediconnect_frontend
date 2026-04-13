import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";

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
    dispatch(fetchVerifiedDoctors());
  }, [dispatch]);

  return (
    <div className="space-y-8">
      <DashboardHeader />
      <ActionButtons actions={actions} />

      <SpecialistsList
        doctors={doctors}
        loading={loading}
      />
    </div>
  );
};

export default UserDashboard;