'use client';

import React, { useRef } from 'react';
import { Session } from '@/types';
import { formatOrderTime } from '@/utils/format';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '../atoms/Button';

interface InvoiceProps {
  session: Session;
  onClose: () => void;
}

export const Invoice: React.FC<InvoiceProps> = ({ session, onClose }) => {
  const { t, language } = useTranslation();
  const { user } = useAuth();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const restaurant = user?.restaurant;

  const handlePrint = () => {
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

  // Component for invoice content to avoid duplication
  const InvoiceContent = () => (
    <div className="bg-white" style={{ padding: '32px' }}>
      {/* Header */}
      <div className="text-center" style={{ borderBottom: '4px solid black', paddingBottom: '24px', marginBottom: '24px' }}>
        {/* Restaurant Name */}
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: 'black', marginBottom: '12px' }}>
          {restaurant?.name || t('common.appName')}
        </h1>

        {/* Restaurant Info */}
        <div style={{ fontSize: '14px', color: 'black' }}>
          {restaurant?.address && (
            <p style={{ fontWeight: '500', marginBottom: '4px' }}>{restaurant.address}</p>
          )}
          {restaurant?.phone && (
            <p style={{ fontWeight: '500' }}>{restaurant.phone}</p>
          )}
        </div>

        <div style={{ marginTop: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'black', marginBottom: '4px' }}>فاتورة مبيعات</h2>
          <p style={{ fontSize: '18px', fontWeight: '600', color: 'black' }}>Sales Invoice</p>
          <p style={{ fontSize: '14px', color: 'black', marginTop: '12px', fontWeight: '500' }}>رقم الفاتورة: {session.sessionNumber}</p>
        </div>
      </div>

      {/* Session Info */}
      <div style={{ borderBottom: '2px solid black', paddingBottom: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
          <div style={{ borderRight: '2px solid black', paddingRight: '16px' }}>
            <p style={{ color: 'black', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>الطاولة / Table</p>
            <p style={{ fontWeight: 'bold', fontSize: '20px', color: 'black' }}>{session.table?.tableNumber || '-'}</p>
          </div>
          <div style={{ paddingLeft: '16px' }}>
            <p style={{ color: 'black', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>عدد الضيوف / Guests</p>
            <p style={{ fontWeight: 'bold', fontSize: '20px', color: 'black' }}>{session.numberOfGuests}</p>
          </div>
          <div style={{ borderRight: '2px solid black', paddingRight: '16px', paddingTop: '8px' }}>
            <p style={{ color: 'black', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>وقت البدء / Start Time</p>
            <p style={{ fontWeight: '600', color: 'black' }}>{formatOrderTime(session.startTime, language)}</p>
          </div>
          <div style={{ paddingLeft: '16px', paddingTop: '8px' }}>
            <p style={{ color: 'black', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>وقت الإغلاق / End Time</p>
            <p style={{ fontWeight: '600', color: 'black' }}>{session.endTime ? formatOrderTime(session.endTime, language) : '-'}</p>
          </div>
          {session.table?.location && (
            <div style={{ gridColumn: 'span 2', paddingTop: '8px', borderTop: '1px solid #d1d5db' }}>
              <p style={{ color: 'black', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>الموقع / Location</p>
              <p style={{ fontWeight: '600', color: 'black' }}>{session.table.location}</p>
            </div>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ paddingBottom: '20px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: 'black', borderBottom: '2px solid black', paddingBottom: '8px' }}>
          الطلبات / Orders
        </h3>

        {session.orders && session.orders.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {session.orders.map((order, orderIndex) => {
              const orderTotal = typeof order.totalAmount === 'string'
                ? parseFloat(order.totalAmount)
                : order.totalAmount;

              return (
                <div key={order.id} style={{ border: '1px solid black', borderRadius: '4px', padding: '12px', pageBreakInside: 'avoid' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid black' }}>
                    <span style={{ fontWeight: 'bold', color: 'black' }}>
                      طلب رقم {orderIndex + 1} - {order.orderNumber}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'black' }}>
                      {formatOrderTime(order.orderTime, language)}
                    </span>
                  </div>

                  {/* Order Items Table */}
                  <table style={{ width: '100%', fontSize: '14px', marginBottom: '12px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'black', color: 'white' }}>
                        <th style={{ textAlign: 'right', padding: '8px', fontWeight: 'bold' }}>الصنف / Item</th>
                        <th style={{ textAlign: 'center', padding: '8px', width: '64px', fontWeight: 'bold' }}>الكمية</th>
                        <th style={{ textAlign: 'right', padding: '8px', width: '96px', fontWeight: 'bold' }}>السعر</th>
                        <th style={{ textAlign: 'right', padding: '8px', width: '96px', fontWeight: 'bold' }}>المجموع</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(order.orderItems || order.items || []).map((item: any, idx: number) => {
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
                          <tr 
                            key={item.id} 
                            style={{ 
                              borderBottom: '1px solid #d1d5db',
                              backgroundColor: idx % 2 === 0 ? '#f9fafb' : 'white'
                            }}
                          >
                            <td style={{ padding: '8px' }}>
                              <div style={{ fontWeight: '600', color: 'black' }}>{itemName}</div>
                              {item.notes && (
                                <div style={{ fontSize: '12px', color: 'black', marginTop: '2px', fontStyle: 'italic' }}>
                                  ({item.notes})
                                </div>
                              )}
                            </td>
                            <td style={{ textAlign: 'center', padding: '8px', fontWeight: '600', color: 'black' }}>{item.quantity}</td>
                            <td style={{ textAlign: 'right', padding: '8px', color: 'black' }}>{Math.round(unitPrice)}</td>
                            <td style={{ textAlign: 'right', padding: '8px', fontWeight: 'bold', color: 'black' }}>{Math.round(subtotal)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Order Subtotal */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '14px', borderTop: '2px solid black', paddingTop: '8px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: 'black', fontWeight: 'bold', marginLeft: '16px' }}>مجموع الطلب:</span>
                      <span style={{ fontWeight: 'bold', fontSize: '18px', marginLeft: '8px', color: 'black' }}>{Math.round(orderTotal)} ل.س</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'black', padding: '16px', fontWeight: '600', border: '1px solid black', borderRadius: '4px' }}>
            لا توجد طلبات
          </p>
        )}
      </div>

      {/* Total */}
      <div style={{ border: '4px solid black', backgroundColor: '#f3f4f6', padding: '16px', marginBottom: '20px', pageBreakInside: 'avoid' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'black' }}>المجموع الإجمالي / Grand Total</span>
          <span style={{ fontSize: '28px', fontWeight: 'bold', color: 'black' }}>{Math.round(totalAmount)} ل.س</span>
        </div>
      </div>

      {/* Notes */}
      {session.notes && (
        <div style={{ marginBottom: '16px', border: '2px solid black', padding: '12px', borderRadius: '4px' }}>
          <p style={{ fontSize: '14px', color: 'black', fontWeight: 'bold', marginBottom: '4px' }}>ملاحظات / Notes:</p>
          <p style={{ color: 'black' }}>{session.notes}</p>
        </div>
      )}

      {/* Closed By */}
      {session.closedByUser && (
        <div style={{ marginBottom: '16px', fontSize: '14px', color: 'black', textAlign: 'center', fontWeight: '600' }}>
          <p>تم الإغلاق بواسطة: {session.closedByUser.username}</p>
        </div>
      )}

      {/* Footer */}
      <div style={{ paddingTop: '16px', borderTop: '2px solid black', textAlign: 'center', fontSize: '14px', color: 'black' }}>
        <p style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '16px' }}>شكراً لزيارتكم / Thank you for your visit</p>
        <p style={{ fontWeight: '600' }}>تاريخ الطباعة: {new Date().toLocaleString('ar-SA')}</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          
          .print-only,
          .print-only * {
            visibility: visible !important;
          }
          
          .print-only {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          
          .no-print {
            display: none !important;
          }

          @page {
            size: A4;
            margin: 15mm;
          }

          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>

      {/* نسخة 1: للعرض على الشاشة فقط */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 no-print">
        <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Invoice Content للعرض */}
          <div ref={invoiceRef}>
            <InvoiceContent />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 p-6 border-t bg-gray-50 sticky bottom-0">
            <Button variant="primary" onClick={handlePrint} fullWidth>
              🖨️ طباعة الفاتورة
            </Button>
            <Button variant="secondary" onClick={onClose} fullWidth>
              إغلاق
            </Button>
          </div>
        </div>
      </div>

      {/* نسخة 2: للطباعة فقط */}
      <div className="print-only">
        <InvoiceContent />
      </div>
    </>
  );
};