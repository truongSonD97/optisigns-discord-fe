// utils/axiosInstance.ts
import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

instance.interceptors.request.use((config) => {
  const token = getCookie("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


instance.interceptors.response.use(
  (response) => response, // If response is successful, return it
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      deleteCookie("token"); // Clear token
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);


export default instance;
