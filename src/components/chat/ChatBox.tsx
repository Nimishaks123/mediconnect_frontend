import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchMessages, sendMessage, clearMessages, setActiveConversation, markConversationAsRead } from "../../store/chat/chatSlice";
import { selectCurrentUser } from "../../store/auth/authSlice";
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon, CheckIcon, CheckBadgeIcon, VideoCameraIcon } from "@heroicons/react/24/solid";
import { socketService } from "../../services/socketService";
import { ROLES } from "../../constants/roles";
import { setCallStatus } from "../../store/call/callSlice";
import { showError } from "../../utils/toastUtils";

const formatDate = (date: Date, options: Intl.DateTimeFormatOptions) => {
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

const getComparisonDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

interface ChatBoxProps {
  receiverId: string;
  receiverName: string;
  conversationId: string;
  appointment?: {
    date: string;
    startTime: string;
    endTime: string;
  };
}

const ChatBox: React.FC<ChatBoxProps> = ({ receiverId, receiverName, conversationId, appointment }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const { messages, loading, typingUsers, recipientOnline } = useAppSelector((state) => state.chat);
  const [content, setContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any>(null);

  const isTyping = typingUsers[conversationId] || false;

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (conversationId) {
      dispatch(setActiveConversation(conversationId));
      dispatch(clearMessages());
      dispatch(fetchMessages(conversationId));
      dispatch(markConversationAsRead(conversationId));
      socketService.emitMessageSeen(receiverId, conversationId);
      socketService.emitJoinCallRoom(conversationId);
    }
  }, [dispatch, conversationId, receiverId]);

  useEffect(() => {
    scrollToBottom(messages.length <= 1 ? "auto" : "smooth");
    if (messages.length > 0 && messages[messages.length - 1].senderId !== user?.id) {
       dispatch(markConversationAsRead(conversationId));
       socketService.emitMessageSeen(receiverId, conversationId);
    }
  }, [messages, dispatch, conversationId, receiverId, user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
    socketService.emitTyping(receiverId, conversationId);
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketService.emitStopTyping(receiverId, conversationId);
    }, 2000);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageContent = content.trim();
    if (!messageContent || !receiverId || !conversationId) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socketService.emitStopTyping(receiverId, conversationId);
    
    setContent("");
    await dispatch(sendMessage({ receiverId, conversationId, content: messageContent }));
  };

  const handleVideoCall = () => {
    if (user?.role === ROLES.DOCTOR) {
      socketService.emitStartCall(conversationId, user.id, user.name, receiverId);
      dispatch(setCallStatus("calling"));
      navigate(`/call/${conversationId}`);
    } else {
      showError("Only doctors can initiate a video consultation.");
    }
  };

  if (!conversationId) return null;

  return (
    <div className="flex flex-col h-[600px] w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 font-sans mt-8 ring-1 ring-gray-900/5 animate-in fade-in zoom-in duration-300">
      <div className="bg-gradient-to-r from-mediconnect-green to-mediconnect-green-dark px-6 py-4 flex items-center justify-between shadow-md z-20 relative">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white font-black text-xl border border-white/30 backdrop-blur-xl shadow-inner">
              {receiverName.charAt(0).toUpperCase()}
            </div>
            {recipientOnline && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-sky-400 border-2 border-mediconnect-green rounded-full shadow-sm animate-pulse"></span>
            )}
          </div>
          <div>
            <h3 className="text-white font-black text-base tracking-tight leading-none mb-1 uppercase italic">
              {receiverName}
              {recipientOnline && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-sky-300 shadow-sm shadow-sky-400/50"></span>}
            </h3>
            {appointment ? (
              <div className="flex items-center gap-2 text-[9px] font-black text-white/70 uppercase tracking-widest">
                <span>{appointment.date}</span>
                <span className="w-1 h-1 rounded-full bg-white/30"></span>
                <span>{appointment.startTime} - {appointment.endTime}</span>
              </div>
            ) : (
              <span className="text-white/60 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                {isTyping ? (
                  <span className="text-white animate-pulse lowercase italic tracking-normal">typing...</span>
                ) : (
                  <>
                    <span className={`w-1.5 h-1.5 rounded-full ${recipientOnline ? 'bg-sky-300 animate-pulse' : 'bg-white/20'}`}></span>
                    {recipientOnline ? 'Online' : 'Offline'}
                  </>
                )}
              </span>
            )}
          </div>
        </div>
        <button 
          onClick={handleVideoCall}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl border border-white/20 backdrop-blur-md transition-all active:scale-95 group"
          title="Start Video Consultation"
        >
          <VideoCameraIcon className="w-5 h-5 text-white" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest hidden sm:inline">Video Call</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30 scroll-smooth relative">
        {loading && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 animate-pulse">
             <div className="w-10 h-10 border-4 border-mediconnect-green/20 border-t-mediconnect-green rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-5">
             <ChatBubbleLeftRightIcon className="w-10 h-10 text-mediconnect-green/20" />
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No messages yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg, index) => {
              const isMe = msg.senderId === user?.id;
              const dateObj = new Date(msg.createdAt);
              const showDate = index === 0 || getComparisonDate(new Date(messages[index-1].createdAt)) !== getComparisonDate(dateObj);

              return (
                <div key={msg.id || index} className="space-y-4">
                  {showDate && (
                    <div className="flex justify-center my-8">
                      <span className="px-4 py-1.5 bg-white/80 backdrop-blur-md rounded-xl text-[9px] font-black text-gray-500 border border-gray-100 uppercase tracking-[0.25em] shadow-sm">
                        {formatDate(dateObj, { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] sm:max-w-[70%] px-5 py-3.5 rounded-3xl text-sm font-bold leading-relaxed transition-all shadow-sm ${
                      isMe 
                        ? "bg-mediconnect-green text-white rounded-br-none" 
                        : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                    }`}>
                      {msg.content}
                      <div className={`text-[10px] mt-2 font-black flex items-center gap-1 opacity-60 ${isMe ? "justify-end" : ""}`}>
                        {formatDate(dateObj, { hour: '2-digit', minute: '2-digit', hour12: false })}
                        {isMe && (
                          <span className="ml-1">
                            {msg.status === "seen" ? (
                              <CheckBadgeIcon className="w-3 h-3 text-sky-200" />
                            ) : (
                              <CheckIcon className="w-3 h-3 text-white/40" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-5 bg-white border-t border-gray-100 shadow-[0_-15px_30px_rgba(0,0,0,0.02)] z-10">
        {isTyping && (
           <div className="px-5 py-2 text-[9px] font-black text-mediconnect-green uppercase tracking-widest italic animate-pulse">
              Recipient is typing...
           </div>
        )}
        <form onSubmit={handleSend} className="flex gap-3 bg-gray-50 hover:bg-white p-2 rounded-2xl items-center border border-transparent focus-within:border-gray-100 group transition-all">
          <input
            type="text"
            value={content}
            onChange={handleInputChange}
            placeholder="Secure message..."
            className="flex-1 bg-transparent px-4 py-3 outline-none text-sm font-bold text-gray-700"
          />
          <button
            type="submit"
            disabled={!content.trim() || !receiverId}
            className="bg-mediconnect-green text-white px-5 py-3 rounded-xl hover:bg-mediconnect-green-dark transition-all disabled:opacity-20 shadow-lg shadow-mediconnect-green/20 active:scale-95 group-hover:shadow-mediconnect-green/30"
          >
            <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
