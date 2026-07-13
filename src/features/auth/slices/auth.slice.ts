import type { IUser } from "@/shared/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  guestId: string | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isGuest: false,
  guestId: null,
  isLoading: true,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isGuest = false;
      state.guestId = null;
      state.isLoading = false;
    },

    setGuestCredentials: (state, action: PayloadAction<{ guestId: string }>) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isGuest = true;
      state.guestId = action.payload.guestId;
      state.isLoading = false;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isGuest = true;

      const newGuestId = "guest_" + Math.random().toString(36).substring(2, 11);

      state.guestId = newGuestId;
      state.isLoading = false;
      localStorage.removeItem("guest_id");
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, setGuestCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
