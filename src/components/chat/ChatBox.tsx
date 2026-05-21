import React, {
  useState,
  useEffect,
  useRef
} from "react";

import { useNavigate }
from "react-router-dom";

import {
  useAppDispatch,
  useAppSelector
} from "../../store/hooks";

import {
  fetchMessages,
  sendMessage,
  clearMessages,
  setActiveConversation,
  markConversationAsRead
} from "../../store/chat/chatSlice";

import {
  selectCurrentUser
} from "../../store/auth/authSlice";

import {
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  CheckBadgeIcon,
  VideoCameraIcon
} from "@heroicons/react/24/solid";

import { socketService }
from "../../services/socketService";

import { ROLES }
from "../../constants/roles";

import {
  setCallStatus
} from "../../store/call/callSlice";

import {
  showError
} from "../../utils/toastUtils";

const formatDate = (
  date: Date,
  options: Intl.DateTimeFormatOptions
) => {

  return new Intl.DateTimeFormat(
    "en-US",
    options
  ).format(date);
};

const getComparisonDate =
  (date: Date) => {

    return date
      .toISOString()
      .split("T")[0];
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

const ChatBox: React.FC<ChatBoxProps> = ({
  receiverId,
  receiverName,
  conversationId,
  appointment
}) => {

  const navigate =
    useNavigate();

  const dispatch =
    useAppDispatch();

  const user =
    useAppSelector(
      selectCurrentUser
    );

  const {
    messages,
    loading,
    typingUsers,
    recipientOnline
  } = useAppSelector(
    (state) => state.chat
  );

  const [content, setContent] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const typingTimeoutRef =
    useRef<any>(null);

  const isTyping =
    typingUsers[conversationId] || false;

  const scrollToBottom =
    (
      behavior:
        ScrollBehavior = "smooth"
    ) => {

      messagesEndRef.current
        ?.scrollIntoView({
          behavior
        });
    };

  useEffect(() => {

    if (conversationId) {

      dispatch(
        setActiveConversation(
          conversationId
        )
      );

      dispatch(
        clearMessages()
      );

      dispatch(
        fetchMessages(
          conversationId
        )
      );

      dispatch(
        markConversationAsRead(
          conversationId
        )
      );

      socketService.emitMessageSeen(
        receiverId,
        conversationId
      );

      socketService.emitJoinCallRoom(
        conversationId
      );
    }

  }, [
    dispatch,
    conversationId,
    receiverId
  ]);

  useEffect(() => {

    scrollToBottom(
      messages.length <= 1
        ? "auto"
        : "smooth"
    );

    if (
      messages.length > 0 &&
      messages[
        messages.length - 1
      ].senderId !== user?.id
    ) {

      dispatch(
        markConversationAsRead(
          conversationId
        )
      );

      socketService.emitMessageSeen(
        receiverId,
        conversationId
      );
    }

  }, [
    messages,
    dispatch,
    conversationId,
    receiverId,
    user?.id
  ]);

  const handleInputChange =
    (
      e:
        React.ChangeEvent<HTMLInputElement>
    ) => {

      setContent(
        e.target.value
      );

      socketService.emitTyping(
        receiverId,
        conversationId
      );

      if (
        typingTimeoutRef.current
      ) {

        clearTimeout(
          typingTimeoutRef.current
        );
      }

      typingTimeoutRef.current =
        setTimeout(() => {

          socketService.emitStopTyping(
            receiverId,
            conversationId
          );

        }, 2000);
    };

  const handleFileSelect =
    (
      e:
        React.ChangeEvent<HTMLInputElement>
    ) => {

      const file =
        e.target.files?.[0];

      if (!file) return;

      setSelectedFile(file);
    };

  const uploadAttachment =
    async (): Promise<{
      url: string;
      type: string;
    } | null> => {

      if (!selectedFile)
        return null;

      try {

        setUploading(true);

        const formData =
          new FormData();

        formData.append(
          "file",
          selectedFile
        );

        formData.append(

  "upload_preset",

  import.meta.env
    .VITE_CLOUDINARY_UPLOAD_PRESET
);

const res =
  await fetch(

    `https://api.cloudinary.com/v1_1/${
      import.meta.env
        .VITE_CLOUDINARY_CLOUD_NAME
    }/auto/upload`,

    {
      method: "POST",
      body: formData
    }
  );

        const data =
          await res.json();

        return {

          url:
            data.secure_url,

          type:
            selectedFile.type
        };

      } catch (error) {

        console.error(
          "Upload failed",
          error
        );

        return null;

      } finally {

        setUploading(false);
      }
    };

  const handleSend =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      if (
        !content.trim() &&
        !selectedFile
      ) return;

      if (
        !receiverId ||
        !conversationId
      ) return;

      if (
        typingTimeoutRef.current
      ) {

        clearTimeout(
          typingTimeoutRef.current
        );
      }

      socketService.emitStopTyping(
        receiverId,
        conversationId
      );

      const messageContent =
        content.trim();

      setContent("");

      let attachmentData =
        null;

      if (selectedFile) {

        attachmentData =
          await uploadAttachment();
      }

      await dispatch(
        sendMessage({

          receiverId,

          conversationId,

          content:
            messageContent,

          attachmentUrl:
            attachmentData?.url,

          attachmentType:
            attachmentData?.type
        })
      );

      setSelectedFile(null);

      window.dispatchEvent(
        new Event(
          "new_message_received"
        )
      );
    };

  const handleVideoCall =
    () => {

      if (
        user?.role ===
        ROLES.DOCTOR
      ) {

        socketService.emitStartCall(
          conversationId,
          user.id,
          user.name,
          receiverId
        );

        dispatch(
          setCallStatus(
            "calling"
          )
        );

        navigate(
          `/call/${conversationId}`
        );

      } else {

        showError(
          "Only doctors can initiate a video consultation."
        );
      }
    };

  if (!conversationId)
    return null;

  return (

    <div className="flex flex-col h-[600px] w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 font-sans mt-8 ring-1 ring-gray-900/5 animate-in fade-in zoom-in duration-300">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-mediconnect-green to-mediconnect-green-dark px-6 py-4 flex items-center justify-between shadow-md z-20 relative">

        <div className="flex items-center gap-4">

          <div className="relative">

            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white font-black text-xl border border-white/30 backdrop-blur-xl shadow-inner">

              {receiverName
                .charAt(0)
                .toUpperCase()}

            </div>

            {recipientOnline && (

              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-sky-400 border-2 border-mediconnect-green rounded-full shadow-sm animate-pulse"></span>
            )}

          </div>

          <div>

            <h3 className="text-white font-black text-base tracking-tight leading-none mb-1 uppercase italic">

              {receiverName}

            </h3>

            <span className="text-white/60 text-[9px] font-black uppercase tracking-[0.2em]">

              {recipientOnline
                ? "Online"
                : "Offline"}

            </span>

          </div>

        </div>

        <button
          onClick={
            handleVideoCall
          }
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl border border-white/20"
        >

          <VideoCameraIcon className="w-5 h-5 text-white" />

        </button>

      </div>

      {/* MESSAGES */}

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">

        {messages.map(
          (msg, index) => {
            console.log(
  "CHAT MESSAGE:",
  msg
);

            const isMe =
              msg.senderId ===
              user?.id;

            const dateObj =
              new Date(
                msg.createdAt
              );

            return (

              <div
                key={
                  msg.id || index
                }
                className={`flex ${
                  isMe
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[85%] sm:max-w-[70%] px-5 py-3.5 rounded-3xl text-sm font-bold leading-relaxed shadow-sm ${
                    isMe
                      ? "bg-mediconnect-green text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                  }`}
                >

                  {msg.content && (

                    <p>
                      {msg.content}
                    </p>
                  )}

                  {/* IMAGE */}

                  {msg.attachmentType?.startsWith(
                    "image"
                  ) && (

                    <img
                      src={
                        msg.attachmentUrl
                      }
                      alt="attachment"
                      className="rounded-2xl mt-3 max-w-[240px]"
                    />
                  )}

                  {/* PDF */}

                  {msg.attachmentType ===
                    "application/pdf" && (

                    <a
                      href={
                        msg.attachmentUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-3 text-blue-200 underline font-bold"
                    >
                      View PDF
                    </a>
                  )}

                  <div className={`text-[10px] mt-2 font-black flex items-center gap-1 opacity-60 ${
                    isMe
                      ? "justify-end"
                      : ""
                  }`}>

                    {formatDate(
                      dateObj,
                      {
                        hour:
                          "2-digit",
                        minute:
                          "2-digit",
                        hour12: false
                      }
                    )}

                    {isMe && (

                      <span className="ml-1">

                        {msg.status ===
                        "seen" ? (

                          <CheckBadgeIcon className="w-3 h-3 text-sky-200" />

                        ) : (

                          <CheckIcon className="w-3 h-3 text-white/40" />
                        )}

                      </span>
                    )}

                  </div>

                </div>

              </div>
            );
          }
        )}

        <div ref={messagesEndRef} />

      </div>

      {/* FOOTER */}

      <div className="p-5 bg-white border-t border-gray-100">

        {selectedFile && (

          <div className="px-4 pb-2 text-xs text-gray-500 font-semibold">

            Selected:
            {selectedFile.name}

          </div>
        )}

        <form
          onSubmit={handleSend}
          className="flex gap-3 bg-gray-50 p-2 rounded-2xl items-center"
        >

          {/* FILE PICKER */}

          <label className="cursor-pointer px-3">

            <input
              type="file"
              hidden
              onChange={
                handleFileSelect
              }
            />

            <span className="text-xl">
              📎
            </span>

          </label>

          {/* INPUT */}

          <input
            type="text"
            value={content}
            onChange={
              handleInputChange
            }
            placeholder="Secure message..."
            className="flex-1 bg-transparent px-4 py-3 outline-none text-sm font-bold text-gray-700"
          />

          {/* SEND */}

          <button
            type="submit"

            disabled={
              (
                !content.trim() &&
                !selectedFile
              ) ||
              !receiverId ||
              uploading
            }

            className="bg-mediconnect-green text-white px-5 py-3 rounded-xl hover:bg-mediconnect-green-dark transition-all disabled:opacity-20"
          >

            <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />

          </button>

        </form>

      </div>

    </div>
  );
};

export default ChatBox;