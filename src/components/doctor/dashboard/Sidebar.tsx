import { NavLink } from "react-router-dom";
import SignupImage from "../../../assets/image 16.png";

export default function Sidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded-lg transition ${
      isActive
        ? "bg-white/20 font-semibold"
        : "opacity-80 hover:bg-white/10"
    }`;

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-sky-700 to-sky-800 text-white shadow-xl p-6">
      {/* BRAND */}
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <img
            src={SignupImage}
            alt="MediConnect"
            className="w-8 h-8 object-contain"
          />
        </div>

        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-wide">
            MediConnect
          </span>
          <span className="text-xs text-white/70">
            Doctor Dashboard
          </span>
        </div>
      </div>

      {/* NAVIGATION */}
     <nav className="space-y-2 text-base">
  <NavLink to="/doctor" end className={linkClass}>
    🏠 Dashboard
  </NavLink>

  <NavLink to="/doctor/appointments" className={linkClass}>
    📅 Appointments
  </NavLink>

  <NavLink to="/doctor/schedule" className={linkClass}>
    🗓 Manage Schedule
  </NavLink>

  <NavLink to="/doctor/slots" className={linkClass}>
    ⏱ View Slots
  </NavLink>

  <NavLink to="/doctor/patients" className={linkClass}>
    🧑‍🤝‍🧑 Patients
  </NavLink>

  <NavLink to="/doctor/wallet" className={linkClass}>
    💳 Wallet
  </NavLink>

  <NavLink to="/doctor/profile" className={linkClass}>
    👤 Profile
  </NavLink>
</nav>

    </aside>
  );
}
