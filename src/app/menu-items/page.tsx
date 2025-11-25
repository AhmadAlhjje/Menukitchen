'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/organisms/Header';
import { Button } from '@/components/atoms/Button';
import { Loader } from '@/components/atoms/Loader';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { MenuItem } from '@/types';

export default function MenuItemsPage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const { isAuthenticated, isInitialized } = useAuth();
  const {
    menuItems,
    loading,
    fetchMenuItems,
    toggleItemAvailability,
    getItemFirstImage,
  } = useMenuItems();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<number | null>(null);
  const [filterAvailability, setFilterAvailability] = useState<'all' | 'available' | 'unavailable'>('all');

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isInitialized, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMenuItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]); // Only depend on isAuthenticated

  if (!isInitialized || !isAuthenticated) {
    return <Loader fullScreen />;
  }

  // Get unique categories
  const categories = Array.from(
    new Map(
      menuItems
        .filter(item => item.category)
        .map(item => [item.category!.id, item.category!])
    ).values()
  );

  // Filter items
  const filteredItems = menuItems.filter(item => {
    // Search filter
    const matchesSearch = searchTerm === '' ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nameAr.includes(searchTerm);

    // Category filter
    const matchesCategory = filterCategory === null || item.categoryId === filterCategory;

    // Availability filter
    const matchesAvailability =
      filterAvailability === 'all' ||
      (filterAvailability === 'available' && item.isAvailable) ||
      (filterAvailability === 'unavailable' && !item.isAvailable);

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const handleToggleAvailability = async (item: MenuItem) => {
    await toggleItemAvailability(item.id, !item.isAvailable);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-text">إدارة عناصر القائمة</h1>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  بحث
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث عن صنف..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الفئة
                </label>
                <select
                  value={filterCategory || ''}
                  onChange={(e) => setFilterCategory(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">جميع الفئات</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {language === 'ar' ? category.nameAr : category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التوفر
                </label>
                <select
                  value={filterAvailability}
                  onChange={(e) => setFilterAvailability(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">الكل</option>
                  <option value="available">متاح</option>
                  <option value="unavailable">غير متاح</option>
                </select>
              </div>
            </div>
          </div>

          {/* Items Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg shadow-md">
              <p className="text-xl text-gray-500">لا توجد عناصر</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const firstImage = getItemFirstImage(item);
                const itemName = language === 'ar' ? item.nameAr : item.name;
                const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg ${
                      !item.isAvailable ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Image */}
                    {firstImage ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}${firstImage}`}
                        alt={itemName}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-4xl">🍽️</span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-text">{itemName}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.isAvailable
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.isAvailable ? 'متاح' : 'غير متاح'}
                        </span>
                      </div>

                      {item.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-primary">
                          {price.toFixed(2)} ر.س
                        </span>
                        <span className="text-sm text-gray-500">
                          ⏱️ {item.preparationTime} دقيقة
                        </span>
                      </div>

                      {item.category && (
                        <div className="text-xs text-gray-500 mb-3">
                          الفئة: {language === 'ar' ? item.category.nameAr : item.category.name}
                        </div>
                      )}

                      {/* Toggle Availability Button */}
                      <Button
                        variant={item.isAvailable ? 'error' : 'success'}
                        onClick={() => handleToggleAvailability(item)}
                        fullWidth
                        size="sm"
                      >
                        {item.isAvailable ? '❌ تعطيل' : '✅ تفعيل'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Stats */}
          <div className="mt-6 bg-white rounded-lg shadow-md p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{menuItems.length}</p>
                <p className="text-sm text-gray-600">إجمالي الأصناف</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">
                  {menuItems.filter(i => i.isAvailable).length}
                </p>
                <p className="text-sm text-gray-600">متاح</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-error">
                  {menuItems.filter(i => !i.isAvailable).length}
                </p>
                <p className="text-sm text-gray-600">غير متاح</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
