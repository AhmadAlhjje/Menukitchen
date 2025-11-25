'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  setNewOrders,
  setPreparingOrders,
  setDeliveredOrders,
  setLoading,
  setError,
  updateOrderStatus,
} from '@/lib/redux/slices/ordersSlice';
import axiosInstance from '@/lib/axios';
import { Order, OrderStatus } from '@/types';
import toast from 'react-hot-toast';

export const useOrders = (autoFetch: boolean = true) => {
  const dispatch = useAppDispatch();
  const { newOrders, preparingOrders, deliveredOrders, loading, error } = useAppSelector((state) => state.orders);
  const hasFetchedOnMount = useRef(false);

  // Fetch new orders
  const fetchNewOrders = useCallback(async () => {
    try {
      console.log('[useOrders] Starting fetchNewOrders...');
      dispatch(setLoading(true));

      // Using the kitchen endpoint or general orders endpoint with status filter
      const response = await axiosInstance.get('/api/orders', {
        params: { status: 'new' },
      });

      console.log('[useOrders] Received new orders response:', response.data);

      // Handle different response structures
      let orders: Order[] = response.data.orders || response.data.data || response.data || [];

      // Normalize orders to ensure items array is set correctly
      orders = orders.map(order => ({
        ...order,
        items: order.items || order.orderItems || []
      }));

      console.log('[useOrders] Normalized new orders:', orders.length, 'orders');
      dispatch(setNewOrders(orders));
      dispatch(setError(null));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'فشل تحميل الطلبات الجديدة';
      dispatch(setError(errorMessage));
      console.error('[useOrders] Error fetching new orders:', err);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Fetch preparing orders
  const fetchPreparingOrders = useCallback(async () => {
    try {
      dispatch(setLoading(true));

      const response = await axiosInstance.get('/api/orders', {
        params: { status: 'preparing' },
      });

      let orders: Order[] = response.data.orders || response.data.data || response.data || [];

      // Normalize orders to ensure items array is set correctly
      orders = orders.map(order => ({
        ...order,
        items: order.items || order.orderItems || []
      }));

      dispatch(setPreparingOrders(orders));
      dispatch(setError(null));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'فشل تحميل الطلبات قيد الإعداد';
      dispatch(setError(errorMessage));
      console.error('Error fetching preparing orders:', err);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Fetch delivered orders
  const fetchDeliveredOrders = useCallback(async () => {
    try {
      console.log('[useOrders] Starting fetchDeliveredOrders...');
      dispatch(setLoading(true));

      const response = await axiosInstance.get('/api/orders', {
        params: { status: 'delivered' },
      });

      console.log('[useOrders] Received delivered orders response:', response.data);

      let orders: Order[] = response.data.orders || response.data.data || response.data || [];

      // Normalize orders to ensure items array is set correctly
      orders = orders.map(order => ({
        ...order,
        items: order.items || order.orderItems || []
      }));

      console.log('[useOrders] Normalized delivered orders:', orders.length, 'orders');
      dispatch(setDeliveredOrders(orders));
      dispatch(setError(null));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'فشل تحميل الطلبات المُسلمة';
      dispatch(setError(errorMessage));
      console.error('[useOrders] Error fetching delivered orders:', err);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Fetch all orders (new and delivered only - no preparing in UI)
  const fetchAllOrders = useCallback(async () => {
    try {
      console.log('[useOrders] Starting fetchAllOrders...');
      await Promise.all([fetchNewOrders(), fetchDeliveredOrders()]);
      console.log('[useOrders] Completed fetchAllOrders successfully');
    } catch (error) {
      console.error('[useOrders] Error fetching all orders:', error);
      // Don't throw - let individual fetch functions handle errors
    }
  }, [fetchNewOrders, fetchDeliveredOrders]);

  // Mark order as preparing
  const markOrderAsPreparation = useCallback(
    async (orderId: number) => {
      try {
        await axiosInstance.patch(`/api/orders/${orderId}/status`, {
          status: 'preparing',
        });

        dispatch(updateOrderStatus({ orderId, status: 'preparing' }));
        toast.success('تم تحديد الطلب كقيد الإعداد');

        return true;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'فشل تحديد الطلب كقيد الإعداد';
        toast.error(errorMessage);
        console.error('Error marking order as preparing:', err);
        return false;
      }
    },
    [dispatch]
  );

  // Mark order as delivered
  const markOrderAsDelivered = useCallback(
    async (orderId: number): Promise<void> => {
      try {
        await axiosInstance.patch(`/api/orders/${orderId}/status`, {
          status: 'delivered',
        });

        dispatch(updateOrderStatus({ orderId, status: 'delivered' }));
        toast.success('تم تحديد الطلب كمُسلّم');
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'فشل تحديد الطلب كمُسلّم';
        toast.error(errorMessage);
        console.error('Error marking order as delivered:', err);
      }
    },
    [dispatch]
  );

  // Get order by ID
  const getOrderById = useCallback(
    async (orderId: number): Promise<Order | null> => {
      try {
        const response = await axiosInstance.get(`/api/orders/${orderId}`);
        const order = response.data.order || response.data.data || response.data;

        // Normalize order to ensure items array is set correctly
        if (order) {
          return {
            ...order,
            items: order.items || order.orderItems || []
          };
        }

        return order;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'فشل تحميل تفاصيل الطلب';
        toast.error(errorMessage);
        console.error('Error fetching order details:', err);
        return null;
      }
    },
    []
  );

  // Auto-refresh orders on mount only
  useEffect(() => {
    console.log('[useOrders] useEffect triggered. autoFetch:', autoFetch);
    if (!autoFetch) {
      console.log('[useOrders] autoFetch is false, skipping auto-fetch');
      return;
    }

    if (hasFetchedOnMount.current) {
      console.log('[useOrders] Already fetched on mount, skipping');
      return;
    }

    console.log('[useOrders] Initial fetch on mount');
    hasFetchedOnMount.current = true;

    // Fetch immediately on mount
    const doFetch = async () => {
      try {
        console.log('[useOrders] Starting fetchAllOrders...');
        await Promise.all([fetchNewOrders(), fetchDeliveredOrders()]);
        console.log('[useOrders] Completed fetchAllOrders successfully');
      } catch (error) {
        console.error('[useOrders] Error fetching all orders:', error);
      }
    };

    doFetch();

    // Set up periodic refresh every 30 seconds
    const interval = setInterval(() => {
      console.log('[useOrders] Auto-refresh interval triggered');
      doFetch();
    }, 30000); // 30 seconds

    return () => {
      console.log('[useOrders] Cleanup: clearing interval');
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch]); // Only depend on autoFetch, not on the fetch functions

  return {
    newOrders,
    preparingOrders,
    deliveredOrders,
    loading,
    error,
    fetchNewOrders,
    fetchPreparingOrders,
    fetchDeliveredOrders,
    fetchAllOrders,
    markOrderAsPreparation,
    markOrderAsDelivered,
    getOrderById,
  };
};
