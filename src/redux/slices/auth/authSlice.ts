
"use client";
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from "../../../services/axiosInstance";
import socketService from "@/src/services/socketService";
import { setCookie, deleteCookie } from 'cookies-next';

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface User {
  id:number,
  username:string,
}

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null
};


export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post('/auth/login', { username, password });
      const token = res.data.access_token;
      const user = res.data?.user;
      setCookie('token', token, { maxAge: 60 * 60 * 24 }); 
      socketService.connect(token); // Connect WebSocket
      return {token,user};
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Invalid username or password');
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      deleteCookie('token');
      socketService.disconnect(); // Disconnect WebSocket on logout
    },
    reInitAuth: (state, action:PayloadAction<{token:string}>) => {
      state.token = action.payload?.token;
    },
    setUser: (state,action:PayloadAction<User>) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{token:string, user:any}>) => {
        state.token = action.payload?.token;
        state.user = action.payload?.user
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});


export const { logout,reInitAuth,setUser } = authSlice.actions;
export default authSlice.reducer;
