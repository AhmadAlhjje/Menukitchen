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

export default function OrdersPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated, isInitialized } = useAuth();
  const {
    newOrders,
    readyOrders,
    loading,
    fetchAllOrders,
    markOrderAsReady,
  } = useOrders();

  const [activeTab, setActiveTab] = useState<'new' | 'ready'>('new');

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isInitialized, router]);

  if (!isInitialized || !isAuthenticated) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-text">{t('orders.title')}</h1>
          <Button variant="primary" onClick={fetchAllOrders} disabled={loading}>
            {t('orders.refreshOrders')}
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
            onClick={() => setActiveTab('ready')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'ready'
                ? 'border-success text-success'
                : 'border-transparent text-gray-600 hover:text-text'
            }`}
          >
            {t('orders.readyOrders')} ({readyOrders.length})
          </button>
        </div>

        {/* Orders List */}
        <div className="mt-6">
          {activeTab === 'new' ? (
            <OrdersList
              orders={newOrders}
              loading={loading}
              emptyMessage={t('orders.noNewOrders')}
              onMarkAsReady={markOrderAsReady}
            />
          ) : (
            <OrdersList
              orders={readyOrders}
              loading={loading}
              emptyMessage={t('orders.noReadyOrders')}
            />
          )}
        </div>
      </main>
    </div>
  );
}
