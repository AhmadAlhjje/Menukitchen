'use client';

import { useState, useCallback } from 'react';
import axiosInstance from '@/lib/axios';
import { Session } from '@/types';
import toast from 'react-hot-toast';

export const useSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all sessions
  const fetchSessions = useCallback(async (page: number = 1) => {
    try {
      console.log('[useSessions] Fetching sessions...');
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get('/api/sessions', {
        params: { page }
      });
      console.log('[useSessions] Response:', response.data);

      const sessionsData: Session[] = response.data.data || [];
      setSessions(sessionsData);

      return {
        sessions: sessionsData,
        totalPages: response.data.totalPages || 1,
        currentPage: response.data.currentPage || 1,
        count: response.data.count || 0
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'فشل تحميل الجلسات';
      setError(errorMessage);
      console.error('[useSessions] Error:', err);
      toast.error(errorMessage);
      return {
        sessions: [],
        totalPages: 1,
        currentPage: 1,
        count: 0
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get session by ID with full details
  const getSessionById = useCallback(async (sessionId: number): Promise<Session | null> => {
    try {
      console.log('[useSessions] Fetching session details:', sessionId);
      const response = await axiosInstance.get(`/api/sessions/${sessionId}`);
      console.log('[useSessions] Session details:', response.data);

      const session = response.data.data || response.data;
      return session;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'فشل تحميل تفاصيل الجلسة';
      toast.error(errorMessage);
      console.error('[useSessions] Error fetching session:', err);
      return null;
    }
  }, []);

  // Close session
  const closeSession = useCallback(
    async (sessionId: number, notes?: string): Promise<Session | null> => {
      try {
        console.log('[useSessions] Closing session:', sessionId, 'with notes:', notes);

        const response = await axiosInstance.post(
          `/api/sessions/${sessionId}/close`,
          { notes: notes || '' }
        );

        console.log('[useSessions] Close session response:', response.data);

        const closedSession: Session = response.data.data;

        // Update local state
        setSessions(prev =>
          prev.map(session =>
            session.id === sessionId
              ? { ...session, status: 'closed', endTime: closedSession.endTime, notes }
              : session
          )
        );

        toast.success('تم إغلاق الجلسة بنجاح');

        return closedSession;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'فشل إغلاق الجلسة';
        toast.error(errorMessage);
        console.error('[useSessions] Error closing session:', err);
        return null;
      }
    },
    []
  );

  // Get active sessions only
  const getActiveSessions = useCallback((): Session[] => {
    return sessions.filter(session => session.status === 'active');
  }, [sessions]);

  // Get closed sessions only
  const getClosedSessions = useCallback((): Session[] => {
    return sessions.filter(session => session.status === 'closed');
  }, [sessions]);

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    getSessionById,
    closeSession,
    getActiveSessions,
    getClosedSessions,
  };
};
