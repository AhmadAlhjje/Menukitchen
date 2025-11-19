"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  setCredentials,
  logout as logoutAction,
  setLoading,
} from "@/lib/redux/slices/authSlice";
import axiosInstance from "@/lib/axios";
import { LoginRequest, User } from "@/types";
import toast from "react-hot-toast";

export const useAuth = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector(
    (state) => state.auth
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("kitchen_token");

      if (token && !isAuthenticated) {
        try {
          // Verify token and get user info
          const response = await axiosInstance.get("/api/auth/me");
          const userData: User = response.data.user || response.data;

          dispatch(setCredentials({ user: userData, token }));
        } catch (error) {
          // Token is invalid, remove it
          localStorage.removeItem("kitchen_token");
        }
      }

      setIsInitialized(true);
    };

    checkAuth();
  }, [dispatch, isAuthenticated]);

  // Login function
  const login = async (credentials: LoginRequest) => {
    try {
      dispatch(setLoading(true));

      const response = await axiosInstance.post("/api/auth/login", credentials);
      const { token, user } = response.data.data || response.data;

      dispatch(setCredentials({ user, token }));
      toast.success("تم تسجيل الدخول بنجاح");

      // ❌ احذف هذه الأسطر
      // router.push('/dashboard');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "فشل تسجيل الدخول. تحقق من البيانات.";
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout endpoint (optional, token is removed from localStorage anyway)
      await axiosInstance.post("/api/auth/logout");
    } catch (error) {
      // Ignore errors, proceed with logout
      console.error("Logout error:", error);
    } finally {
      dispatch(logoutAction());
      toast.success("تم تسجيل الخروج بنجاح");
      router.push("/login");
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    isInitialized,
    login,
    logout,
  };
};
