import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getMyAppointments, cancelAppointment, checkoutAppointment } from "../api/patientAppointments";
import { toast } from "react-hot-toast";
import doctorPlaceholder from "../assets/default-doctor.jpeg";

interface Appointment {
  _id: string;
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  paymentStatus: string;
  price: number;
  refundAmount: number;
  cancellationCharge: number;
  doctor?: {
    id: string;
    userId: string;
    name: string;
    specialty: string;
    profilePhoto: string | null;
  };
}

export default function PatientAppointmentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [appointment, setAppointment] = useState<Appointment | null>(location.state?.appointment || null);
  const [loading, setLoading] = useState(!appointment);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (!appointment && id) {
      getMyAppointments()
        .then((data: Appointment[]) => {
          const found = data.find((a) => a._id === id || a.id === id);
          if (found) setAppointment(found);
          else {
            toast.error("Appointment not found");
            navigate("/patient/appointments");
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, appointment, navigate]);

  const handleCancel = () => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[280px]">
        <div>
          <h4 className="text-sm font-bold text-gray-900 leading-tight">Cancel Appointment?</h4>
          <p className="text-xs text-gray-500 mt-1">
            Are you sure you want to cancel? This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100"
          >
            Go Back
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              processCancellation();
            }}
            className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm shadow-red-100 transition-all border border-red-700"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      position: 'top-center',
    });
  };

  const processCancellation = async () => {
    if (!id) return;
    setCancellingId(id);
    try {
      const response = await cancelAppointment(id);
      toast.success(response.message || "Appointment cancelled successfully");
      setAppointment((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: "CANCELLED",
          paymentStatus: response.refundAmount > 0 ? "REFUNDED" : prev.paymentStatus,
          refundAmount: response.refundAmount,
          cancellationCharge: response.refundAmount > 0 ? (prev.price || 500) - response.refundAmount : 0
        };
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to cancel");
    } finally {
      setCancellingId(null);
    }
  };

  const proceedToPayment = async () => {
    if (!id) return;
    setCheckoutLoading(true);
    try {
      const res = await checkoutAppointment(id);
      if (res.checkoutUrl) window.location.href = res.checkoutUrl;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to initiate payment");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const canStartVideoCall = () => {
    if (!appointment) return false;
    if (appointment.status !== "CONFIRMED" && appointment.status !== "RESCHEDULED") return false;
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    if (appointment.date !== todayStr) return false;

    const [hours, minutes] = appointment.startTime.split(":").map(Number);
    const startMins = hours * 60 + minutes;
    
    const [endHours, endMinutes] = appointment.endTime.split(":").map(Number);
    const endMins = endHours * 60 + endMinutes;

    const currentMins = now.getHours() * 60 + now.getMinutes();
    return currentMins >= (startMins - 15) && currentMins <= endMins;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-sky-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!appointment) return null;

  const todayStr = new Date().toISOString().split("T")[0];
  const isFuture = appointment.date >= todayStr;
  const canCancel = isFuture && appointment.status !== "CANCELLED" && appointment.status !== "COMPLETED";

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <button 
        onClick={() => navigate("/patient/appointments")}
        className="mb-6 text-sky-600 font-bold flex items-center gap-2 hover:text-sky-800 transition-colors"
      >
        &larr; Back to Appointments
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Block */}
        <div className="bg-sky-50 p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 border-b border-sky-100">
          <img 
            src={appointment.doctor?.profilePhoto ?? doctorPlaceholder} 
            alt="Doctor" 
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
          />
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-extrabold text-gray-900">Dr. {appointment.doctor?.name ?? "Unavailable"}</h1>
            <p className="text-sky-700 font-medium inline-block px-3 py-1 bg-white rounded-full text-sm mt-2 shadow-sm">
              {appointment.doctor?.specialty ?? "Medical Specialist"}
            </p>
          </div>
          <div className="text-center sm:text-right">
             <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-black uppercase tracking-widest ${
               appointment.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
               appointment.status === "CANCELLED" ? "bg-red-100 text-red-700" :
               appointment.status === "PAYMENT_PENDING" ? "bg-yellow-100 text-yellow-700" :
               "bg-blue-100 text-blue-700"
             }`}>
               {appointment.status}
             </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <h3 className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-4">Schedule Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm font-semibold text-gray-600">Date</span>
                  <span className="text-sm font-black text-gray-900">
                    {new Date(appointment.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-600">Time</span>
                  <span className="text-sm font-black text-gray-900">{appointment.startTime} - {appointment.endTime}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <h3 className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-4">Payment Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm font-semibold text-gray-600">Status</span>
                  <span className={`text-sm font-black ${
                    appointment.paymentStatus === "SUCCESS" ? "text-green-600" :
                    appointment.paymentStatus === "REFUNDED" ? "text-blue-600" : "text-amber-600"
                  }`}>{appointment.paymentStatus}</span>
                </div>
                {appointment.paymentStatus === "REFUNDED" ? (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-600">Refund Amount</span>
                    <span className="text-sm font-black text-gray-900 flex items-center gap-1">
                      <span className="text-green-500">↑</span> ₹{appointment.refundAmount}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-600">Amount</span>
                    <span className="text-sm font-black text-gray-900">₹{appointment.price || "500"}</span>
                  </div>
                )}
              </div>

              {appointment.status === "PAYMENT_PENDING" && (
                <button
                  onClick={proceedToPayment}
                  disabled={checkoutLoading}
                  className="w-full mt-4 bg-sky-600 text-white font-bold py-3 rounded-xl hover:bg-sky-700 transition-colors shadow-md shadow-sky-200 border-b-4 border-sky-800 active:border-b-0 active:translate-y-1 block text-center"
                >
                  {checkoutLoading ? "Processing..." : "Proceed to Payment"}
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6 flex flex-col h-full">
            <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-2xl p-6 shadow-lg shadow-indigo-200 flex flex-col items-center justify-center text-center">
              <span className="text-4xl mb-3">📹</span>
              <h3 className="text-white font-bold text-lg mb-1">Teleconsultation</h3>
              <p className="text-indigo-200 text-sm mb-6 max-w-[200px]">
                {canStartVideoCall() 
                  ? "Your doctor is ready! Click below to join the call." 
                  : "The video call link will activate 15 minutes before your scheduled block."}
              </p>
              
              <button 
                disabled={!canStartVideoCall()}
                className={`w-full max-w-[200px] py-3 rounded-xl font-bold transition-all ${
                  canStartVideoCall() 
                    ? "bg-white text-indigo-700 hover:shadow-xl hover:scale-105 active:scale-95" 
                    : "bg-indigo-800 text-indigo-400 cursor-not-allowed border-2 border-indigo-600 border-dashed"
                }`}
              >
                {canStartVideoCall() ? "Join Video Call" : "Call Locked"}
              </button>
            </div>

            {appointment.doctor?.userId && (
              <button 
                onClick={() => navigate(`/chat/${appointment._id || appointment.id}`)}
                className="w-full py-4 bg-sky-50 text-sky-600 font-black uppercase text-xs tracking-widest rounded-2xl border-2 border-dashed border-sky-200 hover:bg-sky-600 hover:text-white hover:border-sky-600 hover:shadow-xl hover:shadow-sky-100 transition-all flex items-center justify-center gap-3 active:scale-95 group"
              >
                <span className="text-xl group-hover:animate-bounce">💬</span>
                Open Secure Consultation Chat
              </button>
            )}

            {canCancel && (
              <div className="bg-red-50 rounded-2xl border border-red-100 p-5">
                 <h3 className="text-[10px] uppercase tracking-widest font-black text-red-500 mb-2">Cancellation Policy</h3>
                 <ul className="text-xs text-red-700 space-y-1 mb-4 list-disc pl-4">
                   <li>If cancelled before 24 hours → <strong>Full refund</strong></li>
                   <li>If cancelled within 24 hours → <strong>No refund</strong></li>
                 </ul>
                 <button
                  onClick={handleCancel}
                  disabled={cancellingId !== null}
                  className="w-full bg-white border-2 border-red-200 text-red-600 font-bold py-3 rounded-xl hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  {cancellingId ? "Cancelling..." : "Cancel Appointment"}
                </button>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
