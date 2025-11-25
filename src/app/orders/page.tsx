'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/organisms/Header';
import { OrdersList } from '@/components/organisms/OrdersList';
import { Button } from '@/components/atoms/Button';
import { Loader } from '@/components/atoms/Loader';
import { useOrders } from '@/hooks/useOrders';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function OrdersPage() {
  console.log('[OrdersPage] Component rendering...');
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated, isInitialized } = useAuth();
  console.log('[OrdersPage] Auth state:', { isAuthenticated, isInitialized });

  const {
    newOrders,
    deliveredOrders,
    loading,
    fetchAllOrders,
    markOrderAsDelivered,
  } = useOrders();

  console.log('[OrdersPage] Orders state:', {
    newOrdersCount: newOrders.length,
    deliveredOrdersCount: deliveredOrders.length,
    loading
  });

  const [activeTab, setActiveTab] = useState<'new' | 'delivered'>('new');

  useEffect(() => {
    console.log('[OrdersPage] Auth check effect:', { isInitialized, isAuthenticated });
    if (isInitialized && !isAuthenticated) {
      console.log('[OrdersPage] Redirecting to /login...');
      router.push('/login');
    }
  }, [isAuthenticated, isInitialized, router]);

  if (!isInitialized || !isAuthenticated) {
    console.log('[OrdersPage] Showing loader - not initialized or not authenticated');
    return <Loader fullScreen />;
  }

  console.log('[OrdersPage] Rendering main content');
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-text">{t('orders.title')}</h1>
            <Button variant="primary" onClick={fetchAllOrders} disabled={loading} size="sm">
              {loading ? '⏳' : '🔄'} {t('orders.refreshOrders')}
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('new')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'new'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-600 hover:text-text'
              }`}
            >
              {t('orders.newOrders')} ({newOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('delivered')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'delivered'
                  ? 'border-success text-success'
                  : 'border-transparent text-gray-600 hover:text-text'
              }`}
            >
              المُسلمة ({deliveredOrders.length})
            </button>
          </div>

          {/* Orders List */}
          <div className="mt-6">
            {activeTab === 'new' ? (
              <OrdersList
                orders={newOrders}
                loading={loading}
                emptyMessage={t('orders.noNewOrders')}
                onMarkAsReady={markOrderAsDelivered}
              />
            ) : (
              <OrdersList
                orders={deliveredOrders}
                loading={loading}
                emptyMessage="لا توجد طلبات مُسلّمة"
              />
            )}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
