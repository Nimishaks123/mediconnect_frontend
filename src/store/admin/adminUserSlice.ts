// // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // import type { AxiosError } from "axios";

// // import { adminUserApi } from "../../api/adminUserApi";
// // import type { AdminUser } from "../../api/adminUserApi";

// // /* -------------------- STATE -------------------- */
// // interface AdminUserState {
// //   users: AdminUser[];
// //   loading: boolean;
// //   error: string | null;
// // }

// // const initialState: AdminUserState = {
// //   users: [],
// //   loading: false,
// //   error: null,
// // };

// // /* -------------------- FETCH ALL USERS -------------------- */
// // export const fetchAllUsers = createAsyncThunk<
// //   AdminUser[],
// //   void,
// //   { rejectValue: string }
// // >("adminUsers/fetchAll", async (_, { rejectWithValue }) => {
// //   try {
// //     const res = await adminUserApi.getAllUsers();
// //     return res.data.users;
// //   } catch (error: unknown) {
// //     const err = error as AxiosError<{ message?: string }>;
// //     return rejectWithValue(
// //       err.response?.data?.message || "Unable to fetch users"
// //     );
// //   }
// // });

// // /* -------------------- BLOCK USER -------------------- */
// // export const blockUser = createAsyncThunk<
// //   string,
// //   string,
// //   { rejectValue: string }
// // >("adminUsers/block", async (userId, { rejectWithValue }) => {
// //   try {
// //     await adminUserApi.blockUser(userId);
// //     return userId;
// //   } catch (error: unknown) {
// //     const err = error as AxiosError<{ message?: string }>;
// //     return rejectWithValue(
// //       err.response?.data?.message || "Failed to block user"
// //     );
// //   }
// // });

// // /* -------------------- UNBLOCK USER -------------------- */
// // export const unblockUser = createAsyncThunk<
// //   string,
// //   string,
// //   { rejectValue: string }
// // >("adminUsers/unblock", async (userId, { rejectWithValue }) => {
// //   try {
// //     await adminUserApi.unblockUser(userId);
// //     return userId;
// //   } catch (error: unknown) {
// //     const err = error as AxiosError<{ message?: string }>;
// //     return rejectWithValue(
// //       err.response?.data?.message || "Failed to unblock user"
// //     );
// //   }
// // });

// // /* -------------------- SLICE -------------------- */
// // const adminUserSlice = createSlice({
// //   name: "adminUsers",
// //   initialState,
// //   reducers: {},
// //   extraReducers: (builder) => {
// //     builder
// //       // FETCH USERS
// //       .addCase(fetchAllUsers.pending, (state) => {
// //         state.loading = true;
// //         state.error = null;
// //       })
// //       .addCase(fetchAllUsers.fulfilled, (state, { payload }) => {
// //         state.loading = false;
// //         state.users = payload;
// //       })
// //       .addCase(fetchAllUsers.rejected, (state, { payload }) => {
// //         state.loading = false;
// //         state.error = payload ?? "Failed to load users";
// //       })

// //       // BLOCK USER
// //       .addCase(blockUser.fulfilled, (state, { payload: userId }) => {
// //         state.users = state.users.map((u) =>
// //           u.id === userId ? { ...u, blocked: true } : u
// //         );
// //       })

// //       // UNBLOCK USER
// //       .addCase(unblockUser.fulfilled, (state, { payload: userId }) => {
// //         state.users = state.users.map((u) =>
// //           u.id === userId ? { ...u, blocked: false } : u
// //         );
// //       });
// //   },
// // });

// // export default adminUserSlice.reducer;
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import type { AxiosError } from "axios";

// import { adminUserApi } from "../../api/adminUserApi";
// import type { AdminUser } from "../../api/adminUserApi";

// /* -------------------- STATE -------------------- */
// interface AdminUserState {
//   users: AdminUser[];
//   page: number;
//   limit: number;
//   total: number;
//   loading: boolean;
//   error: string | null;
// }


// const initialState: AdminUserState = {
//   users: [],
//   page: 1,
//   limit: 6,
//   total: 0,
//   loading: false,
//   error: null,
// };


// import axios from "axios";

// export const fetchAllUsers = createAsyncThunk<
//   { users: AdminUser[]; total: number; page: number; limit: number },
//   { page: number; limit: number; search: string },
//   { rejectValue: string }
// >(
//   "adminUsers/fetchAll",
//   async ({ page, limit, search }, { rejectWithValue }) => {
//     try {
//       const res = await adminUserApi.getAllUsers({
//         page,
//         limit,
//         search,
//       });

//       return {
//         users: res.data.users,
//         total: res.data.total,
//         page: res.data.page,
//         limit: res.data.limit,
//       };
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         return rejectWithValue(
//           error.response?.data?.message || "Unable to fetch users"
//         );
//       }

//       return rejectWithValue("Unexpected error occurred");
//     }
//   }
// );


// /* -------------------- BLOCK USER -------------------- */
// export const blockUser = createAsyncThunk<
//   string,
//   string,
//   { rejectValue: string }
// >("adminUsers/block", async (userId, { rejectWithValue }) => {
//   try {
//     await adminUserApi.blockUser(userId);
//     return userId;
//   } catch (error: unknown) {
//     const err = error as AxiosError<{ message?: string }>;
//     return rejectWithValue(
//       err.response?.data?.message || "Failed to block user"
//     );
//   }
// });

// /* -------------------- UNBLOCK USER -------------------- */
// export const unblockUser = createAsyncThunk<
//   string,
//   string,
//   { rejectValue: string }
// >("adminUsers/unblock", async (userId, { rejectWithValue }) => {
//   try {
//     await adminUserApi.unblockUser(userId);
//     return userId;
//   } catch (error: unknown) {
//     const err = error as AxiosError<{ message?: string }>;
//     return rejectWithValue(
//       err.response?.data?.message || "Failed to unblock user"
//     );
//   }
// });

// /* -------------------- SLICE -------------------- */
// const adminUserSlice = createSlice({
//   name: "adminUsers",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // FETCH USERS
//       .addCase(fetchAllUsers.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAllUsers.fulfilled, (state, { payload }) => {
//         state.loading = false;
//         state.users = payload.users;
//         state.total = payload.total;
//         state.page = payload.page;
//         state.limit = payload.limit;
//       })
//       .addCase(fetchAllUsers.rejected, (state, { payload }) => {
//         state.loading = false;
//         state.error = payload ?? "Failed to load users";
//       })

//       // BLOCK USER (optimistic)
//       .addCase(blockUser.fulfilled, (state, { payload: userId }) => {
//         const user = state.users.find((u) => u.id === userId);
//         if (user) user.blocked = true;
//       })

//       // UNBLOCK USER (optimistic)
//       .addCase(unblockUser.fulfilled, (state, { payload: userId }) => {
//         const user = state.users.find((u) => u.id === userId);
//         if (user) user.blocked = false;
//       });
//   },
// });
// export default adminUserSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { AxiosError } from "axios";

import { adminUserApi } from "../../api/adminUserApi";
import type { AdminUser } from "../../api/adminUserApi";

/* ==================== TYPES ==================== */
export interface FetchUsersParams {
  page: number;
  limit: number;
  search: string;
  role?: string;
  status?: string;
}

interface AdminUserState {
  users: AdminUser[];
  page: number;
  limit: number;
  total: number;
  loading: boolean;
  error: string | null;
}

/* ==================== INITIAL STATE ==================== */
const initialState: AdminUserState = {
  users: [],
  page: 1,
  limit: 6,
  total: 0,
  loading: false,
  error: null,
};

/* ==================== FETCH USERS ==================== */
export const fetchAllUsers = createAsyncThunk<
  {
    users: AdminUser[];
    total: number;
    page: number;
    limit: number;
  },
  FetchUsersParams,
  { rejectValue: string }
>("adminUsers/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await adminUserApi.getAllUsers(params);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch users"
      );
    }
    return rejectWithValue("Unexpected error occurred");
  }
});

/* ==================== BLOCK USER ==================== */
export const blockUser = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("adminUsers/block", async (userId, { rejectWithValue }) => {
  try {
    await adminUserApi.blockUser(userId);
    return userId;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || "Failed to block user"
    );
  }
});

/* ==================== UNBLOCK USER ==================== */
export const unblockUser = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("adminUsers/unblock", async (userId, { rejectWithValue }) => {
  try {
    await adminUserApi.unblockUser(userId);
    return userId;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || "Failed to unblock user"
    );
  }
});

/* ==================== SLICE ==================== */
const adminUserSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* -------- FETCH USERS -------- */
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.users = payload.users;
        state.total = payload.total;
        state.page = payload.page;
        state.limit = payload.limit;
      })
      .addCase(fetchAllUsers.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload ?? "Failed to load users";
      })

      /* -------- BLOCK USER -------- */
      .addCase(blockUser.fulfilled, (state, { payload: userId }) => {
        const user = state.users.find((u) => u.id === userId);
        if (user) user.blocked = true;
      })

      /* -------- UNBLOCK USER -------- */
      .addCase(unblockUser.fulfilled, (state, { payload: userId }) => {
        const user = state.users.find((u) => u.id === userId);
        if (user) user.blocked = false;
      });
  },
});

export default adminUserSlice.reducer;
