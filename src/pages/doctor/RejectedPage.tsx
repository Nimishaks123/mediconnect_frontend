import React from "react";
import { Link } from "react-router-dom";
import { XCircleIcon, UserCircleIcon, ArrowLeftOnRectangleIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { ROUTES } from "../../constants/routes";
import { useDispatch } from "react-redux";
import { logout } from "../../store/auth/authSlice";

export default function RejectedPage() {
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-red-100 p-10 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
          <XCircleIcon className="w-16 h-16 text-red-500" />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">VERIFICATION REJECTED</h1>
          <p className="text-gray-500 leading-relaxed font-medium">
            Unfortunately, your profile verification was not successful. This usually happens due to incomplete documentation or incorrect registration details.
          </p>
        </div>

        <div className="p-6 bg-red-50 rounded-2xl border border-red-100 text-left">
           <h4 className="text-xs font-black text-red-900 uppercase tracking-widest flex items-center gap-2 mb-2">
             <ChatBubbleLeftRightIcon className="w-4 h-4" />
             Rejection Feedback
           </h4>
           <p className="text-sm text-red-700 font-bold italic leading-relaxed">
             "Please check your profile for specific feedback and re-upload clear certification documents."
           </p>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-4">
          <Link 
            to={ROUTES.DOCTOR_PROFILE} 
            className="flex items-center justify-center gap-2 w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-100 active:scale-95"
          >
            <UserCircleIcon className="w-5 h-5" />
            Update & Resubmit Profile
          </Link>
          
          <button 
            onClick={() => dispatch(logout() as any)}
            className="flex items-center justify-center gap-2 w-full py-4 bg-white border-2 border-gray-100 hover:bg-gray-50 text-gray-600 rounded-2xl font-bold transition-all active:scale-95"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            Logout
          </button>
        </div>

        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-4">
          Need help? contact support@mediconnect.com
        </p>
      </div>
    </div>
  );
}
