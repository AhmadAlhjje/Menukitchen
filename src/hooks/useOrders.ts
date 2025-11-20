'use client';

import { useEffect, useCallback } from 'react';
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

export const useOrders = () => {
  const dispatch = useAppDispatch();
  const { newOrders, preparingOrders, deliveredOrders, loading, error } = useAppSelector((state) => state.orders);

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
      dispatch(setLoading(true));

      const response = await axiosInstance.get('/api/orders', {
        params: { status: 'delivered' },
      });

      let orders: Order[] = response.data.orders || response.data.data || response.data || [];

      // Normalize orders to ensure items array is set correctly
      orders = orders.map(order => ({
        ...order,
        items: order.items || order.orderItems || []
      }));

      dispatch(setDeliveredOrders(orders));
      dispatch(setError(null));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'فشل تحميل الطلبات المُسلمة';
      dispatch(setError(errorMessage));
      console.error('Error fetching delivered orders:', err);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Fetch all orders (new, preparing, and delivered)
  const fetchAllOrders = useCallback(async () => {
    await Promise.all([fetchNewOrders(), fetchPreparingOrders(), fetchDeliveredOrders()]);
  }, [fetchNewOrders, fetchPreparingOrders, fetchDeliveredOrders]);

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
    async (orderId: number) => {
      try {
        await axiosInstance.patch(`/api/orders/${orderId}/status`, {
          status: 'delivered',
        });

        dispatch(updateOrderStatus({ orderId, status: 'delivered' }));
        toast.success('تم تحديد الطلب كمُسلّم');

        return true;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'فشل تحديد الطلب كمُسلّم';
        toast.error(errorMessage);
        console.error('Error marking order as delivered:', err);
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
