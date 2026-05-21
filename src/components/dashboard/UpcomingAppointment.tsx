import { useNavigate }
from "react-router-dom";
import {
  Calendar,
  Clock,
  Video,
  Bell,
} from "lucide-react";

interface Props {
  appointment: any;
}

const UpcomingAppointment = ({
  appointment,
}: Props) => {
    const navigate =
  useNavigate();

  if (!appointment) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        No upcoming appointments
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">

      {/* TOP */}
      <div className="flex items-start justify-between mb-8">

        <div>
          <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-xs font-semibold">
            Next Appointment
          </span>

          <h2 className="text-3xl font-bold mt-4 text-gray-900">
            TeleHealth Consultation
          </h2>
        </div>

        {/* STATUS BADGE */}
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
          {appointment.status}
        </div>
      </div>

      {/* BODY */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">

        {/* LEFT SIDE */}
        <div className="flex gap-5 items-center">

          {/* IMAGE */}
          <img
            src={
              appointment.doctor?.profilePhoto ||
              "https://i.pravatar.cc/100"
            }
            alt="doctor"
            className="w-24 h-24 rounded-2xl object-cover border border-gray-200"
          />

          {/* INFO */}
          <div>

            <h3 className="text-2xl font-bold text-gray-900">
              Dr. {appointment.doctor?.name}
            </h3>

            {/* SPECIALTY */}
            <p className="text-gray-500 mt-1">
              {appointment.doctor?.specialty}
              {" • "}
              {appointment.doctor?.experience || 5}
              years experience
            </p>

            {/* DATE TIME */}
            <div className="flex gap-6 mt-5 text-gray-600 text-sm">

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />

                {appointment.date}
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />

                {appointment.startTime}
              </div>

            </div>

            {/* REMINDER */}
            <div className="mt-5 flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-xl text-sm font-medium w-fit">

              <Bell className="w-4 h-4" />

              Your consultation starts soon
            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-4 min-w-[220px]">

          <button className="bg-blue-500 hover:bg-blue-600 transition-all text-white px-6 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2">

            <Video className="w-5 h-5" />

            Join Consultation
          </button>

          {/* <button className="border border-gray-300 hover:bg-gray-50 transition-all px-6 py-3 rounded-2xl font-semibold">
            Reschedule
          </button> */}
          <button
  onClick={() =>
    navigate(
      `/appointments/${appointment.id}`
    )
  }
  className="border border-red-300 text-red-600 hover:bg-red-50 transition-all px-6 py-3 rounded-2xl font-semibold"
>
  Cancel Appointment
</button>

        </div>
      </div>
    </div>
  );
};

export default UpcomingAppointment;