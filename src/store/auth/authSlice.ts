import {jwtDecode} from "jwt-decode";

import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

import { authService } from "../../services/authService";
import { adminAuthApi } from "../../api/adminAuthApi";
import type { RootState } from "../index";

export type Role = "PATIENT" | "DOCTOR" | "ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  onboardingStatus?: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  isInitialized: boolean;
}

interface JwtPayload {
  id: string;
  name?: string;
  email: string;
  role: Role;
  onboardingStatus?: string;
  exp?: number;
}

const getInitialUser = (): AuthUser | null => {
  const storedUser = localStorage.getItem("currentUser");
  if (!storedUser) return null;
  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: getInitialUser(),
  accessToken: localStorage.getItem("accessToken"),
  status: "idle",
  error: null,
  isInitialized: false,
};

export const loginUser = createAsyncThunk<
  { user: AuthUser; accessToken: string; remember: boolean },
  { email: string; password: string; remember: boolean },
  { rejectValue: string }
>("auth/loginUser", async ({ email, password, remember }, { rejectWithValue }) => {
  try {
    const response = await authService.login(email, password);
    const { accessToken, user } = response;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("currentUser", JSON.stringify(user));

    if (remember) {
      localStorage.setItem("rememberedEmail", email);
    }

    return { user, accessToken, remember };
  } catch (error) {
    const axiosErr = error as AxiosError<{ error: string }>;
    const msg = axiosErr.response?.data?.error || "Login failed";
    return rejectWithValue(msg);
  }
});

export const loginAdmin = createAsyncThunk<
  { admin: AuthUser; accessToken: string },
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginAdmin", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await adminAuthApi.login(email, password);
    const { accessToken, admin } = response.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("currentUser", JSON.stringify(admin));

    return { admin, accessToken };
   } catch (error: unknown) {
  const axiosErr = error as AxiosError<{ message: string }>;
  const msg = axiosErr.response?.data?.message || "Admin login failed";
  return rejectWithValue(msg);
}
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setInitialized: (state) => {
      state.isInitialized = true;
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.status = "idle";
      state.error = null;

      localStorage.removeItem("currentUser");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("rememberedEmail");
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.status = "succeeded";

      localStorage.setItem("currentUser", JSON.stringify(action.payload.user));
      localStorage.setItem("accessToken", action.payload.accessToken);
    },
    loadUserFromToken: (state, action: PayloadAction<string>) => {
      try {
        const token = action.payload;
        const decoded = jwtDecode<JwtPayload>(token);

        // Check expiration
        const now = Date.now() / 1000;
        if (decoded.exp && decoded.exp < now) {
          throw new Error("Token expired");
        }

        const storedUserStr = localStorage.getItem("currentUser");
        let onboardingStatus = decoded.onboardingStatus;

        if (storedUserStr) {
          try {
            const storedUser = JSON.parse(storedUserStr);
            if (storedUser.id === decoded.id && storedUser.onboardingStatus) {
              onboardingStatus = storedUser.onboardingStatus;
            }
          } catch (e) {}
        }

        state.user = {
          id: decoded.id,
          name: decoded.name ?? "",
          email: decoded.email,
          role: decoded.role,
          onboardingStatus,
        };

        state.accessToken = token;
        state.isInitialized = true;
      } catch (error) {
        state.user = null;
        state.accessToken = null;
        state.isInitialized = true;

        localStorage.removeItem("accessToken");
        localStorage.removeItem("currentUser");
      }
    },
    setOnboardingStatus: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.onboardingStatus = action.payload;
        localStorage.setItem("currentUser", JSON.stringify(state.user));
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isInitialized = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Login failed";
      });

    builder
      .addCase(loginAdmin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.admin;
        state.accessToken = action.payload.accessToken;
        state.isInitialized = true;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Admin login failed";
      });
  },
});

export const { 
  updateAccessToken, 
  logout, 
  setCredentials, 
  loadUserFromToken, 
  setOnboardingStatus, 
  clearError,
  setInitialized 
} = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsInitialized = (state: RootState) => state.auth.isInitialized;

export default authSlice.reducer;
