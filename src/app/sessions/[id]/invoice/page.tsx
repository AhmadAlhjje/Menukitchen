'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '@/components/organisms/Header';
import { Button } from '@/components/atoms/Button';
import { Loader } from '@/components/atoms/Loader';
import { useSessions } from '@/hooks/useSessions';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { Order } from '@/types';
import { formatCurrency, formatDate, formatTime } from '@/utils/format';
import { printPage } from '@/utils/download';

export default function InvoicePage() {
  const router = useRouter();
  const params = useParams();
  const { t, language } = useTranslation();
  const { isAuthenticated, isInitialized } = useAuth();
  const { getSessionById } = useSessions();

  const [orders, setOrders] = useState<Order[]>([]);
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const locale = language === 'ar' ? 'ar-EG' : 'en-US';

  const sessionId = params?.id ? parseInt(params.id as string) : undefined;

  const loadSessionOrders = useCallback(async () => {
    if (!sessionId) return;

    setLoading(true);
    try {
      const session = await getSessionById(sessionId);
      setSessionData(session);
      setOrders(session?.orders || []);
    } finally {
      setLoading(false);
    }
  }, [sessionId, getSessionById]);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (sessionId && isAuthenticated) {
      loadSessionOrders();
    }
  }, [sessionId, isAuthenticated, isInitialized, router, loadSessionOrders]);

  const calculateTotal = () => {
    return orders.reduce((sum, order) => sum + (parseFloat(order.totalAmount as any) || 0), 0);
  };

  const handlePrint = () => {
    printPage();
  };

  if (!isInitialized || !isAuthenticated) {
    return <Loader fullScreen />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Loader text={t('invoice.loadingInvoice')} />
      </div>
    );
  }

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl lg:pr-72">
        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            ← {t('common.back')}
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            {t('invoice.printInvoice')}
          </Button>
        </div>

        {/* Invoice Content */}
        <div className="bg-surface rounded-lg shadow-lg p-8 print-content">
          {/* Header */}
          <div className="text-center mb-8 border-b-2 border-primary pb-6">
            <h1 className="text-3xl font-bold text-primary mb-2">
              {t('invoice.title')}
            </h1>
            <p className="text-gray-600">
              {t('invoice.sessionNumber')}: {sessionData?.sessionNumber || sessionId}
            </p>
            <p className="text-sm text-gray-500">
              {sessionData?.startTime && formatDate(sessionData.startTime, locale)} - {sessionData?.startTime && formatTime(sessionData.startTime, locale)}
            </p>
          </div>

          {/* Session Info */}
          {orders.length > 0 && orders[0].session && (
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">{t('invoice.tableNumber')}:</p>
                <p className="font-medium text-lg">
                  {orders[0].session.table?.tableNumber || `${t('common.table')} ${orders[0].session.tableId}`}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('sessions.numberOfGuests')}:</p>
                <p className="font-medium text-lg">{orders[0].session.numberOfGuests}</p>
              </div>
            </div>
          )}

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              {t('invoice.noOrders')}
            </div>
          ) : (
            <>
              <div className="mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-start py-3">{t('invoice.itemName')}</th>
                      <th className="text-center py-3">{t('invoice.quantity')}</th>
                      <th className="text-end py-3">{t('invoice.price')}</th>
                      <th className="text-end py-3">{t('invoice.subtotal')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const orderItems = (order as any).orderItems || order.items || [];
                      return orderItems.map((item: any) => {
                        const itemName = language === 'ar'
                          ? (item.item?.nameAr || item.item?.name || '-')
                          : (item.item?.name || '-');

                        const price = parseFloat(item.unitPrice) || parseFloat(item.price) || 0;
                        const quantity = item.quantity || 0;
                        const subtotal = parseFloat(item.subtotal) || (price * quantity);

                        return (
                          <tr key={item.id} className="border-b border-gray-200">
                            <td className="py-3">{itemName}</td>
                            <td className="text-center py-3">{quantity}</td>
                            <td className="text-end py-3">
                              {formatCurrency(price, language === 'ar' ? 'ar-SA' : 'en-US')}
                            </td>
                            <td className="text-end py-3">
                              {formatCurrency(subtotal, language === 'ar' ? 'ar-SA' : 'en-US')}
                            </td>
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="border-t-2 border-gray-300 pt-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold">{t('invoice.total')}:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(total, language === 'ar' ? 'ar-SA' : 'en-US')}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-lg font-medium text-text mb-2">
              {t('invoice.thankYou')}
            </p>
            <p className="text-sm text-gray-500">
              {formatDate(new Date().toISOString(), locale)}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
