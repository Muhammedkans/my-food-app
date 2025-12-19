import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface User {
  _id: string;
  auth: {
    email: string;
    role: 'customer' | 'admin' | 'restaurant_owner' | 'delivery_partner';
  };
  profile: {
    name: string;
    avatar?: string;
  };
  wallet: {
    balance: number;
    loyaltyPoints: number;
  };
  addresses: Array<{
    label: string;
    addressLine: string;
    city: string;
  }>;
  token?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null,
  isAuthenticated: !!localStorage.getItem('user'),
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
