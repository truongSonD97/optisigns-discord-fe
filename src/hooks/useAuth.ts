import { useEffect } from "react";
import { getCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/src/redux/slices/auth/authSlice";
import axios from "../services/axiosInstance";
import { RootState } from "@/src/redux/store";

export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = getCookie("token");

  useEffect(() => {
    if (!user && token && fetchUser) {
      fetchUser();
    }
  }, [user, token]);

  const fetchUser = async () => {
    try {
      const res = await axios.get("/auth/me");
      dispatch(setUser(res.data)); // ✅ Store user in Redux
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  return { user };
}
