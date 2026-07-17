import React, { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout, selectCurrentUser } from "../../store/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { BellIcon, UserCircleIcon, ChevronDownIcon, CalendarIcon } from "@heroicons/react/24/outline";

export const AdminHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.ADMIN_LOGIN);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-8 py-5 flex items-center justify-between">
        
        <div className="flex items-center gap-3 text-gray-500">
          <CalendarIcon className="w-5 h-5 text-mediconnect-green" />
          <span className="font-semibold text-sm tracking-wide">
            {currentDate}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-xl transition-colors border border-transparent hover:border-gray-100"
            >
              <div className="w-10 h-10 bg-mediconnect-green/10 text-mediconnect-green rounded-full flex items-center justify-center">
                <UserCircleIcon className="w-7 h-7" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-bold text-gray-900">{user?.name ?? "Administrator"}</p>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Admin</p>
              </div>
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in slide-in-from-top-2">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
