import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { getDoctorSlotsWithBooking, deleteSlot } from "../../api/schedule";
import type { DoctorSlotWithBooking } from "../../api/schedule";

export default function DoctorSlotsPage() {
  const [slots, setSlots] = useState<DoctorSlotWithBooking[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  const loadSlots = useCallback(() => {
    if (!date) return;
    setLoading(true);
    getDoctorSlotsWithBooking(date, date)
      .then((res) => {
        setSlots(res.data);
      })
      .catch(() => {
        toast.error("Failed to load slots");
      })
      .finally(() => setLoading(false));
  }, [date]);

  useEffect(() => {
    loadSlots();
  }, [date, loadSlots]);

  const handleDelete = (slotId?: string) => {
    if (!slotId) return;

    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[280px]">
        <div>
          <h4 className="text-sm font-bold text-gray-900 leading-tight">Delete Slot?</h4>
          <p className="text-xs text-gray-500 mt-1">
            Are you sure you want to delete this slot?
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              processDeletion(slotId);
            }}
            className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm shadow-red-100 transition-all border border-red-700"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      position: 'top-center',
    });
  };

  const processDeletion = async (slotId: string) => {
    try {
      await deleteSlot(slotId);
      setSlots((prev) => prev.filter((s) => s._id !== slotId));
      toast.success("Slot deleted successfully");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to delete slot");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Availability Overview</h1>
          <p className="mt-1 text-gray-500">Monitor your daily slot utilization and availability.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
           <span className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Select Date</span>
           <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border-none focus:ring-0 text-sm font-semibold bg-transparent cursor-pointer"
          />
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {slots.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
              <span className="text-4xl">📅</span>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No slots defined for this day</h3>
              <p className="mt-1 text-gray-500">Configure your weekly schedule to see available time windows.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {slots.map((slot, idx) => (
                <div
                  key={idx}
                  className={`relative overflow-hidden group p-5 rounded-2xl border transition-all duration-300 ${
                    slot.isBooked
                      ? "bg-amber-50/50 border-amber-100 ring-1 ring-amber-100"
                      : "bg-white border-gray-100 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-500/5 hover:-translate-y-0.5"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-white transition-colors">
                      <span className="text-lg">🕒</span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
                      slot.isBooked ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {slot.isBooked ? "Booked" : "Available"}
                    </span>
                  </div>

                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {slot.startTime} – {slot.endTime}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 font-medium italic">Duration:{slot.startTime} – {slot.endTime}</p>
                  </div>

                  {slot.isBooked && (
                    <div className="mt-4 pt-4 border-t border-amber-100/50 flex items-center justify-between">
                       <span className="text-[11px] text-amber-800 font-bold flex items-center gap-1">
                         <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                         Appointment Confirmed
                       </span>
                    </div>
                  )}
                  
                  {!slot.isBooked && (
                     <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <button
                          onClick={() => handleDelete(slot._id)}
                          title="Delete Slot"
                          className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1 rounded transition-colors shadow-sm text-xs font-bold"
                        >
                          Delete
                        </button>
                     </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className="bg-sky-50 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 justify-between border border-sky-100">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl">💡</div>
            <div>
              <h4 className="font-bold text-sky-900">Manage Appointments</h4>
              <p className="text-sm text-sky-700/80">To view patient details, reschedule, or cancel a booking, please use the Appointments tab.</p>
            </div>
         </div>
         <a href="/doctor/appointments" className="whitespace-nowrap px-6 py-3 bg-white text-sky-700 font-bold rounded-xl border border-sky-200 hover:bg-sky-100 transition-colors shadow-sm">
           View Appointments
         </a>
      </div>
    </div>
  );
}
