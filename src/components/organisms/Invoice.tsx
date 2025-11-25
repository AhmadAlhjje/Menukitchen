'use client';

import React, { useRef } from 'react';
import { Session } from '@/types';
import { formatOrderTime } from '@/utils/format';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '../atoms/Button';

interface InvoiceProps {
  session: Session;
  onClose: () => void;
}

export const Invoice: React.FC<InvoiceProps> = ({ session, onClose }) => {
  const { t, language } = useTranslation();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  // Calculate total amount
  const totalAmount = typeof session.totalAmount === 'string'
    ? parseFloat(session.totalAmount)
    : session.totalAmount;

  // Parse images helper
  const parseImages = (imagesStr?: string): string[] => {
    if (!imagesStr) return [];
    try {
      const images = JSON.parse(imagesStr);
      return Array.isArray(images) ? images : [];
    } catch {
      return [];
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Print styles */}
        <style jsx>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-area, .print-area * {
              visibility: visible;
            }
            .print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .no-print {
              display: none !important;
            }
          }
        `}</style>

        {/* Invoice Content */}
        <div ref={invoiceRef} className="print-area p-8">
          {/* Header */}
          <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
            <h1 className="text-3xl font-bold text-primary mb-2">{t('common.appName')}</h1>
            <h2 className="text-xl font-semibold text-gray-700">فاتورة مبيعات</h2>
            <p className="text-sm text-gray-500 mt-2">Sales Invoice</p>
          </div>

          {/* Session Info */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="text-gray-600">رقم الجلسة / Session Number</p>
              <p className="font-bold text-lg">{session.sessionNumber}</p>
            </div>
            <div>
              <p className="text-gray-600">رقم الطاولة / Table Number</p>
              <p className="font-bold text-lg">
                {session.table?.tableNumber || '-'}
              </p>
            </div>
            <div>
              <p className="text-gray-600">وقت البدء / Start Time</p>
              <p className="font-medium">{formatOrderTime(session.startTime, language)}</p>
            </div>
            <div>
              <p className="text-gray-600">وقت الإغلاق / End Time</p>
              <p className="font-medium">
                {session.endTime ? formatOrderTime(session.endTime, language) : '-'}
              </p>
            </div>
            <div>
              <p className="text-gray-600">عدد الضيوف / Guests</p>
              <p className="font-medium">{session.numberOfGuests}</p>
            </div>
            <div>
              <p className="text-gray-600">الموقع / Location</p>
              <p className="font-medium">{session.table?.location || '-'}</p>
            </div>
          </div>

          {/* Orders Table */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-4 bg-gray-100 p-3 rounded">
              الطلبات / Orders
            </h3>

            {session.orders && session.orders.length > 0 ? (
              <div className="space-y-6">
                {session.orders.map((order, orderIndex) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b">
                      <span className="font-semibold">
                        طلب #{orderIndex + 1} - {order.orderNumber}
                      </span>
                      <span className="text-sm text-gray-600">
                        {formatOrderTime(order.orderTime, language)}
                      </span>
                    </div>

                    {/* Order Items */}
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-right p-2 border-b">الصنف / Item</th>
                          <th className="text-center p-2 border-b">الكمية / Qty</th>
                          <th className="text-right p-2 border-b">السعر / Price</th>
                          <th className="text-right p-2 border-b">المجموع / Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.orderItems?.map((item) => {
                          const unitPrice = typeof item.unitPrice === 'string'
                            ? parseFloat(item.unitPrice)
                            : item.unitPrice;
                          const subtotal = typeof item.subtotal === 'string'
                            ? parseFloat(item.subtotal)
                            : item.subtotal;

                          const itemName = language === 'ar'
                            ? (item.item?.nameAr || item.item?.name || '-')
                            : (item.item?.name || '-');

                          return (
                            <tr key={item.id} className="border-b">
                              <td className="p-2">
                                <div className="font-medium">{itemName}</div>
                                {item.notes && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {item.notes}
                                  </div>
                                )}
                              </td>
                              <td className="p-2 text-center">{item.quantity}</td>
                              <td className="p-2 text-right">{unitPrice.toFixed(2)} ر.س</td>
                              <td className="p-2 text-right font-semibold">
                                {subtotal.toFixed(2)} ر.س
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {/* Order Total */}
                    <div className="flex justify-end mt-3 pt-2 border-t">
                      <div className="text-right">
                        <span className="text-gray-600 ml-4">مجموع الطلب:</span>
                        <span className="font-bold text-lg">
                          {(typeof order.totalAmount === 'string'
                            ? parseFloat(order.totalAmount)
                            : order.totalAmount
                          ).toFixed(2)} ر.س
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">لا توجد طلبات</p>
            )}
          </div>

          {/* Total */}
          <div className="border-t-2 border-gray-300 pt-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>المجموع الإجمالي / Grand Total</span>
              <span className="text-2xl text-primary">{totalAmount.toFixed(2)} ر.س</span>
            </div>
          </div>

          {/* Notes */}
          {session.notes && (
            <div className="mt-6 bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600 mb-1">ملاحظات / Notes:</p>
              <p className="text-gray-800">{session.notes}</p>
            </div>
          )}

          {/* Closed By */}
          {session.closedByUser && (
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>تم الإغلاق بواسطة: {session.closedByUser.username}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
            <p className="mb-2">شكراً لزيارتكم / Thank you for your visit</p>
            <p>تم الطباعة: {new Date().toLocaleString('ar-SA')}</p>
          </div>
        </div>

        {/* Action Buttons (not printed) */}
        <div className="no-print flex gap-3 p-6 border-t bg-gray-50 sticky bottom-0">
          <Button variant="primary" onClick={handlePrint} fullWidth>
            🖨️ طباعة الفاتورة
          </Button>
          <Button variant="secondary" onClick={onClose} fullWidth>
            إغلاق
          </Button>
        </div>
      </div>
    </div>
  );
};
