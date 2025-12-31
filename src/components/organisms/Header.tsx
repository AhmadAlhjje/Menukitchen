'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LanguageSwitcher } from '../molecules/LanguageSwitcher';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t, language } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [targetPath, setTargetPath] = useState<string | null>(null);

  const navItems = [
    { path: '/dashboard', label: t('navigation.dashboard'), icon: 'dashboard' },
    { path: '/orders', label: t('navigation.orders'), icon: 'orders' },
    { path: '/sessions', label: 'الجلسات', icon: 'sessions' },
    { path: '/menu-items', label: 'عناصر القائمة', icon: 'food' },
    { path: '/tables', label: 'الطاولات', icon: 'table' },
  ];

  const isActive = (path: string) => pathname === path;

  // Stop navigation loading when pathname changes
  useEffect(() => {
    setIsNavigating(false);
    setTargetPath(null);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setIsNavigating(true);
    setTargetPath(path);
    setIsSidebarOpen(false);
    router.push(path);
  };

  return (
    <>
      {/* Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-lg font-semibold text-text">
              {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
            </p>
            {targetPath && (
              <p className="text-sm text-text-light">
                {navItems.find(item => item.path === targetPath)?.label}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Fixed Sidebar - Desktop (Always Visible) */}
      <aside
        className="hidden lg:flex lg:fixed lg:top-0 lg:right-0 lg:h-screen lg:w-72 lg:flex-col lg:bg-surface lg:shadow-2xl lg:z-40 lg:border-l lg:border-border"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Sidebar Header */}
        <div className="sticky top-0 bg-primary p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Icon name="restaurant" className="text-primary" size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">{t('common.appName')}</h2>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto bg-surface">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={(e) => handleNavClick(e, item.path)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-primary text-white'
                  : 'text-text hover:bg-primary-50'
              } ${isNavigating && targetPath === item.path ? 'opacity-50 cursor-wait' : ''}`}
            >
              <Icon name={item.icon} size={20} className={isActive(item.path) ? 'text-white' : 'text-primary'} />
              <span className="font-medium">{item.label}</span>
              {isNavigating && targetPath === item.path && (
                <div className="ml-auto">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border bg-surface">
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
      <header className="lg:hidden bg-surface sticky top-0 z-50 shadow-lg border-b border-border">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 hover:bg-primary-50 active:scale-95"
            aria-label="Toggle menu"
            aria-expanded={isSidebarOpen}
          >
            <svg
              className={`w-6 h-6 text-primary transition-transform duration-300 ${
                isSidebarOpen ? 'rotate-90' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              {isSidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Logo / Brand */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-bold text-primary"
          >
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="restaurant" className="text-white" size={20} />
            </div>
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
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 right-0 h-screen w-72 bg-surface shadow-2xl transform transition-transform duration-300 ease-out z-50 border-l border-border ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Sidebar Header */}
        <div className="sticky top-0 bg-primary p-5 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Icon name="restaurant" className="text-primary" size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">{t('common.appName')}</h2>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/20 transition-colors"
              aria-label="Close menu"
            >
              <Icon name="close" className="text-white" size={20} />
            </button>
          </div>
          {user && (
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg p-2.5">
              <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                <Icon name="user" className="text-primary" size={18} />
              </div>
              <span className="text-sm font-medium text-white">{user.username}</span>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 overflow-y-auto bg-surface" style={{ maxHeight: 'calc(100vh - 220px)' }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={(e) => handleNavClick(e, item.path)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-primary text-white'
                  : 'text-text hover:bg-primary-50'
              } ${isNavigating && targetPath === item.path ? 'opacity-50 cursor-wait' : ''}`}
            >
              <Icon name={item.icon} size={20} className={isActive(item.path) ? 'text-white' : 'text-primary'} />
              <span className="font-medium">{item.label}</span>
              {isNavigating && targetPath === item.path && (
                <div className="ml-auto">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-surface">
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
