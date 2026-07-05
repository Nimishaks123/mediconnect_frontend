import {
  CalendarCheck,
  FileText,
  Wallet,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "./DashboardCard";

interface Activity {
  id: number;
  title: string;
  description: string;
  time: string;
  icon: React.ElementType;
  color: string;
}

const activities: Activity[] = [
  {
    id: 1,
    title: "Appointment Completed",
    description: "Sarah Johnson",
    time: "10 mins ago",
    icon: CalendarCheck,
    color: "text-blue-600 bg-blue-100",
  },
  {
    id: 2,
    title: "Prescription Created",
    description: "Michael Thomas",
    time: "35 mins ago",
    icon: FileText,
    color: "text-green-600 bg-green-100",
  },
  {
    id: 3,
    title: "Wallet Credited",
    description: "Consultation Fee",
    time: "1 hour ago",
    icon: Wallet,
    color: "text-yellow-600 bg-yellow-100",
  },
  {
    id: 4,
    title: "New Review",
    description: "★★★★★ Excellent consultation",
    time: "Yesterday",
    icon: Star,
    color: "text-orange-600 bg-orange-100",
  },
];

export default function RecentActivity() {
  const navigate = useNavigate();

  const previewActivities = activities.slice(0, 3);

  const remainingActivities =
    activities.length - previewActivities.length;

  return (
    <DashboardCard
      title="Recent Activity"
      subtitle={`Showing your latest ${previewActivities.length} activities.`}
      actionLabel="View All"
      onAction={() => navigate("/doctor/activity")}
    >
      <div className="space-y-1">

        {previewActivities.map((activity, index) => {

          const Icon = activity.icon;

          return (
            <div
              key={activity.id}
              className={`py-4 ${
                index !== previewActivities.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">

                {/* Icon */}

                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activity.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}

                <div className="flex-1 min-w-0">

                  <div className="flex items-center justify-between gap-3">

                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {activity.title}
                    </h3>

                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {activity.time}
                    </span>

                  </div>

                  <p className="text-sm text-gray-500 mt-1 truncate">
                    {activity.description}
                  </p>

                </div>

              </div>
            </div>
          );
        })}

      </div>

      {remainingActivities > 0 && (
        <div className="border-t border-gray-100 pt-4 mt-4 flex items-center justify-between">

          <p className="text-sm text-gray-500">
            +{remainingActivities} more activit{remainingActivities > 1 ? "ies" : "y"}
          </p>

          <button
            onClick={() => navigate("/doctor/activity")}
            className="text-sm font-medium text-sky-600 hover:text-sky-700 transition"
          >
            View All
          </button>

        </div>
      )}

    </DashboardCard>
  );
}