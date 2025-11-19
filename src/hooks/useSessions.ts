'use client';

import { useState, useCallback } from 'react';
import axiosInstance from '@/lib/axios';
import { Session, Order } from '@/types';
import toast from 'react-hot-toast';

export const useSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch active sessions
  const fetchActiveSessions = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get('/api/kitchen/sessions/active');
      const sessionData: Session[] = response.data.sessions || response.data.data || [];

      setSessions(sessionData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'فشل تحميل الجلسات النشطة';
      toast.error(errorMessage);
      console.error('Error fetching active sessions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get session by ID
  const getSessionById = useCallback(async (sessionId: number): Promise<Session | null> => {
    try {
      const response = await axiosInstance.get(`/api/sessions/${sessionId}`);
      return response.data.session || response.data.data || response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'فشل تحميل تفاصيل الجلسة';
      toast.error(errorMessage);
      console.error('Error fetching session details:', err);
      return null;
    }
  }, []);

  // Get orders for a session
  const getSessionOrders = useCallback(async (sessionId: number): Promise<Order[]> => {
    try {
      const response = await axiosInstance.get(`/api/orders/session/${sessionId}`);
      return response.data.orders || response.data.data || [];
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'فشل تحميل طلبات الجلسة';
      toast.error(errorMessage);
      console.error('Error fetching session orders:', err);
      return [];
    }
  }, []);

  // Close session
  const closeSession = useCallback(
    async (sessionId: number, notes?: string): Promise<boolean> => {
      try {
        await axiosInstance.post(`/api/kitchen/sessions/${sessionId}/close`, {
          notes,
        });

        toast.success('تم إغلاق الجلسة بنجاح');

        // Refresh sessions list
        await fetchActiveSessions();

        return true;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'فشل إغلاق الجلسة';
        toast.error(errorMessage);
        console.error('Error closing session:', err);
        return false;
      }
    },
    [fetchActiveSessions]
  );

  return {
    sessions,
    loading,
    fetchActiveSessions,
    getSessionById,
    getSessionOrders,
    closeSession,
  };
};
