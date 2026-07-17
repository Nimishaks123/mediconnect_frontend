import React, {
  useState,
  useEffect,
} from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";


import {
  useAppSelector,
  useAppDispatch,
} from "../../store/hooks";

import {
  selectAuth,
  logout,
} from "../../store/auth/authSlice";

import {
  ROUTES,
} from "../../constants/routes";

import NotificationBell
from "../NotificationBell";

import {
  ChevronDown,
} from "lucide-react";

const DashboardHeader: React.FC = () => {

  const navigate = useNavigate();

  const location = useLocation();

  const dispatch = useAppDispatch();

  const { user } =
    useAppSelector(selectAuth);

  const [menuOpen, setMenuOpen] =
    useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {

    dispatch(logout());

    navigate("/login", {
      replace: true,
    });

  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 h-[72px] px-6 flex items-center justify-between">

      {/* LEFT SIDE */}
      <div
        onClick={() =>
          navigate(
            ROUTES.USER_DASHBOARD
          )
        }
        className="flex items-center gap-3 cursor-pointer"
      >

      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-5">

        {/* Notification Bell */}
        <NotificationBell />

        {/* User Menu */}
        <div className="relative">

          <button
            onClick={() =>
              setMenuOpen((p) => !p)
            }
            className="flex items-center gap-3 rounded-full border border-gray-200 px-3 py-1.5 hover:shadow-sm transition-all"
          >

            <div className="h-10 w-10 rounded-full bg-mediconnect-green text-white flex items-center justify-center font-semibold">
              {
                (
                  user?.name ||
                  user?.email ||
                  "U"
                )[0].toUpperCase()
              }
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-800">
                {user?.name ||
                  user?.email}
              </p>

              <p className="text-xs text-gray-500">
                Patient
              </p>
            </div>

            <ChevronDown className="w-4 h-4 text-gray-500" />

          </button>

          {/* DROPDOWN */}
          {menuOpen && (

            <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 overflow-hidden">

              <button
                onClick={() => {
                  navigate(
                    ROUTES.PATIENT_PROFILE
                  );

                  setMenuOpen(false);
                }}
                className="w-full px-5 py-3 text-left hover:bg-gray-50"
              >
                My Profile
              </button>

              <button
                onClick={() => {
                  navigate(
                    ROUTES.PATIENT_APPOINTMENTS
                  );

                  setMenuOpen(false);
                }}
                className="w-full px-5 py-3 text-left hover:bg-gray-50"
              >
                My Appointments
              </button>

              <button
                onClick={() => {
                  navigate(
                    ROUTES.PATIENT_WALLET
                  );

                  setMenuOpen(false);
                }}
                className="w-full px-5 py-3 text-left hover:bg-gray-50"
              >
                My Wallet
              </button>

              <hr className="my-2" />

              <button
                onClick={handleLogout}
                className="w-full px-5 py-3 text-left text-red-500 hover:bg-red-50"
              >
                Logout
              </button>

            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;