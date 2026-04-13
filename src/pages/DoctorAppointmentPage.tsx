import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getDoctorSlotsForPatient,
} from "../api/schedule";
import type { DoctorSlot } from "../api/schedule";
import { createAppointment } from "../api/appointments";
import { createCheckoutSession } from "../api/paymentApi";
import { toast } from "react-hot-toast";

const DAYS_TO_SHOW = 7;

const getLocalDateString = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export default function DoctorAppointmentPage() {
  const { doctorId } = useParams<{ doctorId: string }>();

  const today = getLocalDateString(new Date());

  const [selectedDate, setSelectedDate] = useState(today);
  const [slots, setSlots] = useState<DoctorSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<DoctorSlot | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!doctorId || doctorId === "undefined") return;

    setLoading(true);
    setSelectedSlot(null);

    getDoctorSlotsForPatient(
      doctorId,
      selectedDate,
      selectedDate
    )
      .then((res) => {
        setSlots(res.data);
      })
      .catch(() => {
        // quiet fail
      })
      .finally(() => setLoading(false));
  }, [doctorId, selectedDate]);

  const getNextDays = () => {
    return Array.from({ length: DAYS_TO_SHOW }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return getLocalDateString(d);
    });
  };

  const slotsForDate = slots.filter(
    (slot) => slot.date === selectedDate
  );

  // const handleConfirmAppointment = async () => {
  //   if (!selectedSlot || !doctorId) return;

  //   try {
  //     setLoading(true);

  //     //Create appointment (PAYMENT_PENDING)
  //     const appointmentRes = await createAppointment({
  //       doctorId,
  //       date: selectedDate,
  //       startTime: selectedSlot.startTime,
  //       endTime: selectedSlot.endTime,
  //     });

  //     const appointmentId = appointmentRes.appointmentId;

  //     // Create Stripe Checkout session
  //     const paymentRes = await createCheckoutSession(
  //       appointmentId
  //     );

  //     // Redirect to Stripe  checkout
  //     window.location.href = paymentRes.checkoutUrl;

  //   } catch (err: any) {
  //     alert(
  //       err.response?.data?.message ||
  //       "Unable to proceed to payment"
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleConfirmAppointment = async () => {
  if (!selectedSlot || !doctorId || doctorId === "undefined") return;

  try {
    setLoading(true);

    // Create availabilityId exactly how backend expects
    const availabilityId = `${doctorId}_${selectedDate}_${selectedSlot.startTime}_${selectedSlot.endTime}`;

    const appointmentRes = await createAppointment({
      doctorId,
      availabilityId,
    });

    const appointmentId = appointmentRes.appointmentId;

    // Create Stripe Checkout session
    const paymentRes = await createCheckoutSession(appointmentId);

    // Redirect to Stripe
    window.location.href = paymentRes.checkoutUrl;

  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    toast.error(
      error.response?.data?.message ||
      "Unable to proceed to payment"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Book Appointment
        </h1>
        <p className="text-gray-500 text-sm">
          Choose a date and available time slot
        </p>
      </div>

      {/* DATE PICKER */}
      <div>
        <h2 className="text-sm font-medium mb-2">
          Choose Date
        </h2>

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

      {/* SLOTS */}
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

      {/* CONFIRM */}
      {selectedSlot && (
        <div className="border rounded-xl p-4 bg-sky-50">
          <p className="text-sm mb-2">
            Selected Slot:
          </p>

          <p className="font-medium">
            {new Date(selectedDate).toDateString()} <br />
            {selectedSlot.startTime} – {selectedSlot.endTime}
          </p>

          <button
            onClick={handleConfirmAppointment}
            disabled={loading}
            className="mt-4 w-full bg-sky-600 text-white py-2 rounded-lg font-medium hover:bg-sky-700 disabled:opacity-50"
          >
            Proceed to Payment
          </button>
        </div>
      )}
    </div>
  );
}
