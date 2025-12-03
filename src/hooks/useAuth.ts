"use client";

import { useEffect, useState, useRef } from "react";
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
import { getCookie } from "@/utils/cookies";

export const useAuth = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector(
    (state) => state.auth
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const hasCheckedAuth = useRef(false);

  // Check if user is already logged in on mount - ONLY ONCE
  useEffect(() => {
    // Prevent running more than once
    if (hasCheckedAuth.current) {
      return;
    }

    hasCheckedAuth.current = true;

    const checkAuth = async () => {
      console.log('[useAuth] Checking authentication...');

      // Check both localStorage and cookies for token
      let token = localStorage.getItem("kitchen_token");
      if (!token) {
        token = getCookie("kitchen_token");
        console.log('[useAuth] Token from cookie:', token ? 'found' : 'not found');
      } else {
        console.log('[useAuth] Token from localStorage:', token ? 'found' : 'not found');
      }

      if (token) {
        try {
          console.log('[useAuth] Verifying token...');
          // Verify token and get user info
          const response = await axiosInstance.get("/api/auth/me");
          console.log('[useAuth] Full response:', response.data);

          const userData: User = response.data.user || response.data.data || response.data;
          console.log('[useAuth] User data:', userData);
          console.log('[useAuth] Token valid, user:', userData.username);
          console.log('[useAuth] Restaurant ID:', userData.restaurantId);

          dispatch(setCredentials({ user: userData, token }));

          // Save restaurantId to localStorage for Socket.IO
          if (userData.restaurantId) {
            console.log('[useAuth] Saving restaurantId to localStorage:', userData.restaurantId);
            localStorage.setItem('restaurantId', userData.restaurantId.toString());
          } else {
            console.warn('[useAuth] No restaurantId found in user data!');
          }
        } catch (error: any) {
          console.error('[useAuth] Token invalid:', error);
          // Token is invalid, remove it from both places
          localStorage.removeItem("kitchen_token");
          localStorage.removeItem("restaurantId");

          // Dispatch logout to clear Redux state
          dispatch(logoutAction());
        }
      } else {
        console.log('[useAuth] No token found');
        // Make sure Redux state is cleared
        dispatch(logoutAction());
      }

      console.log('[useAuth] Initialization complete');
      setIsInitialized(true);
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Login function
  const login = async (credentials: LoginRequest) => {
    try {
      dispatch(setLoading(true));

      // Add requiredRole as a fixed value
      const loginPayload = {
        ...credentials,
        requiredRole: "kitchen"
      };

      const response = await axiosInstance.post("/api/auth/login", loginPayload);
      const { token, user } = response.data.data || response.data;

      dispatch(setCredentials({ user, token }));

      // Save restaurantId to localStorage for Socket.IO
      if (user.restaurantId) {
        localStorage.setItem('restaurantId', user.restaurantId.toString());
      }

      toast.success("تم تسجيل الدخول بنجاح");
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
      await axiosInstance.post("/api/auth/logout");
    } catch (error) {
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
