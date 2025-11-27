'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/organisms/Header';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
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

      <main className="container mx-auto px-4 py-8 lg:pr-72">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">مرحباً بك</h1>
          <p className="text-text-light">إليك نظرة سريعة على نظام المطبخ</p>
        </div>

        {/* Quick Actions */}
        <div className="bg-surface rounded-lg shadow-sm border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="orders" className="text-white" size={20} />
            </div>
            <h2 className="text-xl font-bold text-text">
              {t('navigation.orders')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push('/orders')}
              fullWidth
            >
              {t('dashboard.viewAllOrders')}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/sessions')}
              fullWidth
            >
              الجلسات النشطة
            </Button>
          </div>
        </div>

        {/* Additional Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-surface rounded-lg shadow-sm border border-border p-5 hover:shadow-md hover:border-primary/40 transition-all duration-200">
            <div className="w-11 h-11 bg-secondary/10 rounded-lg flex items-center justify-center mb-3">
              <Icon name="food" className="text-secondary" size={22} />
            </div>
            <h3 className="text-base font-bold text-text mb-1">قائمة الطعام</h3>
            <p className="text-text-light text-sm mb-4">إدارة الأطباق والعناصر</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push('/menu-items')}
              fullWidth
            >
              عرض القائمة
            </Button>
          </div>

          <div className="bg-surface rounded-lg shadow-sm border border-border p-5 hover:shadow-md hover:border-primary/40 transition-all duration-200">
            <div className="w-11 h-11 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
              <Icon name="table" className="text-accent" size={22} />
            </div>
            <h3 className="text-base font-bold text-text mb-1">الطاولات</h3>
            <p className="text-text-light text-sm mb-4">إدارة طاولات المطعم</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/tables')}
              fullWidth
            >
              عرض الطاولات
            </Button>
          </div>

          <div className="bg-surface rounded-lg shadow-sm border border-border p-5 hover:shadow-md hover:border-primary/40 transition-all duration-200">
            <div className="w-11 h-11 bg-warning/10 rounded-lg flex items-center justify-center mb-3">
              <Icon name="chart" className="text-warning" size={22} />
            </div>
            <h3 className="text-base font-bold text-text mb-1">التقارير</h3>
            <p className="text-text-light text-sm mb-4">عرض الإحصائيات والتقارير</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/sessions')}
              fullWidth
            >
              عرض التقارير
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
