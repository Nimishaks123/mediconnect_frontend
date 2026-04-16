import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchNotifications, markAsRead } from "../store/notification/notificationSlice";
import { BellIcon, CheckCircleIcon, ClockIcon, CreditCardIcon, ChatBubbleLeftIcon, ExclamationCircleIcon, XCircleIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
const getTimeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m";
  return Math.floor(seconds) + "s";
};

export default function NotificationBell() {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, loading } = useAppSelector((state) => state.notifications);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchNotifications(1));
  }, [dispatch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "APPOINTMENT": return <ClockIcon className="w-5 h-5 text-blue-500" />;
      case "APPOINTMENT_CANCELLED": return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case "APPOINTMENT_RESCHEDULED": return <ArrowPathIcon className="w-5 h-5 text-amber-500" />;
      case "PAYMENT": return <CreditCardIcon className="w-5 h-5 text-emerald-500" />;
      case "CHAT": return <ChatBubbleLeftIcon className="w-5 h-5 text-purple-500" />;
      default: return <ExclamationCircleIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                {unreadCount} New
              </span>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Alerts...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <BellIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-xs font-black uppercase tracking-[0.2em]">All Caught Up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleMarkAsRead(n.id)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors relative group ${!n.isRead ? "bg-blue-50/30" : ""}`}
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-grow space-y-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm tracking-tight ${!n.isRead ? "font-black text-gray-900" : "font-bold text-gray-600"}`}>
                            {n.title}
                          </p>
                          <span className="text-[9px] font-bold text-gray-400 uppercase">
                            {getTimeAgo(new Date(n.createdAt))} ago
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed font-medium">
                          {n.message}
                        </p>
                      </div>
                    </div>
                    {!n.isRead && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            className="w-full p-4 text-[10px] font-black text-gray-400 hover:text-blue-600 hover:bg-gray-50 transition-all uppercase tracking-[0.2em] border-t border-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
