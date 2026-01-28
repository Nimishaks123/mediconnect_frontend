import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getDoctorSlotsForPatient,
} from "../api/schedule";
import type { DoctorSlot } from "../api/schedule";

const DAYS_TO_SHOW = 7;

export default function DoctorAppointmentPage() {
  const { doctorId } = useParams<{ doctorId: string }>();

  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [slots, setSlots] = useState<DoctorSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<DoctorSlot | null>(null);
  const [loading, setLoading] = useState(false);

  /* ───────── fetch slots (PATIENT API) ───────── */

  useEffect(() => {
    console.log("Selected date:", selectedDate);
  console.log("All slots from API:", slots);
    if (!doctorId) return;

    setLoading(true);
    setSelectedSlot(null);

    getDoctorSlotsForPatient(
      doctorId,
      selectedDate,
      selectedDate
    )
      .then((res) => setSlots(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [doctorId, selectedDate]);

  /* ───────── helpers ───────── */

  const getNextDays = () => {
    return Array.from({ length: DAYS_TO_SHOW }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d.toISOString().split("T")[0];
    });
  };

  const slotsForDate = slots.filter(
    (slot) => slot.date === selectedDate
  );

  /* ───────── UI ───────── */

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Book Appointment</h1>
        <p className="text-gray-500 text-sm">
          Choose a date and available time slot
        </p>
      </div>

      {/* Date selector */}
      <div>
        <h2 className="text-sm font-medium mb-2">Choose Date</h2>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {getNextDays().map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`px-4 py-2 rounded-lg border text-sm whitespace-nowrap
                ${
                  selectedDate === date
                    ? "bg-sky-600 text-white border-sky-600"
                    : "bg-white hover:bg-sky-50"
                }`}
            >
              {new Date(date).toDateString().slice(0, 10)}
            </button>
          ))}
        </div>
      </div>

      {/* Slots */}
      <div>
        <h2 className="text-sm font-medium mb-3">
          Available Slots
        </h2>

        {loading && (
          <p className="text-gray-500 text-sm">
            Loading available slots…
          </p>
        )}

        {!loading && slotsForDate.length === 0 && (
          <p className="text-gray-500 text-sm">
            No slots available for this date
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {slotsForDate.map((slot, index) => (
            <button
              key={index}
              onClick={() => setSelectedSlot(slot)}
              className={`border rounded-lg p-3 text-sm transition
                ${
                  selectedSlot === slot
                    ? "bg-sky-600 text-white border-sky-600"
                    : "hover:bg-sky-50"
                }`}
            >
              {slot.startTime} – {slot.endTime}
            </button>
          ))}
        </div>
      </div>

      {/* Selected slot confirmation */}
      {selectedSlot && (
        <div className="border rounded-xl p-4 bg-sky-50">
          <p className="text-sm mb-2">Selected Slot:</p>

          <p className="font-medium">
            {new Date(selectedDate).toDateString()} <br />
            {selectedSlot.startTime} – {selectedSlot.endTime}
          </p>

          <button
            className="mt-4 w-full bg-sky-600 text-white py-2 rounded-lg font-medium hover:bg-sky-700"
          >
            Confirm Appointment
          </button>

          <p className="text-xs text-gray-400 mt-2 text-center">
            Confirmation step will be added next
          </p>
        </div>
      )}
    </div>
  );
}
