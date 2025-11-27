'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '@/components/organisms/Header';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Loader } from '@/components/atoms/Loader';
import { OrderItemRow } from '@/components/molecules/OrderItemRow';
import { useOrders } from '@/hooks/useOrders';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { Order } from '@/types';
import { formatCurrency, formatDateTime, getRelativeTime } from '@/utils/format';

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { t, language } = useTranslation();
  const { isAuthenticated, isInitialized } = useAuth();
  const { getOrderById, markOrderAsDelivered } = useOrders();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const orderId = params?.id ? parseInt(params.id as string) : null;

  const loadOrder = useCallback(async () => {
    if (!orderId) return;

    setLoading(true);
    const orderData = await getOrderById(orderId);
    setOrder(orderData);
    setLoading(false);
  }, [orderId, getOrderById]);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (orderId && isAuthenticated) {
      loadOrder();
    }
  }, [orderId, isAuthenticated, isInitialized, router, loadOrder]);

  const handleMarkAsDelivered = async () => {
    if (!orderId) return;

    setActionLoading(true);
    try {
      await markOrderAsDelivered(orderId);
      if (order) {
        setOrder({ ...order, status: 'delivered' });
      }
    } finally {
      setActionLoading(false);
    }
  };

  if (!isInitialized || !isAuthenticated) {
    return <Loader fullScreen />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Loader text={t('common.loading')} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600">{t('errors.notFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl lg:pr-72">
        {/* Back Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="mb-6"
        >
          ← {t('common.back')}
        </Button>

        {/* Order Header */}
        <Card className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-text mb-2">
                {t('orders.orderNumber')} {order.id}
              </h1>
              <p className="text-gray-600">
                {getRelativeTime(order.createdAt, language)}
              </p>
            </div>
            <Badge variant={order.status === 'new' ? 'new' : 'ready'} size="lg">
              {order.status === 'new' ? t('orders.newOrders') : t('orders.readyOrders')}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">{t('orders.tableNumber')}</p>
              <p className="font-medium text-text">
                {order.table?.tableNumber || order.session?.table?.tableNumber || `${t('common.table')} ${order.tableId || order.session?.tableId}`}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('orders.orderTime')}</p>
              <p className="font-medium text-text">
                {formatDateTime(order.orderTime || order.createdAt, 'en-US')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('common.total')}</p>
              <p className="font-bold text-primary text-xl">
                {formatCurrency(order.totalAmount, language === 'ar' ? 'ar-SA' : 'en-US')}
              </p>
            </div>
          </div>

          {order.notes && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">{t('orders.customerNotes')}:</p>
              <p className="text-text">{order.notes}</p>
            </div>
          )}
        </Card>

        {/* Order Items */}
        <Card className="mb-6">
          <h2 className="text-xl font-bold text-text mb-4">
            {t('orders.orderDetails')}
          </h2>
          <div>
            {order.items?.map((item) => (
              <OrderItemRow key={item.id} item={item} showNotes />
            ))}
          </div>
        </Card>

        {/* Actions */}
        {order.status === 'new' && (
          <div className="flex gap-4">
            <Button
              variant="success"
              size="lg"
              onClick={handleMarkAsDelivered}
              loading={actionLoading}
              fullWidth
            >
              تحديد كمُسلّم
            </Button>
          </div>
        )}

        {order.status === 'delivered' && (
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push(`/sessions/${order.sessionId}/invoice`)}
            fullWidth
          >
            {t('sessions.viewInvoice')}
          </Button>
        )}
      </main>
    </div>
  );
}
