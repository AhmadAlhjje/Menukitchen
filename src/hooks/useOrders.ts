'use client';

import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  setNewOrders,
  setReadyOrders,
  setLoading,
  setError,
  updateOrderStatus,
} from '@/lib/redux/slices/ordersSlice';
import axiosInstance from '@/lib/axios';
import { Order, OrderStatus } from '@/types';
import toast from 'react-hot-toast';

export const useOrders = () => {
  const dispatch = useAppDispatch();
  const { newOrders, readyOrders, loading, error } = useAppSelector((state) => state.orders);

  // Fetch new orders
  const fetchNewOrders = useCallback(async () => {
    try {
      dispatch(setLoading(true));

      // Using the kitchen endpoint or general orders endpoint with status filter
      const response = await axiosInstance.get('/api/orders', {
        params: { status: 'new' },
      });

      // Handle different response structures
      let orders: Order[] = response.data.orders || response.data.data || response.data || [];

      // Normalize orders to ensure items array is set correctly
      orders = orders.map(order => ({
        ...order,
        items: order.items || order.orderItems || []
      }));

      dispatch(setNewOrders(orders));
      dispatch(setError(null));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'فشل تحميل الطلبات الجديدة';
      dispatch(setError(errorMessage));
      console.error('Error fetching new orders:', err);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Fetch ready orders
  const fetchReadyOrders = useCallback(async () => {
    try {
      dispatch(setLoading(true));

      const response = await axiosInstance.get('/api/orders', {
        params: { status: 'ready' },
      });

      let orders: Order[] = response.data.orders || response.data.data || response.data || [];

      // Normalize orders to ensure items array is set correctly
      orders = orders.map(order => ({
        ...order,
        items: order.items || order.orderItems || []
      }));

      dispatch(setReadyOrders(orders));
      dispatch(setError(null));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'فشل تحميل الطلبات الجاهزة';
      dispatch(setError(errorMessage));
      console.error('Error fetching ready orders:', err);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Fetch all orders (new and ready)
  const fetchAllOrders = useCallback(async () => {
    await Promise.all([fetchNewOrders(), fetchReadyOrders()]);
  }, [fetchNewOrders, fetchReadyOrders]);

  // Mark order as ready
  const markOrderAsReady = useCallback(
    async (orderId: number) => {
      try {
        await axiosInstance.patch(`/api/orders/${orderId}/status`, {
          status: 'ready',
        });

        dispatch(updateOrderStatus({ orderId, status: 'ready' }));
        toast.success('تم تحديد الطلب كجاهز');

        return true;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'فشل تحديد الطلب كجاهز';
        toast.error(errorMessage);
        console.error('Error marking order as ready:', err);
        return false;
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

  // Auto-refresh orders every 30 seconds
  useEffect(() => {
    fetchAllOrders();

    const interval = setInterval(() => {
      fetchAllOrders();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchAllOrders]);

  return {
    newOrders,
    readyOrders,
    loading,
    error,
    fetchNewOrders,
    fetchReadyOrders,
    fetchAllOrders,
    markOrderAsReady,
    getOrderById,
  };
};
