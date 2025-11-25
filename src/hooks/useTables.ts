'use client';

import { useState, useCallback } from 'react';
import axiosInstance from '@/lib/axios';
import { Table } from '@/types';
import toast from 'react-hot-toast';

export const useTables = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all tables
  const fetchTables = useCallback(async () => {
    try {
      console.log('[useTables] Fetching tables...');
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get('/api/admin/tables');
      console.log('[useTables] Response:', response.data);

      const tablesData: Table[] = response.data.data || [];
      setTables(tablesData);

      return tablesData;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'فشل تحميل الطاولات';
      setError(errorMessage);
      console.error('[useTables] Error:', err);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get table by ID
  const getTableById = useCallback(
    (tableId: number): Table | undefined => {
      return tables.find(table => table.id === tableId);
    },
    [tables]
  );

  // Get tables by status
  const getTablesByStatus = useCallback(
    (status: 'available' | 'occupied' | 'reserved'): Table[] => {
      return tables.filter(table => table.status === status && table.isActive);
    },
    [tables]
  );

  return {
    tables,
    loading,
    error,
    fetchTables,
    getTableById,
    getTablesByStatus,
  };
};
