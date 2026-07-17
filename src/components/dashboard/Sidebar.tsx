import SignupImage
from "../../assets/image 16.png";
import {
  LayoutDashboard,
  Stethoscope,
  CalendarDays,
  Wallet,
  User,
  LogOut,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { ROUTES }
from "../../constants/routes";

import {
  useAppDispatch,
} from "../../store/hooks";

import {
  logout,
} from "../../store/auth/authSlice";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: ROUTES.USER_DASHBOARD,
  },

  {
    name: "Find Doctors",
    icon: Stethoscope,
    path: ROUTES.DOCTORS,
  },

  {
    name: "Appointments",
    icon: CalendarDays,
    path: ROUTES.PATIENT_APPOINTMENTS,
  },


  {
    name: "Wallet",
    icon: Wallet,
    path: ROUTES.PATIENT_WALLET,
  },

  {
    name: "Profile",
    icon: User,
    path: ROUTES.PATIENT_PROFILE,
  },
];

const Sidebar = () => {

  const dispatch =
    useAppDispatch();

  const navigate =
    useNavigate();

  const handleLogout = () => {

    dispatch(logout());

    navigate("/login", {
      replace: true,
    });

  };

  return (
    <aside className="w-[250px] min-h-screen bg-white border-r border-gray-200 px-6 py-8 flex flex-col justify-between shadow-sm">

      {/* TOP */}
      <div>

        {/* TITLE */}
        <div className="flex items-center gap-3 mb-12 px-2">
            <img
          src={SignupImage}
          alt="MediConnect"
          className="w-10 h-10 object-contain"
        />

        <div>
          <h1 className="text-xl font-bold text-mediconnect-green">
            MediConnect
          </h1>

          <p className="text-xs text-gray-500">
            Patient Portal
          </p>
        </div>

          {/* <p className="text-xs uppercase tracking-[0.3em] text-gray-400 font-semibold mb-2">
            Healthcare Platform
          </p>

          <h1 className="text-2xl font-bold text-blue-600">
            MediConnect
          </h1> */}

        </div>

        {/* MENU */}
        <nav className="space-y-2">

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? "bg-blue-500 text-white shadow-sm"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`
                }
              >

                <Icon className="w-5 h-5" />

                <span className="font-medium">
                  {item.name}
                </span>

              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-4 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all"
      >

        <LogOut className="w-5 h-5" />

        <span className="font-medium">
          Logout
        </span>

      </button>
    </aside>
  );
};

export default Sidebar;