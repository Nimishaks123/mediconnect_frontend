// import { useState, useEffect } from "react";
// import { SlotList } from "../../components/shared/SlotList";
// import { getDoctorSlots} from "../../api/schedule";
// import type { DoctorSlot } from "../../api/schedule";

// export default function DoctorSlotsPage() {
//   const [slots, setSlots] = useState<DoctorSlot[]>([]);

//   useEffect(() => {
//     getDoctorSlots("2026-02-01", "2026-02-07")
//       .then((res) => {
//         setSlots(res.data);
//       })
//       .catch(console.error);
//   }, []);

//   return (
//     <div>
//       <h1>My Available Slots</h1>
//       <SlotList slots={slots} />
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { getDoctorSlots } from "../../api/schedule";
import type { DoctorSlot } from "../../api/schedule";

export default function DoctorSlotsPage() {
  const [slots, setSlots] = useState<DoctorSlot[]>([]);
  const [date, setDate] = useState("");

  useEffect(() => {
    if (!date) return;

    getDoctorSlots(date, date)
      .then((res) => setSlots(res.data))
      .catch(console.error);
  }, [date]);

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-xl font-semibold mb-4">
        My Available Slots
      </h1>

      {/* DATE PICKER */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border rounded px-3 py-2 mb-6"
      />

      {!date && (
        <p className="text-gray-500">
          Please select a date to view slots
        </p>
      )}

      {date && slots.length === 0 && (
        <p className="text-gray-500">
          No slots available for this date
        </p>
      )}

      {/* SLOT GRID */}
      <div className="grid grid-cols-4 gap-3">
        {slots.map((slot, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-3 text-center hover:bg-sky-50"
          >
            <p className="font-medium text-sm">
              {slot.startTime} – {slot.endTime}
            </p>

            {/* future actions */}
            <button className="mt-2 text-xs text-red-600 hover:underline">
              Close
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
