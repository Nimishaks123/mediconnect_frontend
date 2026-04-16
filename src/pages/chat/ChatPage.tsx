import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/auth/authSlice";
import ChatBox from "../../components/chat/ChatBox";
import { ChevronLeftIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { ROLES } from "../../constants/roles";
import ConversationSidebar from "../../components/chat/ConversationSidebar";
import { getDoctorAppointments } from "../../api/appointments";
import { getMyAppointments } from "../../api/patientAppointments";

export default function ChatPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const [recipient, setRecipient] = useState<{ id: string; name: string } | null>(null);
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      if (!conversationId || !user) return;
      
      try {
        setLoading(true);
        let foundApp: any = null;

        if (user.role === ROLES.PATIENT) {
          const apps = await getMyAppointments();
          // The patient API returns { success: true, data: [...] }
          const appList = apps?.data || apps || [];
          foundApp = appList.find((a: any) => a.id === conversationId);
          
          if (foundApp && foundApp.doctor) {
            setRecipient({
              id: foundApp.doctor.userId,
              name: foundApp.doctor.name.startsWith("Dr.") ? foundApp.doctor.name : `Dr. ${foundApp.doctor.name}`
            });
          }
        } else if (user.role === ROLES.DOCTOR) {
          const response = await getDoctorAppointments();
          // The doctor API now returns { upcoming, past, recent } directly
          const data = response?.data || response;
          const allApps = [
            ...(data?.upcoming || []),
            ...(data?.past || []),
            ...(data?.recent || [])
          ];
          
          console.log("[ChatPage] All Appointments for Doctor:", allApps);
          foundApp = allApps.find((a: any) => a.appointmentId === conversationId);
          if (foundApp) {
             setRecipient({
                id: foundApp.patientId,
                name: foundApp.patientName || "Patient"
             });
          }
        }
        setAppointment(foundApp);
      } catch (err) {
        console.error("[ChatPage] Failure loading chat context", err);
      } finally {
        setLoading(false);
      }
    };

    if (conversationId) fetchInfo();
    else {
      setRecipient(null);
      setAppointment(null);
    }
  }, [conversationId, user]);

  if (loading && conversationId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-mediconnect-green/20 border-t-mediconnect-green rounded-full animate-spin mb-4" />
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic animate-pulse">Establishing Secure Connection...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full flex flex-col gap-6">
        <div className="flex items-center justify-between px-2">
           <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-500 hover:text-sky-500 transition-colors font-black text-[10px] uppercase tracking-[0.2em] group"
            >
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm border border-gray-100 group-hover:border-sky-100 transition-all">
                <ChevronLeftIcon className="w-4 h-4" />
              </div>
              Back to Dashboard
            </button>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">End-to-End Encrypted</span>
            </div>
        </div>

        <div className="flex bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden h-[600px] animate-in slide-in-from-bottom-5 duration-700">
           <ConversationSidebar />
           
           <div className="flex-1 bg-white relative flex flex-col">
              {recipient ? (
                <div className="flex-1 h-full -mt-8">
                  <ChatBox 
                    receiverId={recipient.id}
                    receiverName={recipient.name}
                    conversationId={conversationId!}
                    appointment={appointment ? {
                      date: appointment.date,
                      startTime: appointment.startTime,
                      endTime: appointment.endTime
                    } : undefined}
                  />
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                    <ChatBubbleLeftRightIcon className="w-10 h-10 text-gray-200" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Select a Consultation</h2>
                    <p className="text-[10px] text-gray-400 font-bold max-w-[250px] mx-auto leading-relaxed">Choose a chat from the sidebar to view messages and history.</p>
                  </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
