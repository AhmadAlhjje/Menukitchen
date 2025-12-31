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
  const [previousOrderCount, setPreviousOrderCount] = useState(0);

  // Function to play notification sound
  const playNotificationSound = () => {
    try {
      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Create oscillator for bell sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Bell sound configuration - two tones
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // First tone

      // Envelope for natural bell sound
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);

      // Second tone for double bell effect
      setTimeout(() => {
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();

        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);

        oscillator2.type = 'sine';
        oscillator2.frequency.setValueAtTime(1000, audioContext.currentTime);

        gainNode2.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode2.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator2.start(audioContext.currentTime);
        oscillator2.stop(audioContext.currentTime + 0.5);
      }, 150);

    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  };

  useEffect(() => {
    console.log('[OrdersPage] Auth check effect:', { isInitialized, isAuthenticated });
    if (isInitialized && !isAuthenticated) {
      console.log('[OrdersPage] Redirecting to /login...');
      router.push('/login');
    }
  }, [isAuthenticated, isInitialized, router]);

  // Effect to detect new orders and play sound
  useEffect(() => {
    // Skip only on initial loading state
    if (loading) {
      return;
    }

    // Initialize previousOrderCount on first load without sound
    if (previousOrderCount === 0 && newOrders.length === 0) {
      setPreviousOrderCount(0);
      return;
    }

    // Check if new orders arrived (including first order)
    if (newOrders.length > previousOrderCount) {
      console.log('[OrdersPage] New order detected! Playing notification sound...');
      playNotificationSound();

      // Optional: Show browser notification if permission granted
      if ('Notification' in window && Notification.permission === 'granted') {
        const orderCount = newOrders.length - previousOrderCount;
        new Notification('طلب جديد! 🔔', {
          body: `لديك ${orderCount} طلب جديد`,
          icon: '/icon.png',
          badge: '/icon.png',
        });
      }
    }

    setPreviousOrderCount(newOrders.length);
  }, [newOrders.length, previousOrderCount, loading]);

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
