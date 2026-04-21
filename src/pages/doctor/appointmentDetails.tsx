import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getDoctorAppointments, cancelDoctorAppointment, rescheduleDoctorAppointment } from "../../api/appointments";
import { api } from "../../api/api";
import { toast } from "react-hot-toast";

type AppointmentForDoctor = {
  appointmentId: string;
  patientId: string;
  patientName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  paymentStatus: string;
  videoCallAvailable: boolean;
};

type AvailableSlot = {
  _id: string;
  startTime: string;
  endTime: string;
};

export default function DoctorAppointmentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [appointment, setAppointment] = useState<AppointmentForDoctor | null>(
    location.state?.app || null
  );

  const [loading, setLoading] = useState(!appointment);
  const [rescheduling, setRescheduling] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    if (!appointment) {
      loadAppointment();
    }
  }, []);

  const loadAppointment = async () => {
    try {
      setLoading(true);
      const res = await getDoctorAppointments();
      const allAppts = [
        ...res.data.upcoming,
        ...res.data.past,
        ...res.data.recent
      ];
      const found = allAppts.find((a: AppointmentForDoctor) => a.appointmentId === id);
      if (found) {
        setAppointment(found);
      } else {
        toast.error("Appointment not found");
        navigate("/doctor/appointments");
      }
    } catch (error) {
      toast.error("Failed to load appointment details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async (date: string) => {
    setSlotsLoading(true);
    try {
      const slotsResponse = await api.get(`/doctor/schedules/slots?from=${date}&to=${date}`);
      const rawData = Array.isArray(slotsResponse.data) ? slotsResponse.data : slotsResponse.data.data || [];

      const freeSlots = rawData.filter((s: any) => !s.isBooked).map((s: any) => ({
        _id: s._id || `${s.date}_${s.startTime}`,
        startTime: s.startTime,
        endTime: s.endTime,
      }));
      setAvailableSlots(freeSlots);
    } catch (error) {
      console.error("Failed to load slots", error);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleCancel = () => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[280px]">
        <div>
          <h4 className="text-sm font-bold text-gray-900 leading-tight">Cancel Appointment?</h4>
          <p className="text-xs text-gray-500 mt-1">
            Are you sure you want to cancel this patient consultation?
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
    try {
      await cancelDoctorAppointment(id!);
      toast.success("Appointment cancelled successfully");
      loadAppointment(); // refresh to see status cancel
    } catch (error: any) {
      console.error("Failed to cancel", error);
      toast.error(error.response?.data?.message || "Failed to cancel appointment");
    }
  };

  const handleRescheduleClick = () => {
    setRescheduling(true);
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    fetchSlots(today);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    fetchSlots(date);
  };

  const confirmReschedule = async (selectedSlot: AvailableSlot) => {
    try {
      await rescheduleDoctorAppointment(id!, selectedSlot._id);
      toast.success("Appointment rescheduled successfully");
      setRescheduling(false);
      loadAppointment(); // refresh to get new date/time
    } catch {
      toast.error("Failed to reschedule appointment.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading details...</p>
      </div>
    );
  }

  if (!appointment) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <button
        onClick={() => navigate("/doctor/appointments")}
        className="mb-8 font-bold text-sky-600 hover:text-sky-800 transition-colors"
      >
        &larr; Back to Appointments
      </button>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-10">
        <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
          <div className="w-20 h-20 bg-sky-50 rounded-3xl flex items-center justify-center text-sky-600 font-bold text-3xl ring-4 ring-sky-100 ring-offset-4">
            {appointment.patientName.charAt(0)}
          </div>
          <div className="flex-1 space-y-2">
            <h1 className="text-4xl font-extrabold text-gray-900">{appointment.patientName}</h1>
            <div className="flex gap-4 items-center">
              <span className={`text-xs uppercase font-black tracking-widest px-3 py-1.5 rounded-lg ${appointment.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' :
                  appointment.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                {appointment.status}
              </span>
              <span className="text-gray-400 font-bold text-sm">
                ID: #{appointment.appointmentId.slice(-8).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Date</label>
            <p className="text-lg font-bold text-gray-900">
              {new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Time</label>
            <p className="text-lg font-bold text-gray-900">
              {appointment.startTime} - {appointment.endTime}
            </p>
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Payment Status</label>
            <p className="text-lg font-bold text-gray-900">{appointment.paymentStatus}</p>
          </div>
        </div>

        <div className="mb-8 text-center">
          <button
            onClick={() => navigate(`/chat/${appointment.appointmentId}`)}
            className="w-full py-5 bg-sky-50 text-sky-600 font-black uppercase text-xs tracking-widest rounded-[2rem] border-4 border-dashed border-sky-100 hover:bg-sky-600 hover:text-white hover:border-sky-600 hover:shadow-2xl hover:shadow-sky-100 transition-all flex items-center justify-center gap-4 active:scale-95 group"
          >
            <span className="text-2xl group-hover:rotate-12 transition-transform inline-block">💬</span>
            Open Patient Communication Channel
          </button>
        </div>

        {appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED' && (
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
            <button
              onClick={handleCancel}
              className="flex-1 px-6 py-4 border-2 border-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-50 hover:border-red-100 transition-all active:scale-95 text-lg"
            >
              Cancel Appointment
            </button>
            <button
              onClick={handleRescheduleClick}
              className="flex-1 px-6 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 active:scale-95 text-lg"
            >
              Reschedule
            </button>
          </div>
        )}

        {rescheduling && (
          <div className="mt-8 border-t border-gray-100 pt-8 animate-in slide-in-from-top duration-500">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-bold text-gray-900">Reschedule Consultation</h4>
              <button onClick={() => setRescheduling(false)} className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-200 transition-all">✕</button>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-72">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 pl-1">Target Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-3.5 font-bold text-gray-900 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all shadow-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 pl-1">Available Windows</label>
                {slotsLoading ? (
                  <div className="flex items-center gap-3 py-4 text-sky-600 font-bold">
                    <div className="w-4 h-4 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
                    Optimizing schedule...
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableSlots.length === 0 ? (
                      <div className="col-span-full py-12 bg-white rounded-3xl border-2 border-dashed border-gray-100 text-center">
                        <p className="text-sm font-bold text-gray-400 italic">No free slots found</p>
                      </div>
                    ) : (
                      availableSlots.map((slot, idx) => (
                        <button
                          key={idx}
                          onClick={() => confirmReschedule(slot)}
                          className="group/slot bg-white border border-gray-100 hover:border-sky-500 hover:bg-sky-600 p-4 rounded-2xl transition-all shadow-sm hover:shadow-lg hover:shadow-sky-200 text-center active:scale-95"
                        >
                          <span className="block text-[15px] font-black text-gray-900 group-hover/slot:text-white transition-colors">{slot.startTime}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
