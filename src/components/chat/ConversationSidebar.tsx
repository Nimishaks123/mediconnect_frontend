import React, { useEffect, useState } from "react";
import { api } from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

export default function ConversationSidebar() {
  const [conversations, setConversations] = useState<any[]>([]);
  const { conversationId: activeId } = useParams<{ conversationId: string }>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get("/chat/conversations");
        setConversations(res.data);
      } catch (err) {
        console.error("Failed to fetch conversations", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [activeId]);

  return (
    <div className="w-[350px] bg-white border-r border-gray-100 h-[600px] flex flex-col rounded-l-3xl shadow-sm">
      <div className="p-6 border-b border-gray-50 bg-gray-50/50 rounded-tl-3xl">
        <h2 className="text-sm font-black text-gray-800 uppercase tracking-[0.2em] italic">Consultations</h2>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 opacity-60">Active Sessions</p>
      </div>

      <div className="flex-1 overflow-y-auto customize-scrollbar p-2">
        {loading ? (
          <div className="space-y-4 p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40">
             <ChatBubbleLeftIcon className="w-8 h-8 mb-2" />
             <p className="text-[10px] font-black uppercase tracking-widest">No active chats</p>
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conv) => (
              <div
                key={conv.conversationId}
                onClick={() => navigate(`/chat/${conv.conversationId}`)}
                className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
                  activeId === conv.conversationId 
                    ? "bg-mediconnect-green/5 shadow-inner" 
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="relative">
                  {conv.peer.photo ? (
                    <img src={conv.peer.photo} alt={conv.peer.name} className="w-11 h-11 rounded-xl object-cover border border-white shadow-sm" />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-black text-gray-400 shadow-sm border border-white">
                      {conv.peer.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <p className={`text-[11px] font-black uppercase tracking-tight truncate ${activeId === conv.conversationId ? 'text-mediconnect-green' : 'text-gray-800'}`}>
                      {conv.peer.name}
                    </p>
                    <span className="text-[8px] font-bold text-gray-300">
                       {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium truncate italic leading-relaxed">
                    {conv.lastMessage.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
