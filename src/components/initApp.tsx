"use client";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import socketService from "../services/socketService";
// import { checkoutNpConfig, categoryNpConfig, store } from "./redux/store";
// import PersistWrapper from 'next-persist/lib/NextPersistWrapper';
import { getCookies } from 'cookies-next';
import { reInitAuth } from "../redux/slices/auth/authSlice";

export function InitApp() {
  const dispatch = useDispatch();

  useEffect(() => {
    const cookieData = getCookies() || {};
    const token = cookieData.token;
    if (token) {
      dispatch(reInitAuth({token})); // Restore Redux state
      socketService.connect(token); // Reconnect socket
    }
  }, [dispatch]);

  return null; // No UI needed
}
