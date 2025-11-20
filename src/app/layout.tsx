import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { ReduxProvider } from '@/lib/redux/provider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto'],
});

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
      <body className={inter.className}>
        <ReduxProvider>
          {children}
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
