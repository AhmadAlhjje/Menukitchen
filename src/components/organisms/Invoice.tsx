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
    // Wait a bit for styles to be applied
    setTimeout(() => {
      window.print();
    }, 100);
  };

  // Calculate total amount from orders
  const calculateTotalFromOrders = () => {
    if (!session.orders || session.orders.length === 0) {
      return typeof session.totalAmount === 'string'
        ? parseFloat(session.totalAmount)
        : session.totalAmount;
    }

    return session.orders.reduce((total, order) => {
      const orderTotal = typeof order.totalAmount === 'string'
        ? parseFloat(order.totalAmount)
        : order.totalAmount;
      return total + orderTotal;
    }, 0);
  };

  const totalAmount = calculateTotalFromOrders();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Print styles */}
        <style jsx>{`
          @media print {
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 0;
            }
            body * {
              visibility: hidden;
            }
            .print-area, .print-area * {
              visibility: visible;
            }
            .print-area {
              position: relative;
              width: 100%;
              margin: 0;
              padding: 0;
            }
            .no-print {
              display: none !important;
            }
            @page {
              size: A4;
              margin: 10mm;
            }
            html, body {
              width: 100%;
              height: 100%;
            }
            table {
              page-break-inside: avoid;
              border-collapse: collapse;
            }
            tr {
              page-break-inside: avoid;
            }
            .order-container {
              page-break-inside: avoid;
            }
          }
        `}</style>

        {/* Invoice Content */}
        <div ref={invoiceRef} className="print-area bg-white">
          {/* Header */}
          <div className="text-center border-b-2 border-gray-300 p-6">
            <h1 className="text-3xl font-bold text-primary mb-2">{t('common.appName')}</h1>
            <h2 className="text-xl font-semibold text-gray-700 mb-1">فاتورة مبيعات</h2>
            <p className="text-sm text-gray-500">Sales Invoice</p>
            <p className="text-xs text-gray-500 mt-2">{session.sessionNumber}</p>
          </div>

          {/* Session Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-gray-500 text-xs uppercase">الطاولة / Table</p>
                <p className="font-bold text-lg mt-1">{session.table?.tableNumber || '-'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase">عدد الضيوف / Guests</p>
                <p className="font-bold text-lg mt-1">{session.numberOfGuests}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase">وقت البدء / Start Time</p>
                <p className="font-medium mt-1">{formatOrderTime(session.startTime, language)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase">وقت الإغلاق / End Time</p>
                <p className="font-medium mt-1">{session.endTime ? formatOrderTime(session.endTime, language) : '-'}</p>
              </div>
              {session.table?.location && (
                <div className="col-span-2">
                  <p className="text-gray-500 text-xs uppercase">الموقع / Location</p>
                  <p className="font-medium mt-1">{session.table.location}</p>
                </div>
              )}
            </div>
          </div>

          {/* Orders Table */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold mb-4 text-gray-800">الطلبات / Orders</h3>

            {session.orders && session.orders.length > 0 ? (
              <div className="space-y-6">
                {session.orders.map((order, orderIndex) => {
                  const orderTotal = typeof order.totalAmount === 'string'
                    ? parseFloat(order.totalAmount)
                    : order.totalAmount;

                  return (
                    <div key={order.id} className="order-container">
                      <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200">
                        <span className="font-semibold text-gray-800">
                          طلب {orderIndex + 1} - {order.orderNumber}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatOrderTime(order.orderTime, language)}
                        </span>
                      </div>

                      {/* Order Items Table */}
                      <table className="w-full text-sm mb-3">
                        <thead>
                          <tr className="border-b-2 border-gray-300">
                            <th className="text-right py-2 px-1">الصنف / Item</th>
                            <th className="text-center py-2 px-1 w-12">الكمية</th>
                            <th className="text-right py-2 px-1 w-20">السعر</th>
                            <th className="text-right py-2 px-1 w-20">المجموع</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(order.orderItems || order.items || []).map((item: any) => {
                            const unitPrice = typeof item.unitPrice === 'string'
                              ? parseFloat(item.unitPrice)
                              : item.unitPrice || 0;
                            const subtotal = typeof item.subtotal === 'string'
                              ? parseFloat(item.subtotal)
                              : item.subtotal || 0;

                            const itemName = language === 'ar'
                              ? (item.item?.nameAr || item.item?.name || '-')
                              : (item.item?.name || '-');

                            return (
                              <tr key={item.id} className="border-b border-gray-100">
                                <td className="py-2 px-1">
                                  <div className="font-medium">{itemName}</div>
                                  {item.notes && (
                                    <div className="text-xs text-gray-500 mt-0.5">
                                      ({item.notes})
                                    </div>
                                  )}
                                </td>
                                <td className="text-center py-2 px-1">{item.quantity}</td>
                                <td className="text-right py-2 px-1">{unitPrice.toFixed(2)}</td>
                                <td className="text-right py-2 px-1 font-semibold">{subtotal.toFixed(2)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                      {/* Order Subtotal */}
                      <div className="flex justify-end text-sm">
                        <div className="text-right">
                          <span className="text-gray-600 ml-4">مجموع الطلب:</span>
                          <span className="font-bold ml-2">{orderTotal.toFixed(2)} ر.س</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
