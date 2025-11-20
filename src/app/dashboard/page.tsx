'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/organisms/Header';
import { Button } from '@/components/atoms/Button';
import { Loader } from '@/components/atoms/Loader';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, isInitialized, router]);

  if (!isInitialized || !isAuthenticated) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="mt-8 bg-surface rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-text mb-4">
            {t('navigation.orders')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push('/orders')}
              fullWidth
            >
              {t('dashboard.viewAllOrders')}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
