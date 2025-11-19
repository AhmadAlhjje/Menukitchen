'use client';

import React from 'react';
import { OrderItem } from '@/types';
import { formatCurrency } from '@/utils/format';
import { useTranslation } from '@/hooks/useTranslation';

interface OrderItemRowProps {
  item: OrderItem;
  showNotes?: boolean;
}

export const OrderItemRow: React.FC<OrderItemRowProps> = ({ item, showNotes = true }) => {
  const { t, language } = useTranslation();

  const itemName = language === 'ar'
    ? (item.item?.nameAr || item.item?.name || '-')
    : (item.item?.name || '-');

  return (
    <div className="border-b border-gray-200 py-3 last:border-0">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-medium text-text">{itemName}</h4>
          {showNotes && item.notes && (
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-medium">{t('common.notes')}:</span> {item.notes}
            </p>
          )}
        </div>
        <div className="text-right ms-4">
          <p className="text-sm text-gray-600">
            {item.quantity} × {formatCurrency(item.price, language === 'ar' ? 'ar-SA' : 'en-US')}
          </p>
          <p className="font-bold text-text">
            {formatCurrency(item.quantity * item.price, language === 'ar' ? 'ar-SA' : 'en-US')}
          </p>
        </div>
      </div>
    </div>
  );
};
