'use client';

import { useEffect, useState, useRef } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';

export const OrderNotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { newOrders, loading } = useOrders();
  const { isAuthenticated } = useAuth();
  const [previousOrderCount, setPreviousOrderCount] = useState(0);
  const isInitialMount = useRef(true);

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

  // Effect to detect new orders and play sound
  useEffect(() => {
    // Skip if not authenticated or still loading
    if (!isAuthenticated || loading) {
      return;
    }

    // On first mount, just set the initial count without playing sound
    if (isInitialMount.current) {
      setPreviousOrderCount(newOrders.length);
      isInitialMount.current = false;
      return;
    }

    // Check if new orders arrived (including first order)
    if (newOrders.length > previousOrderCount) {
      const newOrdersCount = newOrders.length - previousOrderCount;
      console.log(`[OrderNotificationProvider] ${newOrdersCount} new order(s) detected! Playing notification sound...`);

      // Play sound
      playNotificationSound();

      // Optional: Show browser notification if permission granted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('طلب جديد! 🔔', {
          body: `لديك ${newOrdersCount} طلب جديد`,
          icon: '/icon.png',
          badge: '/icon.png',
          tag: 'new-order', // This prevents duplicate notifications
        });
      }

      // Update the previous count
      setPreviousOrderCount(newOrders.length);
    } else if (newOrders.length < previousOrderCount) {
      // Orders decreased (probably marked as delivered), update count without sound
      setPreviousOrderCount(newOrders.length);
    }
  }, [newOrders.length, previousOrderCount, loading, isAuthenticated]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return <>{children}</>;
};
