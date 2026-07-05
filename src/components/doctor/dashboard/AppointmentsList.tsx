import {
  Clock3,
  ArrowRight,
  CheckCircle2,
  XCircle,
  CalendarClock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type {
DoctorAppointment
}
from "../../../types/DoctorAppointment";
import DashboardCard from "./DashboardCard";
import { formatTime } from "../../../utils/formatTime";
interface Props {
 appointments?: DoctorAppointment[];
}



export default function AppointmentsList({
  appointments = []
}: Props) {
  
  const navigate = useNavigate();

  const previewAppointments = appointments.slice(0, 3);

  const remainingAppointments =
    appointments.length - previewAppointments.length;

  const getStatus = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return {
          icon: CalendarClock,
          text: "text-blue-600",
          label: "Upcoming",
        };

      case "COMPLETED":
        return {
          icon: CheckCircle2,
          text: "text-green-600",
          label: "Completed",
        };

      case "CANCELLED":
        return {
          icon: XCircle,
          text: "text-red-600",
          label: "Cancelled",
        };

      default:
        return {
          icon: CalendarClock,
          text: "text-gray-500",
          label: status,
        };
    }
  };

  return (
    <DashboardCard
      title="Today's Appointments"
      subtitle={`Showing your next ${previewAppointments.length} appointments.`}
      actionLabel="View All"
      onAction={() => navigate("/doctor/appointments")}
    >
      {appointments.length === 0 ? (
        <div className="py-12 text-center">

          <Clock3 className="mx-auto w-10 h-10 text-gray-300" />

          <h3 className="mt-3 font-semibold text-gray-700">
            No appointments today
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Enjoy your free schedule.
          </p>

        </div>
      ) : (
        <>
          <div className="space-y-1">

            {previewAppointments.map((appointment, index) => {
              const status = getStatus(
                appointment.status ?? "UPCOMING"
              );

              const StatusIcon = status.icon;

              return (
                <div
                  key={appointment.appointmentId}
                  className={`py-4 ${
                    index !== previewAppointments.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-start">

                    {/* Left */}

                    <div className="flex gap-3">

                      <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center font-semibold text-sky-700 text-sm">

                        {appointment.patientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}

                      </div>

                      <div>

                        <h3 className="font-semibold text-gray-900">
                          {appointment.patientName}
                        </h3>

                        {/* <p className="text-sm text-gray-500">
                          {appointment.visitType}
                        </p> */}

                        <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">

                          <Clock3 className="w-4 h-4" />

                          {formatTime(appointment.startTime)}

                        </div>

                      </div>

                    </div>

                    {/* Right */}

                    <div className="flex flex-col items-end gap-3">

                      <div
                        className={`flex items-center gap-1 ${status.text}`}
                      >

                        <StatusIcon className="w-4 h-4" />

                        <span className="text-xs font-medium">
                          {status.label}
                        </span>

                      </div>

                      <button
                        onClick={() =>{
        

                          navigate(
                            `/doctor/appointments/${appointment.appointmentId}`
                          )
                        }
                        }
                        className="text-sky-600 hover:text-sky-700 transition"
                      >

                        <ArrowRight className="w-5 h-5" />

                      </button>

                    </div>

                  </div>
                </div>
              );
            })}

          </div>

          {remainingAppointments > 0 && (

            <div className="border-t border-gray-100 pt-4 mt-4 flex items-center justify-between">

              <p className="text-sm text-gray-500">
                +{remainingAppointments} more appointment
                {remainingAppointments > 1 ? "s" : ""}
              </p>

              <button
                onClick={() => navigate("/doctor/appointments")}
                className="text-sm font-medium text-sky-600 hover:text-sky-700"
              >
                View All
              </button>

            </div>

          )}
        </>
      )}
    </DashboardCard>
  );
}