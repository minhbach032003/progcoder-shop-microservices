import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "@/types";

// Safe localStorage access for SSR
const storedUser =
  typeof window !== "undefined"
    ? (JSON.parse(localStorage.getItem("user") || "null") as User | null)
    : null;

const initialState: AuthState = {
  user: storedUser || null,
  isAuth: !!storedUser,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuth = !!action.payload;
    },
    logOut: (state) => {
      state.user = null;
      state.isAuth = false;
      state.token = null;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
  },
});

export const { setUser, logOut, setToken } = authSlice.actions;
export default authSlice.reducer;
