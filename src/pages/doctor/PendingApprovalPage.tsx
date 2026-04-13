import React from "react";
import { Link } from "react-router-dom";
import { ClockIcon, UserCircleIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import { ROUTES } from "../../constants/routes";
import { useDispatch } from "react-redux";
import { logout } from "../../store/auth/authSlice";

export default function PendingApprovalPage() {
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
          <ClockIcon className="w-12 h-12 text-blue-500 animate-pulse" />
          <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">PROFILE UNDER REVIEW</h1>
          <p className="text-gray-500 leading-relaxed font-medium">
            Thank you for completing your professional profile! Our administrative team is currently verifying your credentials.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-100 text-blue-700 rounded-full text-xs font-black tracking-widest uppercase border border-blue-200">
           Status: PENDING VERIFICATION
        </div>

        <div className="grid grid-cols-1 gap-4 pt-4">
          <Link 
            to={ROUTES.DOCTOR_PROFILE} 
            className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-100 active:scale-95"
          >
            <UserCircleIcon className="w-5 h-5" />
            View/Update Profile
          </Link>
          
          <button 
            onClick={() => dispatch(logout() as any)}
            className="flex items-center justify-center gap-2 w-full py-4 bg-white border-2 border-blue-50 hover:bg-blue-50 text-blue-600 rounded-2xl font-bold transition-all active:scale-95"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            Logout
          </button>
        </div>

        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-4">
          Verification usually takes 24-48 hours
        </p>
      </div>
    </div>
  );
}
