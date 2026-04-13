import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { store } from "../store";
import { addNotification } from "../store/notification/notificationSlice";

class SocketService {
  private socket: Socket | null = null;

  connect(userId: string) {
    if (this.socket) return;

    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
    const socketUrl = baseUrl.replace("/api", "");

    this.socket = io(socketUrl, {
      query: { userId }
    });

    this.socket.on("connect", () => {
      console.log("Connected to notification server");
    });

    this.socket.on("notification", (notification) => {
      console.log("[Socket] New notification received:", notification);
      // Add to Redux store
      store.dispatch(addNotification(notification));
      
      // Show Toast
      toast.success(notification.title, {
        description: notification.message,
        duration: 5000,
      });
    });

    // Legacy listeners if needed, but "notification" is preferred now
    this.socket.on("appointment_created", (data) => {
      toast.success(data.message || "New appointment request!");
    });
    this.socket.on("appointment_confirmed", (data) => {
      toast.success(data.message || "Your appointment is confirmed!");
    });

    this.socket.on("doctor_verified", (data) => {
      toast.success(data.message || "Congratulations! You are verified.");
    });

    this.socket.on("doctor_rejected", (data) => {
      toast.error(data.message || "Application rejected.");
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
