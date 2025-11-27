'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/organisms/Header';
import { Button } from '@/components/atoms/Button';
import { Loader } from '@/components/atoms/Loader';
import { useTables } from '@/hooks/useTables';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Table } from '@/types';

export default function TablesPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated, isInitialized } = useAuth();
  const { tables, loading, fetchTables } = useTables();

  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'occupied' | 'reserved'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isInitialized, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTables();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]); // Only depend on isAuthenticated

  if (!isInitialized || !isAuthenticated) {
    return <Loader fullScreen />;
  }

  // Filter tables
  const filteredTables = tables.filter(table => {
    const matchesSearch = searchTerm === '' ||
      table.tableNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (table.location && table.location.includes(searchTerm));

    const matchesStatus = filterStatus === 'all' || table.status === filterStatus;

    return matchesSearch && matchesStatus && table.isActive;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-red-100 text-red-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'متاحة';
      case 'occupied':
        return 'مشغولة';
      default:
        return status;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 py-8 lg:pr-72">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-text">إدارة الطاولات</h1>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  بحث
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث برقم الطاولة أو الموقع..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحالة
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">الكل</option>
                  <option value="available">متاحة</option>
                  <option value="occupied">مشغولة</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tables Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader />
            </div>
          ) : filteredTables.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg shadow-md">
              <p className="text-xl text-gray-500">لا توجد طاولات</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTables.map((table) => (
                <div
                  key={table.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
                >
                  {/* QR Code Image */}
                  {table.qrCodeImage && (
                    <div className="bg-gray-100 p-4 flex justify-center">
                      <div className="relative w-32 h-32">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}${table.qrCodeImage}`}
                          alt={`QR Code for Table ${table.tableNumber}`}
                          fill
                          className="object-contain"
                          priority={false}
                        />
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-text">
                          طاولة {table.tableNumber}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {table.qrCode}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          table.status
                        )}`}
                      >
                        {getStatusText(table.status)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <span className="text-gray-600 ml-2">السعة:</span>
                        <span className="font-semibold">
                          {table.capacity} أشخاص
                        </span>
                      </div>

                      {table.location && (
                        <div className="flex items-center text-sm">
                          <span className="text-gray-600 ml-2">الموقع:</span>
                          <span className="font-semibold">{table.location}</span>
                        </div>
                      )}

                      <div className="text-xs text-gray-500 mt-2">
                        آخر تحديث: {new Date(table.updatedAt).toLocaleDateString('ar-SA')}
                      </div>
                    </div>

                    {/* Download QR Button */}
                    {table.qrCodeImage && (
                      <a
                        href={`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}${table.qrCodeImage}`}
                        download={`table-${table.tableNumber}-qr.png`}
                        className="block"
                      >
                        <Button variant="secondary" fullWidth size="sm">
                          📥 تحميل QR
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="mt-6 bg-white rounded-lg shadow-md p-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{tables.length}</p>
                <p className="text-sm text-gray-600">إجمالي الطاولات</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">
                  {tables.filter(t => t.status === 'available').length}
                </p>
                <p className="text-sm text-gray-600">متاحة</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-error">
                  {tables.filter(t => t.status === 'occupied').length}
                </p>
                <p className="text-sm text-gray-600">مشغولة</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">
                  {tables.filter(t => t.status === 'reserved').length}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
