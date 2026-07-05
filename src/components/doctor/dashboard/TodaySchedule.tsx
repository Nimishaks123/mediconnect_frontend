import {
  CalendarClock,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "./DashboardCard";
import type { DoctorAppointment } from "../../../types/DoctorAppointment";
import { formatTime } from "../../../utils/formatTime";
interface Props {
  appointments?: DoctorAppointment[];
}

export default function TodaySchedule({
    appointments=[],
}:Props) {
  const navigate = useNavigate();
const previewSchedule = appointments.slice(0, 3);

const remainingSlots =
  appointments.length - previewSchedule.length;
 
const getStatus = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return {
        icon: CalendarClock,
        text: "text-blue-600",
        label: "Confirmed",
      };

    case "COMPLETED":
      return {
        icon: CheckCircle2,
        text: "text-green-600",
        label: "Completed",
      };

    case "CANCELLED":
      return {
        icon: CalendarClock,
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
      title="Today's Schedule"
      subtitle={`Showing your next ${previewSchedule.length} schedule slots.`}
      actionLabel="View Schedule"
      onAction={() => navigate("/doctor/slots")}
    >
      <div className="space-y-1">
        {previewSchedule.map((slot, index) => {
          const status = getStatus(slot.status);
          const StatusIcon = status.icon;

          return (
            <div
              key={slot.appointmentId}
              className={`py-4 ${
                index !== previewSchedule.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
            >
              <div className="flex justify-between items-start">

                {/* Left */}

                <div>
                  <h3 className="font-semibold text-gray-900">
               {formatTime(slot.startTime)}
                  </h3>

                  <p className="text-sm text-gray-700 mt-1">
                    Online Consultation
                  </p>

                  {slot.patientName && (
                    <p className="text-sm text-gray-500 mt-1">
                      {slot.patientName}
                    </p>
                  )}
                </div>

                {/* Right */}

                <div
                  className={`flex items-center gap-1 ${status.text}`}
                >
                  <StatusIcon className="w-4 h-4" />

                  <span className="text-xs font-medium">
                    {status.label}
                  </span>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {remainingSlots > 0 && (
        <div className="border-t border-gray-100 pt-4 mt-4 flex items-center justify-between">

          <p className="text-sm text-gray-500">
            +{remainingSlots} more schedule
            {remainingSlots > 1 ? "s" : ""}
          </p>

          <button
            onClick={() => navigate("/doctor/slots")}
            className="text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            View Schedule
          </button>

        </div>
      )}
    </DashboardCard>
  );
}