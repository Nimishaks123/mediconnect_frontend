import { Bell } from "lucide-react";
import { NavLink } from "react-router-dom";

const DashboardNavbar = () => {
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <h1 className="text-2xl font-bold text-blue-600">
            MediConnect
          </h1>

          <nav className="flex items-center gap-6 text-sm font-medium">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/find-doctors">Find Doctors</NavLink>
            <NavLink to="/appointments">Appointments</NavLink>
            <NavLink to="/messages">Messages</NavLink>
            <NavLink to="/wallet">Wallet</NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-5">
          <Bell className="w-5 h-5 text-gray-600" />

          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/100"
              alt="profile"
              className="w-10 h-10 rounded-full"
            />

            <div>
              <p className="font-semibold text-sm">Nimisha S</p>
              <p className="text-xs text-gray-500">Patient ID: MC-2849</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;