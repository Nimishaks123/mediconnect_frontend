import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchDoctorAvailability,
  bookAppointmentThunk,
} from "../store/appointments/appointmentThunks";
import toast from "react-hot-toast";

export default function DoctorAvailabilityPage() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const dispatch = useAppDispatch();

  const { availability, loading } = useAppSelector(
    (state) => state.appointments
  );

  const [date, setDate] = useState("");

  useEffect(() => {
    if (doctorId && date) {
      dispatch(fetchDoctorAvailability({ doctorId, date }));
    }
  }, [dispatch, doctorId, date]);

  const handleBook = async (availabilityId: string) => {
    try {
      await dispatch(
        bookAppointmentThunk({
          doctorId: doctorId!,
          availabilityId,
        })
      ).unwrap();

      toast.success("Appointment booked successfully");
    } catch (err) {
      toast.error(String(err));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-semibold mb-6">
        Select Appointment Slot
      </h2>

      {/* Date Picker */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border px-4 py-2 rounded mb-6"
      />

      {/* Loading */}
      {loading && (
        <p className="text-gray-500">Loading slots...</p>
      )}

      {/* Slots */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {availability.map((slot) => (
          <button
            key={slot.id}
            onClick={() => handleBook(slot.id)}
            className="border rounded-lg p-4 hover:bg-blue-50"
          >
            <p className="font-medium">
              {slot.startTime} – {slot.endTime}
            </p>
          </button>
        ))}
      </div>

      {!loading && availability.length === 0 && date && (
        <p className="text-gray-500 mt-4">
          No slots available for selected date
        </p>
      )}
    </div>
  );
}
