import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../api/api";

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  content: string;
  createdAt: string;
  status: "sent" | "delivered" | "seen";
}

interface ChatState {
  messages: Message[];
  activeConversationId: string | null;
  typingUsers: Record<string, boolean>; // conversationId -> isTyping
  recipientOnline: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  activeConversationId: null,
  typingUsers: {},
  recipientOnline: false,
  loading: false,
  error: null,
};

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (conversationId: string) => {
    const response = await api.get(`/chat/messages/${conversationId}`);
    return { conversationId, messages: response.data };
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (data: { receiverId: string; conversationId: string; content: string }) => {
    const response = await api.post("/chat/messages", data);
    return response.data;
  }
);

export const markConversationAsRead = createAsyncThunk(
  "chat/markAsRead",
  async (conversationId: string) => {
    await api.patch(`/chat/read/${conversationId}`);
    return conversationId;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
      if (action.payload === null) {
        state.messages = [];
        state.recipientOnline = false;
      }
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const msg = action.payload;
      if (state.activeConversationId === msg.conversationId) {
        if (!state.messages.find((m) => m.id === msg.id)) {
          state.messages.push(msg);
        }
      }
    },
    updateMessageStatus: (state, action: PayloadAction<{ conversationId: string; status: "seen" }>) => {
      if (state.activeConversationId === action.payload.conversationId) {
        state.messages = state.messages.map(m => ({ ...m, status: action.payload.status }));
      }
    },
    setUserTyping: (state, action: PayloadAction<{ conversationId: string; isTyping: boolean }>) => {
      state.typingUsers[action.payload.conversationId] = action.payload.isTyping;
    },
    setRecipientOnline: (state, action: PayloadAction<boolean>) => {
      state.recipientOnline = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
        state.activeConversationId = action.payload.conversationId;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch messages";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        if (state.activeConversationId === action.payload.conversationId) {
          if (!state.messages.find((m) => m.id === action.payload.id)) {
            state.messages.push(action.payload);
          }
        }
      });
  },
});

export const { 
  addMessage, 
  clearMessages, 
  setActiveConversation, 
  setUserTyping, 
  setRecipientOnline, 
  updateMessageStatus 
} = chatSlice.actions;

export default chatSlice.reducer;
