import { NavLink } from "react-router-dom";
import SignupImage from "../../../assets/image 16.png";

import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  Clock3,
  Users,
  Wallet,
  Star,
  UserRound,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {
  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/doctor",
      end: true,
    },
    {
      label: "Appointments",
      icon: CalendarCheck,
      path: "/doctor/appointments",
    },
    {
      label: "Manage Schedule",
      icon: CalendarDays,
      path: "/doctor/schedule",
    },
    {
      label: "Slots",
      icon: Clock3,
      path: "/doctor/slots",
    },
    // {
    //   label: "Patients",
    //   icon: Users,
    //   path: "/doctor/patients",
    // },
    {
      label: "Wallet",
      icon: Wallet,
      path: "/doctor/wallet",
    },
    {
      label: "Reviews",
      icon: Star,
      path: "/doctor/reviews",
    },
    {
      label: "Profile",
      icon: UserRound,
      path: "/doctor/profile",
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-100 shadow-sm flex flex-col">

      {/* Logo */}

      <div className="px-6 py-8 border-b border-gray-100">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center">

            <img
              src={SignupImage}
              alt="MediConnect"
              className="w-8 h-8 object-contain"
            />

          </div>

          <div>

            <h2 className="text-lg font-bold text-gray-900">
              MediConnect
            </h2>

            <p className="text-sm text-gray-500">
              Doctor Portal
            </p>

          </div>

        </div>

      </div>

      {/* Navigation */}

      <nav className="flex-1 px-4 py-6 space-y-2">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-sky-50 text-sky-700 border border-sky-100 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-sky-700"
                }`
              }
            >
              <div className="flex items-center gap-3">

                <Icon
                  className="w-5 h-5"
                  strokeWidth={2}
                />

                <span className="text-sm font-medium">
                  {item.label}
                </span>

              </div>

              <ChevronRight
                className="w-4 h-4 opacity-0 group-hover:opacity-100 transition"
              />

            </NavLink>
          );
        })}

      </nav>

      {/* Footer */}

      <div className="px-6 py-5 border-t border-gray-100">

        <div className="rounded-xl bg-sky-50 p-4">

          <p className="text-sm font-semibold text-sky-700">
            MediConnect
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Healthcare Management System
          </p>

        </div>

      </div>

    </aside>
  );
}