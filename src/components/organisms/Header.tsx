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
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Top Bar */}
      <header className="bg-surface shadow-md sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-4">
          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-2xl text-text transition-colors hover:text-primary"
          >
            {isSidebarOpen ? '✕' : '☰'}
          </button>

          {/* Logo / Brand */}
          <Link href="/dashboard" className="text-xl font-bold text-primary">
            {t('common.appName')}
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-screen w-64 bg-surface shadow-lg transform transition-transform duration-300 z-50 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-primary">{t('common.appName')}</h2>
          {user && (
            <p className="text-sm text-gray-600 mt-2">👤 {user.username}</p>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive(item.path)
                  ? 'bg-primary text-white shadow-md'
                  : 'text-text hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gradient-to-t from-gray-50">
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

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};
