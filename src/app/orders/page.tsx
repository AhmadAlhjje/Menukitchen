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

        <main className="container mx-auto px-4 py-8 lg:pr-72">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text mb-2">إدارة الطلبات</h1>
            <p className="text-text-light">تتبع وإدارة جميع طلبات المطبخ</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mb-6 bg-surface rounded-xl p-2 shadow-sm border border-border">
            <button
              onClick={() => setActiveTab('new')}
              className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-all duration-300 ${
                activeTab === 'new'
                  ? 'bg-accent text-white shadow-md'
                  : 'text-text-light hover:bg-primary-50'
              }`}
            >
              {t('orders.newOrders')} ({newOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('delivered')}
              className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-all duration-300 ${
                activeTab === 'delivered'
                  ? 'bg-success text-white shadow-md'
                  : 'text-text-light hover:bg-primary-50'
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
