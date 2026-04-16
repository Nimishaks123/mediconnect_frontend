import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CallState {
  incomingCall: {
    appointmentId: string;
    callerName: string;
  } | null;
  status: "idle" | "calling" | "ongoing" | "ending";
}

const initialState: CallState = {
  incomingCall: null,
  status: "idle"
};

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    setIncomingCall: (state, action: PayloadAction<CallState["incomingCall"]>) => {
      state.incomingCall = action.payload;
    },
    clearIncomingCall: (state) => {
      state.incomingCall = null;
    },
    setCallStatus: (state, action: PayloadAction<CallState["status"]>) => {
      state.status = action.payload;
    }
  }
});

export const { setIncomingCall, clearIncomingCall, setCallStatus } = callSlice.actions;
export default callSlice.reducer;
