import React from "react";
import SignupImage from "../../assets/image 16.png";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout, selectCurrentUser } from "../../store/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

export const AdminHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.ADMIN_LOGIN);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-8 py-5 flex items-center justify-between">
        
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-10 h-10 bg-mediconnect-green rounded-full flex items-center justify-center">
            <img
              src={SignupImage}
              alt="MediConnect Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
          <span className="text-mediconnect-green text-2xl font-bold">
            MediConnect
          </span>
        </div>

        <div className="text-gray-700">
          <p className="text-sm">Welcome back</p>
          <h1 className="text-xl font-semibold">{user?.name ?? "Admin"}</h1>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-full bg-mediconnect-green px-6 py-2 text-black font-semibold shadow hover:bg-emerald-600 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};
