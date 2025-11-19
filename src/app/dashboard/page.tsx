'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/organisms/Header';
import { DashboardStats } from '@/components/organisms/DashboardStats';
import { Button } from '@/components/atoms/Button';
import { Loader } from '@/components/atoms/Loader';
import { useDashboard } from '@/hooks/useDashboard';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated, isInitialized } = useAuth();
  const { stats, loading, fetchDashboardStats } = useDashboard();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      fetchDashboardStats();
    }
  }, [isAuthenticated, isInitialized, router, fetchDashboardStats]);

  if (!isInitialized || !isAuthenticated) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">
              {t('dashboard.title')}
            </h1>
            <p className="text-gray-600">{t('dashboard.welcome')}</p>
          </div>
          <Button
            variant="primary"
            onClick={fetchDashboardStats}
            disabled={loading}
          >
            {t('dashboard.refreshData')}
          </Button>
        </div>

        {/* Statistics */}
        {loading ? (
          <Loader text={t('common.loading')} />
        ) : (
          <DashboardStats stats={stats} />
        )}

        {/* Quick Actions */}
        <div className="mt-8 bg-surface rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-text mb-4">
            {t('navigation.orders')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/orders')}
              fullWidth
            >
              {t('dashboard.viewAllOrders')}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/backend-notes')}
              fullWidth
            >
              {t('navigation.backendNotes')}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
