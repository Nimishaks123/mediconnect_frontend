import React from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearIncomingCall, setCallStatus } from "../../store/call/callSlice";
import { socketService } from "../../services/socketService";
import { useNavigate } from "react-router-dom";
import { PhoneIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { selectCurrentUser } from "../../store/auth/authSlice";

const IncomingCallModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const { incomingCall } = useAppSelector((state) => state.call);

  if (incomingCall) {
    console.log("[IncomingCallModal] Active invite received:", incomingCall);
  }

  if (!incomingCall) return null;

  const handleAccept = () => {
    if (!user) return;
    socketService.emitAcceptCall(incomingCall.appointmentId, user.id);
    dispatch(clearIncomingCall());
    dispatch(setCallStatus("ongoing"));
    navigate(`/call/${incomingCall.appointmentId}`);
  };

  const handleReject = () => {
    socketService.emitRejectCall(incomingCall.appointmentId);
    dispatch(clearIncomingCall());
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl w-full max-w-sm border border-gray-100 transform animate-in slide-in-from-bottom-10 duration-500">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 bg-mediconnect-green rounded-full flex items-center justify-center animate-bounce shadow-xl shadow-mediconnect-green/30">
              <PhoneIcon className="w-12 h-12 text-white animate-pulse" />
            </div>
            <div className="absolute -inset-4 border-4 border-mediconnect-green/20 rounded-full animate-ping pointer-events-none" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest italic">{incomingCall.callerName}</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Incoming Video Consultation...</p>
          </div>

          <div className="flex gap-4 w-full">
            <button
              onClick={handleReject}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gray-50 text-gray-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all active:scale-95 group"
            >
              <XMarkIcon className="w-4 h-4" />
              Reject
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-mediconnect-green text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-mediconnect-green/30 hover:scale-105 active:scale-95 transition-all"
            >
              <PhoneIcon className="w-4 h-4" />
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
