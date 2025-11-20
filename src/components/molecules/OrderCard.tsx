'use client';

import React from 'react';
import Link from 'next/link';
import { Order } from '@/types';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { formatCurrency, formatOrderTime, getRelativeTime } from '@/utils/format';
import { useTranslation } from '@/hooks/useTranslation';

interface OrderCardProps {
  order: Order;
  onMarkAsReady?: (orderId: number) => Promise<void>;
  loading?: boolean;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onMarkAsReady, loading }) => {
  const { t, language } = useTranslation();

  const handleMarkAsReady = async () => {
    if (onMarkAsReady) {
      await onMarkAsReady(order.id);
    }
  };

  return (
    <Card hoverable className="relative">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-text">
            {t('orders.orderNumber')} #{order.id}
          </h3>
          <p className="text-sm text-gray-500">
            {getRelativeTime(order.createdAt, language)}
          </p>
        </div>
        <Badge variant={order.status === 'new' ? 'new' : 'ready'}>
          {order.status === 'new' ? t('orders.newOrders') : t('orders.readyOrders')}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('orders.tableNumber')}:</span>
          <span className="font-medium">
            {order.table?.tableNumber || order.session?.table?.tableNumber || t('common.table') + ' #' + (order.tableId || order.session?.tableId)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('orders.orderTime')}:</span>
          <span className="font-medium">{formatOrderTime(order.orderTime || order.createdAt, language)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('orders.itemsCount')}:</span>
          <span className="font-medium">{order.items?.length || 0}</span>
        </div>
        <div className="flex justify-between text-sm font-bold">
          <span className="text-gray-600">{t('common.total')}:</span>
          <span className="text-primary">{formatCurrency(order.totalAmount, language === 'ar' ? 'ar-SA' : 'en-US')}</span>
        </div>
      </div>

      {order.notes && (
        <div className="mb-4 p-2 bg-gray-50 rounded">
          <p className="text-xs text-gray-600 mb-1">{t('orders.customerNotes')}:</p>
          <p className="text-sm text-text">{order.notes}</p>
        </div>
      )}

      <div className="flex gap-2">
        <Link href={`/orders/${order.id}`} className="flex-1">
          <Button variant="outline" size="sm" fullWidth>
            {t('orders.viewDetails')}
          </Button>
        </Link>

        {order.status === 'new' && onMarkAsReady && (
          <Button
            variant="success"
            size="sm"
            onClick={handleMarkAsReady}
            loading={loading}
            className="flex-1"
          >
            {t('orders.markAsReady')}
          </Button>
        )}
      </div>
    </Card>
  );
};
