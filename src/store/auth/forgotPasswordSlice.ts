import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { forgotPasswordApi } from "../../api/forgotPasswordApi";
import type { AxiosError } from "axios";

export interface ForgotPasswordState {
  email: string | null;
  loading: boolean;
  error: string | null;
  otpSent: boolean;
  otpVerified: boolean;
  passwordReset: boolean;
}

const initialState: ForgotPasswordState = {
  email: null,
  loading: false,
  error: null,
  otpSent: false,
  otpVerified: false,
  passwordReset: false,
};


export const sendForgotPasswordOtp = createAsyncThunk(
  "forgotPassword/sendOtp",
  async (email: string, { rejectWithValue }) => {
    try {
      const res = await forgotPasswordApi.sendOtp(email);
     
      return { email, message: res.data?.message };
    } catch (err) {
      const error = err as AxiosError<{ error?: string }>;
      return rejectWithValue(error.response?.data?.error || "Failed to send OTP");
    }
  }
);


export const verifyForgotPasswordOtp = createAsyncThunk(
  "forgotPassword/verifyOtp",
  async (
    payload: { email: string; code: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await forgotPasswordApi.verifyOtp(payload.email, payload.code);
      return res.data;
    } catch (err) {
          const error = err as AxiosError<{ error?: string }>;
      return rejectWithValue(error.response?.data?.error || "Invalid OTP");
    }
  }
);


export const resetPassword = createAsyncThunk(
  "forgotPassword/reset",
  async (
    payload: { email: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await forgotPasswordApi.resetPassword(
        payload.email,
        payload.newPassword
      );
      return res.data;
    } catch (err) {
          const error = err as AxiosError<{ error?: string }>;
      return rejectWithValue(
        error.response?.data?.error || "Failed to reset password"
      );
    }
  }
);

export const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    clearForgotState: (state) => {
      state.error = null;
      state.loading = false;
      state.otpSent = false;
      state.otpVerified = false;
      state.passwordReset = false;
      state.email = null;
    },
    clearForgotError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
   
    builder
      .addCase(sendForgotPasswordOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendForgotPasswordOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.email = action.payload.email;
      })
      .addCase(sendForgotPasswordOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

   
    builder
      .addCase(verifyForgotPasswordOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyForgotPasswordOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpVerified = true;
      })
      .addCase(verifyForgotPasswordOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });


    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordReset = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearForgotState, clearForgotError } =
  forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;
