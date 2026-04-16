import { io, Socket } from "socket.io-client";
import { showSuccess, showError } from "../utils/toastUtils";
import { store } from "../store";
import { addNotification } from "../store/notification/notificationSlice";
import { addMessage, setUserTyping, setRecipientOnline, updateMessageStatus } from "../store/chat/chatSlice";
import { setIncomingCall, setCallStatus } from "../store/call/callSlice";

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
      console.log("Socket connected:", this.socket?.id);
    });

    this.socket.on("new_message", (message) => {
      store.dispatch(addMessage(message));
    });

    this.socket.on("user_typing", (data) => {
      store.dispatch(setUserTyping(data));
    });

    this.socket.on("messages_seen", (data) => {
      store.dispatch(updateMessageStatus({ 
        conversationId: data.conversationId, 
        status: "seen" 
      }));
    });

    this.socket.on("user_status", (data) => {
      const state = store.getState();
      const activeRecipient = state.chat.messages[0]?.receiverId === data.userId || state.chat.messages[0]?.senderId === data.userId;
      if (activeRecipient) {
        store.dispatch(setRecipientOnline(data.status === "online"));
      }
    });

    this.socket.on("notification", (notification) => {
      console.log("[Socket] New notification received:", notification);
      store.dispatch(addNotification(notification));
      showSuccess(notification.title);
    });

    // Video Call Listeners
    this.socket.on("incoming_call", (data) => {
      store.dispatch(setIncomingCall({
        appointmentId: data.appointmentId,
        callerName: data.doctorName
      }));
    });

    this.socket.on("call_accepted", () => {
      store.dispatch(setCallStatus("ongoing"));
    });

    this.socket.on("call_rejected", () => {
      store.dispatch(setCallStatus("idle"));
      showError("Call rejected by patient");
    });

    this.socket.on("call_error", (data) => {
      showError(data.message);
    });
  }

  emitTyping(receiverId: string, conversationId: string) {
    this.socket?.emit("typing", { receiverId, conversationId });
  }

  emitStopTyping(receiverId: string, conversationId: string) {
    this.socket?.emit("stop_typing", { receiverId, conversationId });
  }

  emitMessageSeen(senderId: string, conversationId: string) {
    this.socket?.emit("message_seen", { senderId, conversationId });
  }

  emitJoinCallRoom(appointmentId: string) {
    console.log("[Socket] Joining call room:", appointmentId);
    this.socket?.emit("join_call_room", { appointmentId });
  }

  emitStartCall(appointmentId: string, userId: string, doctorName: string, receiverId: string) {
    this.socket?.emit("start_call", { appointmentId, userId, doctorName, receiverId });
  }

  emitAcceptCall(appointmentId: string, userId: string) {
    this.socket?.emit("accept_call", { appointmentId, userId });
  }

  emitRejectCall(appointmentId: string) {
    this.socket?.emit("reject_call", { appointmentId });
  }

  getSocket() {
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
