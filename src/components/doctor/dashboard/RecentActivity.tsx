import { useEffect, useState } from "react";
import {
  CalendarCheck,
  CalendarX,
  CalendarDays,
  FileText,
  Wallet,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "./DashboardCard";
import { getRecentActivity } from "../../../api/doctorDashboardApi";
import { ActivityType } from "../../../types/doctorDashboard";
import type{ RecentActivityItem } from "../../../types/doctorDashboard";
import { toast } from "react-hot-toast";

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
};

const getActivityConfig = (type: ActivityType) => {
  switch (type) {
    case ActivityType.APPOINTMENT_COMPLETED:
      return { icon: CalendarCheck, color: "text-blue-600 bg-blue-100" };
    case ActivityType.APPOINTMENT_CANCELLED:
      return { icon: CalendarX, color: "text-red-600 bg-red-100" };
    case ActivityType.APPOINTMENT_BOOKED:
      return { icon: CalendarDays, color: "text-indigo-600 bg-indigo-100" };
    case ActivityType.PRESCRIPTION_CREATED:
      return { icon: FileText, color: "text-green-600 bg-green-100" };
    case ActivityType.WALLET_CREDITED:
      return { icon: Wallet, color: "text-yellow-600 bg-yellow-100" };
    case ActivityType.NEW_REVIEW_RECEIVED:
      return { icon: Star, color: "text-orange-600 bg-orange-100" };
    default:
      return { icon: CalendarCheck, color: "text-gray-600 bg-gray-100" };
  }
};

export default function RecentActivity() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getRecentActivity();
        setActivities(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load recent activity.");
        toast.error("Failed to load recent activity.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <DashboardCard title="Recent Activity" subtitle="Loading activities...">
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
        </div>
      </DashboardCard>
    );
  }

  if (error) {
    return (
      <DashboardCard title="Recent Activity" subtitle="Error loading activities">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center h-48 flex items-center justify-center">
          <h2 className="font-bold text-red-600">{error}</h2>
        </div>
      </DashboardCard>
    );
  }

  const previewActivities = activities.slice(0, 3);
  const remainingActivities = activities.length - previewActivities.length;

  return (
    <DashboardCard
      title="Recent Activity"
      subtitle={activities.length > 0 ? `Showing your latest ${previewActivities.length} activities.` : "No recent activity."}
      actionLabel="View All"
      onAction={() => navigate("/doctor/activity")}
    >
      <div className="space-y-1">
        {previewActivities.map((activity, index) => {
          const config = getActivityConfig(activity.type);
          const Icon = config.icon;

          return (
            <div
              key={index}
              className={`py-4 ${
                index !== previewActivities.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${config.color}`}
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
                      {timeAgo(activity.createdAt)}
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