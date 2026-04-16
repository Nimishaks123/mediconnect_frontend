import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyAppointments } from "../api/patientAppointments";
import doctorPlaceholder from "../assets/default-doctor.jpeg";

type Appointment = {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  status: "CONFIRMED" | "PAYMENT_PENDING" | "CANCELLED" | "RESCHEDULED";
  paymentStatus: "SUCCESS" | "PENDING" | "FAILED" | "REFUNDED";
  refundAmount: number;
  cancellationCharge: number;
  doctor: {
    id: string;
    name: string;
    specialty: string;
    profilePhoto: string | null;
  } | null;
};

type TabType = "upcoming" | "past" | "cancelled" | "pending";

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split("T")[0];

  const fetchAppointments = () => {
    getMyAppointments()
      .then((data) => {
        setAppointments(data ?? []);
      })
      .catch(() => {
        setAppointments([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);



  const getFilteredAppointments = () => {
    switch (activeTab) {
      case "upcoming":
        return appointments.filter(
          (a) =>
            (a.status === "CONFIRMED" || a.status === "RESCHEDULED") &&
            a.date >= todayStr
        );
      case "past":
        return appointments.filter((a) => a.date < todayStr && a.status !== "CANCELLED");
      case "cancelled":
        return appointments.filter((a) => a.status === "CANCELLED");
      case "pending":
        return appointments.filter((a) => a.status === "PAYMENT_PENDING");
      default:
        return [];
    }
  };

  const filtered = getFilteredAppointments();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Appointments</h1>
        <p className="mt-2 text-gray-600">Track and manage your scheduled consultations.</p>
      </header>

      {/* TABS */}
      <nav className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8 overflow-x-auto no-scrollbar">
        {(["upcoming", "past", "cancelled", "pending"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 capitalize whitespace-nowrap ${activeTab === tab
                ? "bg-white text-sky-700 shadow-sm ring-1 ring-black/5"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* CONTENT */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl text-gray-400">📅</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No {activeTab} appointments</h3>
            <p className="text-gray-500 mt-1">When you book an appointment, it will appear here.</p>
          </div>
        ) : (
          filtered.map((appt) => {

            return (
              <div
                key={appt.id}
                onClick={() => navigate(`/appointments/${appt.id}`, { state: { appointment: appt } })}
                className="group cursor-pointer bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row sm:items-center gap-5"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative">
                    <img
                      src={appt.doctor?.profilePhoto ?? doctorPlaceholder}
                      alt={appt.doctor?.name ?? "Doctor"}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-gray-50"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${appt.status === "CONFIRMED" || appt.status === "RESCHEDULED" ? "bg-green-500" :
                        appt.status === "CANCELLED" ? "bg-red-500" : "bg-yellow-500"
                      }`} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-sky-600 transition-colors">
                        Dr. {appt.doctor?.name ?? "Unavailable"}
                      </h3>
                      {appt.paymentStatus === "SUCCESS" && appt.date >= todayStr && appt.status !== "CANCELLED" && (
                        <span className="text-xl" title="Video Call Available">📹</span>
                      )}
                    </div>
                    <p className="text-sm text-sky-600 font-medium bg-sky-50 inline-block px-2 py-0.5 rounded-md mt-1">
                      {appt.doctor?.specialty ?? "Medical Specialist"}
                    </p>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-3 text-sm text-gray-500 font-medium">
                      <span className="flex items-center gap-1.5">
                        <span className="text-base text-gray-400 font-normal">Date:</span> {new Date(appt.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1.5 border-l sm:pl-4 pl-0 border-gray-200">
                        <span className="text-base text-gray-400 font-normal">Time:</span> {appt.startTime} – {appt.endTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100 min-w-[140px]">
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${appt.status === "CONFIRMED"
                          ? "bg-green-100 text-green-700"
                          : appt.status === "RESCHEDULED"
                            ? "bg-blue-100 text-blue-700"
                            : appt.status === "PAYMENT_PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                    >
                      {appt.status}
                    </span>
                    {(appt.status === "CONFIRMED" || appt.status === "RESCHEDULED") && (
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           navigate(`/chat/${appt.id}`);
                         }}
                         className="w-full mt-2 px-4 py-2 bg-sky-50 text-sky-600 font-bold text-xs rounded-xl hover:bg-sky-600 hover:text-white transition-all flex items-center justify-center gap-2 border border-sky-100 shadow-sm"
                       >
                         💬 Chat
                       </button>
                    )}
                  </div>

                  <div className="flex flex-col items-end">
                    {appt.status === "CANCELLED" ? (
                      <>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Financial Detail</p>
                        {appt.refundAmount > 0 ? (
                          <div className="text-right">
                            <p className="text-xs font-bold text-blue-600">Refunded ₹{appt.refundAmount}</p>
                            {appt.cancellationCharge > 0 && <p className="text-[9px] text-gray-400 font-medium">Charge: ₹{appt.cancellationCharge}</p>}
                          </div>
                        ) : (
                          <p className="text-xs font-bold text-red-500">No Refund Issued</p>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Payment Status</p>
                        <p className={`text-xs font-bold ${appt.paymentStatus === "SUCCESS" ? "text-green-600" :
                            appt.paymentStatus === "PENDING" ? "text-amber-600" : "text-red-500"
                          }`}>
                          {appt.paymentStatus}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
