import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDoctorAppointments } from "../../api/appointments";
import { toast } from "react-hot-toast";

type AppointmentForDoctor = {
  appointmentId: string;
  patientName: string;
  patientEmail?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  paymentStatus: string;
  videoCallAvailable: boolean;
};

type GroupedAppointments = {
  upcoming: AppointmentForDoctor[];
  past: AppointmentForDoctor[];
  recent: AppointmentForDoctor[];
};



export default function DoctorAppointmentsPage() {
  const [groupedAppointments, setGroupedAppointments] = useState<GroupedAppointments>({
    upcoming: [],
    past: [],
    recent: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<keyof GroupedAppointments>("upcoming");
  const navigate = useNavigate();

  const loadAppointments = async () => {
    try {
      const res = await getDoctorAppointments();
      console.log("Appointments API:", res);
      // Handle both structured { data: ... } and direct responses
      const data = res?.data || res;
      if (data && typeof data === 'object') {
        setGroupedAppointments({
          upcoming: data.upcoming || [],
          past: data.past || [],
          recent: data.recent || [],
        });
      }
    } catch (error) {
      console.error("Load Error:", error);
      toast.error("Failed to load your appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);



  const appointmentsToShow = groupedAppointments[activeTab];

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
       <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
       <p className="text-gray-500 font-medium">Synchronizing your schedule...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Patient Appointments</h1>
        <p className="mt-2 text-gray-600 font-medium">Manage your clinical schedule and daily patient consultations.</p>
      </header>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100/80 backdrop-blur-sm rounded-2xl mb-8 w-fit mx-auto md:mx-0 border border-gray-200">
        {(["upcoming", "past", "recent"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 capitalize
              ${activeTab === tab 
                ? "bg-white text-sky-600 shadow-sm border border-gray-200" 
                : "text-gray-500 hover:text-gray-900"
              }`}
          >
            {tab}
            {groupedAppointments[tab].length > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${
                activeTab === tab ? 'bg-sky-100 text-sky-600' : 'bg-gray-200 text-gray-600'
              }`}>
                {groupedAppointments[tab].length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {appointmentsToShow.length === 0 ? (
          <div className="bg-white p-20 rounded-3xl shadow-sm border border-gray-100 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
              {activeTab === 'upcoming' ? '📅' : activeTab === 'past' ? '📘' : '✨'}
            </div>
            <h3 className="text-xl font-bold text-gray-900">No {activeTab} appointments</h3>
            <p className="text-gray-500 mt-2">Your list is currently empty for this category.</p>
          </div>
        ) : (
          appointmentsToShow.map((app) => (
            <div 
              key={app.appointmentId} 
              onClick={() => navigate(`/doctor/appointments/${app.appointmentId}`, { state: { app } })}
              className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
                
                {/* ID Badge & Status */}
                <div className="flex flex-col items-center gap-2">
                   <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 font-bold text-xl ring-2 ring-sky-100 ring-offset-2">
                      {app.patientName.charAt(0)}
                   </div>
                   <div className="flex flex-col items-center gap-1">
                      <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded-md ${
                        app.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 
                        app.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {app.status}
                      </span>
                      {app.videoCallAvailable && (
                        <div className="flex items-center gap-1 text-[9px] text-sky-600 font-bold px-1.5 py-0.5 bg-sky-50 rounded-full border border-sky-100">
                          <span className="w-1 h-1 bg-sky-500 rounded-full animate-pulse"></span>
                          VIDEO READY
                        </div>
                      )}
                   </div>
                </div>

                {/* Patient Details */}
                <div className="flex-1 space-y-1">
                   <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold text-gray-900">{app.patientName}</h3>
                      <div className="flex gap-2">
                        {app.videoCallAvailable && (
                          <button 
                            className="p-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all hover:scale-110 shadow-lg shadow-sky-200"
                            title="Start Video Consultation"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Video logic here
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                              <path d="M240,128a15.89,15.89,0,0,1-8.15,13.93l-48,26.47A16,16,0,0,1,160,174.45V184a16,16,0,0,1-16,16H32a16,16,0,0,1-16-16V72A16,16,0,0,1,32,56H144a16,16,0,0,1,16,16V81.55a16,16,0,0,1,23.85-13.95l48,26.47A15.89,15.89,0,0,1,240,128Z"></path>
                            </svg>
                          </button>
                        )}
                        <button 
                          className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all hover:scale-110 shadow-lg shadow-emerald-200"
                          title="Open Patient Chat"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/chat/${app.appointmentId}`);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M216,48H40A16,16,0,0,0,24,64V224a15.84,15.84,0,0,0,9.25,14.5A15.48,15.48,0,0,0,40,240a15.87,15.87,0,0,0,10.16-3.71L84.8,208H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48Zm0,144H80a8,8,0,0,0-5.16,1.89L40,221.71V64H216V192ZM160,112a8,8,0,0,1-8,8H104a8,8,0,0,1,0-16h48A8,8,0,0,1,160,112Zm0,32a8,8,0,0,1-8,8H104a8,8,0,0,1,0-16h48A8,8,0,0,1,160,144Z"></path>
                          </svg>
                        </button>
                      </div>
                   </div>
                   <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-semibold items-center">
                      <span className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full">
                         <span className="text-lg">📅</span> {new Date(app.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full">
                         <span className="text-lg">🕒</span> {app.startTime} - {app.endTime}
                      </span>
                      <span className="flex items-center gap-2 text-[10px] text-gray-400 font-bold">
                        #{app.appointmentId.slice(-8).toUpperCase()}
                      </span>
                   </div>
                </div>

                  <div className="flex gap-3 w-full md:w-auto">
                    <div className="px-6 py-3 bg-gray-50 text-gray-500 font-bold rounded-2xl group-hover:bg-gray-100 transition-colors">
                      View Details &rarr;
                    </div>
                  </div>
                </div>
              </div>
          ))
        )}
      </div>
    </div>
  );
}
