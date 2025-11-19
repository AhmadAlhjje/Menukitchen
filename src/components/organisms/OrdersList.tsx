'use client';

import React, { useState } from 'react';
import { Order } from '@/types';
import { OrderCard } from '../molecules/OrderCard';
import { EmptyState } from '../molecules/EmptyState';
import { Loader } from '../atoms/Loader';
import { useTranslation } from '@/hooks/useTranslation';

interface OrdersListProps {
  orders: Order[];
  loading?: boolean;
  emptyMessage: string;
  onMarkAsReady?: (orderId: number) => Promise<void>;
}

export const OrdersList: React.FC<OrdersListProps> = ({
  orders,
  loading,
  emptyMessage,
  onMarkAsReady,
}) => {
  const { t } = useTranslation();
  const [loadingOrderId, setLoadingOrderId] = useState<number | null>(null);

  const handleMarkAsReady = async (orderId: number) => {
    if (onMarkAsReady) {
      setLoadingOrderId(orderId);
      try {
        await onMarkAsReady(orderId);
      } finally {
        setLoadingOrderId(null);
      }
    }
  };

  if (loading) {
    return <Loader text={t('common.loading')} />;
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title={emptyMessage}
        icon={
          <svg
            className="w-16 h-16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onMarkAsReady={onMarkAsReady ? handleMarkAsReady : undefined}
          loading={loadingOrderId === order.id}
        />
      ))}
    </div>
  );
};
