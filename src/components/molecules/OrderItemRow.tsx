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

  // Convert unitPrice and subtotal from string to number if needed
  const unitPrice = typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : (item.unitPrice || item.price || 0);
  const subtotal = typeof item.subtotal === 'string' ? parseFloat(item.subtotal) : (item.subtotal || (item.quantity * unitPrice));

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-3 bg-white hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-bold text-lg text-text mb-1">{itemName}</h4>
          {showNotes && item.notes && (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">{t('common.notes')}:</span> {item.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="flex items-center gap-6">
          {/* Quantity */}
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'الكمية' : 'Quantity'}</p>
            <p className="text-2xl font-bold text-primary">{item.quantity}</p>
          </div>

          {/* Unit Price */}
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'سعر الوحدة' : 'Unit Price'}</p>
            <p className="text-lg font-semibold text-gray-700">
              {formatCurrency(unitPrice, language === 'ar' ? 'ar-SA' : 'en-US')}
            </p>
          </div>
        </div>

        {/* Subtotal */}
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'المجموع' : 'Subtotal'}</p>
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(subtotal, language === 'ar' ? 'ar-SA' : 'en-US')}
          </p>
        </div>
      </div>
    </div>
  );
};
