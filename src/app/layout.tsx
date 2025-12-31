import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { ReduxProvider } from '@/lib/redux/provider';
import { OrderNotificationProvider } from '@/components/providers/OrderNotificationProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kitchen System - نظام المطبخ',
  description: 'Restaurant Kitchen Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <ReduxProvider>
          <OrderNotificationProvider>
            {children}
          </OrderNotificationProvider>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#16A34A',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </ReduxProvider>
      </body>
    </html>
  );
}
