type Appointment = {
  id: number;
  date: string;
  doctor: string;
  department: string;
  concern: string;
  time: string;
  status: "Upcoming" | "Completed" | "Pending" | "Canceled";
};

const statusColor: Record<Appointment["status"], string> = {
  Upcoming: "text-blue-600 bg-blue-100",
  Completed: "text-emerald-700 bg-emerald-100",
  Pending: "text-amber-700 bg-amber-100",
  Canceled: "text-rose-700 bg-rose-100",
};

const AppointmentTable = ({ appointments }: { appointments: Appointment[] }) => {
  return (
    <section className="mb-10 rounded-3xl bg-white p-6 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Appointment List</h2>
        <div className="space-x-2 text-sm text-gray-500">
          <span>1-7</span>
          <span>of</span>
          <span>32</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-gray-500">
              <th className="py-3">ID</th>
              <th className="py-3">Date</th>
              <th className="py-3">Doctor</th>
              <th className="py-3">Department</th>
              <th className="py-3">Area of Concern</th>
              <th className="py-3 text-center">Time</th>
              <th className="py-3 text-center">Status</th>
              <th className="py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {appointments.map((appointment, index) => (
              <tr
                key={appointment.id}
                className={index === 1 ? "bg-blue-50" : "hover:bg-gray-50"}
              >
                <td className="py-4 font-semibold text-gray-600">#{appointment.id}</td>
                <td className="py-4 text-gray-600">{appointment.date}</td>
                <td className="py-4 text-gray-900">{appointment.doctor}</td>
                <td className="py-4 text-gray-600">{appointment.department}</td>
                <td className="py-4 text-gray-600">{appointment.concern}</td>
                <td className="py-4 text-center text-gray-600">{appointment.time}</td>

                <td className="py-4 text-center">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[appointment.status]}`}
                  >
                    {appointment.status}
                  </span>
                </td>

                <td className="py-4 text-right text-gray-400">
                  <button className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:text-blue-600">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </section>
  );
};

export default AppointmentTable;
