import {
  CalendarPlus,
  CalendarCheck,
  FileText,
  Wallet,
  Star,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "./DashboardCard";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Create Schedule",
      description: "Add your availability",
      icon: CalendarPlus,
      color: "bg-blue-100 text-blue-600",
      path: "/doctor/schedule",
    },
    {
      title: "Today's Appointments",
      description: "Manage booked appointments",
      icon: CalendarCheck,
      color: "bg-green-100 text-green-600",
      path: "/doctor/appointments",
    },
    {
      title: "Prescriptions",
      description: "Create & view prescriptions",
      icon: FileText,
      color: "bg-purple-100 text-purple-600",
      path: "/doctor/appointments",
    },
    {
      title: "Wallet",
      description: "View earnings & transactions",
      icon: Wallet,
      color: "bg-yellow-100 text-yellow-600",
      path: "/doctor/wallet",
    },
    {
      title: "Reviews",
      description: "Patient feedback",
      icon: Star,
      color: "bg-orange-100 text-orange-600",
      path: "/doctor/reviews",
    },
    // {
    //   title: "Today's Slots",
    //   description: "Check available slots",
    //   icon: Clock,
    //   color: "bg-cyan-100 text-cyan-600",
    //   path: "/doctor/slots",
    // },
  ];

  return (
    <DashboardCard
      title="Quick Actions"
      subtitle="Frequently used shortcuts."
    >
      <div className="space-y-1">
        {actions.map((action, index) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              onClick={() => navigate(action.path)}
              className={`group w-full py-3 transition hover:bg-gray-50 rounded-lg ${
                index !== actions.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">

                {/* Left */}

                <div className="flex items-center gap-3">

                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${action.color}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="text-left">

                    <h3 className="font-semibold text-gray-900 text-sm">
                      {action.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {action.description}
                    </p>

                  </div>

                </div>

                {/* Right */}

                <ArrowRight className="w-5 h-5 text-gray-400 transition group-hover:text-sky-600 group-hover:translate-x-1" />

              </div>
            </button>
          );
        })}
      </div>
    </DashboardCard>
  );
}