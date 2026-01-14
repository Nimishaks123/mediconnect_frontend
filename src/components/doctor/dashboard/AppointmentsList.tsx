// src/components/doctor/AppointmentsList.tsx
import type { Appointment } from "../../../types/Appointment";

const appointments: Appointment[] = [
  {
    id: "1",
    patientName: "Stacy Mitchell",
    visitType: "Weekly Visit",
    time: "9:15 AM",
  },
  {
    id: "2",
    patientName: "Amy Dunham",
    visitType: "Routine Checkup",
    time: "9:30 AM",
  },
  {
    id: "3",
    patientName: "Demi Joan",
    visitType: "Report",
    time: "9:50 AM",
  },
  {
    id: "4",
    patientName: "Susan Myers",
    visitType: "Weekly Visit",
    time: "10:15 AM",
  },
];


export default function AppointmentsList() {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="text-lg font-semibold mb-4">
        Manage Appointments
      </h3>

      <div className="space-y-4">
        {appointments.map((a) => (
          <div
            key={a.id}
            className="flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{a.patientName}</p>
              <p className="text-sm text-gray-500">
                {a.visitType}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                {a.time}
              </span>
              <button className="text-teal-600 font-semibold">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
