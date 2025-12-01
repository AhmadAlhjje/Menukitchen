import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';
import { setCookie, deleteCookie } from '@/utils/cookies';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      // Store token in both cookies and localStorage for maximum compatibility
      if (typeof window !== 'undefined') {
        localStorage.setItem('kitchen_token', action.payload.token);
        setCookie('kitchen_token', action.payload.token, 7); // 7 days expiry

        // Store restaurantId for Socket.IO
        if (action.payload.user.restaurantId) {
          localStorage.setItem('restaurantId', action.payload.user.restaurantId.toString());
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Remove token from both cookies and localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('kitchen_token');
        localStorage.removeItem('restaurantId');
        deleteCookie('kitchen_token');
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const { setCredentials, setLoading, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
