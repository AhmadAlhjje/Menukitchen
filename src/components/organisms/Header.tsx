'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageSwitcher } from '../molecules/LanguageSwitcher';
import { Button } from '../atoms/Button';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t, language } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: t('navigation.dashboard'), icon: '📊' },
    { path: '/orders', label: t('navigation.orders'), icon: '📋' },
    { path: '/sessions', label: 'الجلسات', icon: '🪑' },
    { path: '/menu-items', label: 'عناصر القائمة', icon: '🍽️' },
    { path: '/tables', label: 'الطاولات', icon: '🏪' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Fixed Sidebar - Desktop (Always Visible) */}
      <aside
        className="hidden lg:flex lg:fixed lg:top-0 lg:right-0 lg:h-screen lg:w-72 lg:flex-col lg:bg-gradient-to-b lg:from-surface lg:to-gray-50 lg:shadow-xl lg:z-40"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Sidebar Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🍽️</span>
            <h2 className="text-2xl font-bold text-primary">{t('common.appName')}</h2>
          </div>
          {user && (
            <div className="flex items-center gap-2 bg-primary/10 rounded-lg p-3">
              <span className="text-lg">👤</span>
              <span className="text-sm font-semibold text-text">{user.username}</span>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/30'
                  : 'text-text hover:bg-gray-100 active:scale-95'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {isActive(item.path) && (
                <svg
                  className="w-5 h-5 ml-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 bg-white/80 backdrop-blur-md">
          <Button
            variant="error"
            size="sm"
            onClick={() => logout()}
            fullWidth
          >
            {t('common.logout')}
          </Button>
        </div>
      </aside>

      {/* Fixed Top Bar - Mobile & Tablet */}
      <header className="lg:hidden bg-surface sticky top-0 z-50 shadow-md border-b border-gray-200/50">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 hover:bg-gray-100 active:scale-95"
            aria-label="Toggle menu"
            aria-expanded={isSidebarOpen}
          >
            <svg
              className={`w-6 h-6 text-text transition-transform duration-300 ${
                isSidebarOpen ? 'rotate-90' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isSidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Logo / Brand */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-2xl font-bold text-primary transition-transform hover:scale-105"
          >
            <span>🍽️</span>
            <span>{t('common.appName')}</span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 right-0 h-screen w-72 bg-gradient-to-b from-surface to-gray-50 shadow-2xl transform transition-transform duration-300 ease-out z-50 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Sidebar Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200/50 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🍽️</span>
              <h2 className="text-2xl font-bold text-primary">{t('common.appName')}</h2>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="w-5 h-5 text-text"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {user && (
            <div className="flex items-center gap-2 bg-primary/10 rounded-lg p-3">
              <span className="text-lg">👤</span>
              <span className="text-sm font-semibold text-text">{user.username}</span>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/30'
                  : 'text-text hover:bg-gray-100 active:scale-95'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {isActive(item.path) && (
                <svg
                  className="w-5 h-5 ml-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white/80 backdrop-blur-md">
          <Button
            variant="error"
            size="sm"
            onClick={() => {
              logout();
              setIsSidebarOpen(false);
            }}
            fullWidth
          >
            {t('common.logout')}
          </Button>
        </div>
      </aside>
    </>
  );
};
