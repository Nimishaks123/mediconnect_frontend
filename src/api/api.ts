// // import axios from "axios";
// // import type {
// //   AxiosError,
// //   InternalAxiosRequestConfig,
// //   AxiosResponse,
// // } from "axios";
// // import { AxiosHeaders } from "axios";

// // const API_BASE_URL =
// //   import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

// // export const api = axios.create({
// //   baseURL: API_BASE_URL,
// //   withCredentials: true,
// //   headers: {
// //     "Cache-Control": "no-store, no-cache, must-revalidate",
// //     Pragma: "no-cache",
// //     Expires: "0",
// //   },
// // });

// // api.interceptors.request.use((config) => {
// //   const token = localStorage.getItem("accessToken");

// //   if (token) {
// //     if (!config.headers) {
// //       config.headers = new AxiosHeaders();
// //     }

// //     (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
// //   }

// //   return config;
// // });

// // type RetryRequestConfig = InternalAxiosRequestConfig & {
// //   _retry?: boolean;
// // };

// // api.interceptors.response.use(
// //   (response: AxiosResponse) => response,

// //   async (error: AxiosError) => {
// //     const originalRequest = error.config as RetryRequestConfig;

// //     if (error.response?.status === 401 && !originalRequest._retry) {
// //       originalRequest._retry = true;

// //       try {
// //         const refreshResponse = await axios.post(
// //           `${API_BASE_URL}/auth/refresh`,
// //           {},
// //           { withCredentials: true }
// //         );

// //         const newAccessToken = refreshResponse.data.accessToken;

// //         localStorage.setItem("accessToken", newAccessToken);

// //         if (!originalRequest.headers) {
// //           originalRequest.headers = new AxiosHeaders();
// //         }
// //         (originalRequest.headers as AxiosHeaders).set(
// //           "Authorization",
// //           `Bearer ${newAccessToken}`
// //         );

// //         return api(originalRequest);
// //       } catch (refreshError) {
// //         localStorage.removeItem("accessToken");
// //         localStorage.removeItem("currentUser");
// //         return Promise.reject(refreshError);
// //       }
// //     }

// //     return Promise.reject(error);
// //   }
// // );
// import axios from "axios";
// import type {
//   AxiosError,
//   AxiosResponse,
//   InternalAxiosRequestConfig,
// } from "axios";
// import { AxiosHeaders } from "axios";

// /* =====================================================
//    API BASE URL
// ===================================================== */
// const API_BASE_URL =
//   import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

// /* =====================================================
//    AXIOS INSTANCE
// ===================================================== */
// export const api = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true,
//   headers: {
//     "Cache-Control": "no-store, no-cache, must-revalidate",
//     Pragma: "no-cache",
//     Expires: "0",
//   },
// });

// /* =====================================================
//    REQUEST INTERCEPTOR
// ===================================================== */
// api.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const token = localStorage.getItem("accessToken");

//     if (!config.headers) {
//       config.headers = new AxiosHeaders();
//     }

//     // 🔐 Attach JWT token
//     if (token) {
//       (config.headers as AxiosHeaders).set(
//         "Authorization",
//         `Bearer ${token}`
//       );
//     }

//     // 🚫 IMPORTANT: Disable cache for ALL GET requests
//     if (config.method === "get") {
//       (config.headers as AxiosHeaders).set("Cache-Control", "no-store");
//       (config.headers as AxiosHeaders).set("Pragma", "no-cache");
//       (config.headers as AxiosHeaders).set("Expires", "0");
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// /* =====================================================
//    RESPONSE INTERCEPTOR (TOKEN REFRESH)
// ===================================================== */
// type RetryRequestConfig = InternalAxiosRequestConfig & {
//   _retry?: boolean;
// };

// api.interceptors.response.use(
//   (response: AxiosResponse) => response,

//   async (error: AxiosError) => {
//     const originalRequest = error.config as RetryRequestConfig;

//     // 🔁 Auto refresh token on 401
//     if (error.response?.status === 401 && !originalRequest?._retry) {
//       originalRequest._retry = true;

//       try {
//         const refreshResponse = await axios.post(
//           `${API_BASE_URL}/auth/refresh`,
//           {},
//           { withCredentials: true }
//         );

//         const newAccessToken = refreshResponse.data.accessToken;

//         // 💾 Save new token
//         localStorage.setItem("accessToken", newAccessToken);

//         if (!originalRequest.headers) {
//           originalRequest.headers = new AxiosHeaders();
//         }

//         (originalRequest.headers as AxiosHeaders).set(
//           "Authorization",
//           `Bearer ${newAccessToken}`
//         );

//         return api(originalRequest);
//       } catch (refreshError) {
//         // 🔓 Logout on refresh failure
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("currentUser");
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

import axios from "axios";
import { AxiosHeaders } from "axios";
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/* ================= REQUEST ================= */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  const isAuthRoute =
    config.url?.includes("/auth/login") ||
    config.url?.includes("/auth/refresh");

  if (!isAuthRoute && token) {
    config.headers = config.headers ?? new AxiosHeaders();
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

/* ================= RESPONSE ================= */
type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers = originalRequest.headers ?? new AxiosHeaders();
        originalRequest.headers.set(
          "Authorization",
          `Bearer ${newAccessToken}`
        );

        return api(originalRequest);
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("currentUser");
      }
    }

    return Promise.reject(error);
  }
);
