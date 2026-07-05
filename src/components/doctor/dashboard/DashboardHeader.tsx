import {
  CalendarCheck,
} from "lucide-react";

interface Props {
  doctorName?: string;
  appointmentCount?: number;
  availableSlots?: number;
}

export default function DashboardHeader({
  doctorName = "Doctor",
  appointmentCount = 8,
  availableSlots = 2,
}: Props) {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
  }

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mb-6">

      {/* Top Row */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        {/* Left */}

        <div>

          <h1 className="text-3xl font-bold text-gray-900">
            {greeting}, Dr. {doctorName} 👋
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">

            <div className="flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-sky-700">

              <CalendarCheck className="w-4 h-4" />

              <span className="font-medium">
                {appointmentCount} Appointments Today
              </span>

            </div>

            <div className="rounded-full bg-green-50 px-3 py-1.5 text-green-700">

              <span className="font-medium">
                {availableSlots} Available Slots
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}