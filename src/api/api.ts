import axios from "axios";
import { AxiosHeaders } from "axios";
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { showError } from "../utils/toastUtils";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/* ================= REQUEST ================= */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  // Don't add token for auth routes where it's not needed or could cause issues
  const skipAuth = 
    config.url?.includes("/auth/login") || 
    config.url?.includes("/auth/refresh") ||
    config.url?.includes("/auth/verify-otp");

  if (!skipAuth && token) {
    config.headers = config.headers ?? new AxiosHeaders();
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

/* ================= RESPONSE ================= */
type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.set("Authorization", `Bearer ${token}`);
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = refreshResponse.data;
        localStorage.setItem("accessToken", accessToken);

        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers.set("Authorization", `Bearer ${accessToken}`);

        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Clear auth data and force redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("currentUser");
        
        // Optional: you could trigger a page reload or a redirect here if not handled by ProtectedRoute
        if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
           window.location.href = "/login";
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Global error handler for other errors
    if (error.response?.status !== 102 && error.response?.status !== 401) {
       const message = (error.response?.data as any)?.message || (error.response?.data as any)?.error || "Something went wrong";
       // Only show toast if it's not a background check or specific omitted error
       if (!originalRequest.url?.includes("/notifications/unread-count")) {
          showError(message);
       }
    }

    return Promise.reject(error);
  }
);
