'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageSwitcher } from '../molecules/LanguageSwitcher';
import { Button } from '../atoms/Button';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const navItems = [
    { path: '/dashboard', label: t('navigation.dashboard') },
    { path: '/orders', label: t('navigation.orders') },
    { path: '/backend-notes', label: t('navigation.backendNotes') },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-surface shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo / Brand */}
          <Link href="/dashboard" className="text-2xl font-bold text-primary">
            {t('common.appName')}
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-white'
                    : 'text-text hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {user && (
              <span className="hidden sm:inline-block text-sm text-gray-600">
                {user.username}
              </span>
            )}
            <LanguageSwitcher />
            <Button variant="error" size="sm" onClick={logout}>
              {t('common.logout')}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-4 flex gap-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex-1 text-center px-3 py-2 text-sm rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-text hover:bg-gray-200'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};
