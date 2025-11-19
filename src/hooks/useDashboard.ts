'use client';

import { useState, useCallback } from 'react';
import axiosInstance from '@/lib/axios';
import { DashboardStats } from '@/types';
import toast from 'react-hot-toast';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    newOrdersCount: 0,
    readyOrdersCount: 0,
    activeSessionsCount: 0,
    todayOrdersCount: 0,
  });
  const [loading, setLoading] = useState(false);

  // Fetch dashboard statistics
  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);

      // Try to fetch from kitchen dashboard endpoint
      const response = await axiosInstance.get('/api/kitchen/dashboard');
      const data = response.data.data || response.data;

      setStats({
        newOrdersCount: data.newOrdersCount || data.pendingOrders || 0,
        readyOrdersCount: data.readyOrdersCount || data.preparingOrders || 0,
        activeSessionsCount: data.activeSessionsCount || data.activeSessions || 0,
        todayOrdersCount: data.todayOrdersCount || data.todayOrders || 0,
      });
    } catch (err: any) {
      // If kitchen dashboard endpoint doesn't exist, fetch data manually
      try {
        const [newOrdersRes, readyOrdersRes, sessionsRes] = await Promise.all([
          axiosInstance.get('/api/orders', { params: { status: 'new' } }),
          axiosInstance.get('/api/orders', { params: { status: 'ready' } }),
          axiosInstance.get('/api/kitchen/sessions/active'),
        ]);

        const newOrders = newOrdersRes.data.orders || newOrdersRes.data.data || [];
        const readyOrders = readyOrdersRes.data.orders || readyOrdersRes.data.data || [];
        const sessions = sessionsRes.data.sessions || sessionsRes.data.data || [];

        setStats({
          newOrdersCount: newOrders.length,
          readyOrdersCount: readyOrders.length,
          activeSessionsCount: sessions.length,
          todayOrdersCount: newOrders.length + readyOrders.length,
        });
      } catch (fallbackErr: any) {
        const errorMessage = fallbackErr.response?.data?.message || 'فشل تحميل الإحصائيات';
        toast.error(errorMessage);
        console.error('Error fetching dashboard stats:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stats,
    loading,
    fetchDashboardStats,
  };
};
