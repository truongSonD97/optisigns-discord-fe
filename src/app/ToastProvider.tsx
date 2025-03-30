"use client";
import { FC, ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: FC<ToastProviderProps> = (props) => {
  const { children } = props;
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
};
