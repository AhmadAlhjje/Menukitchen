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
  const { t, language } = useTranslation();
  const { isAuthenticated, isInitialized, user } = useAuth();
  const { tables, loading, fetchTables } = useTables();

  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'occupied' | 'reserved'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const isRTL = language === 'ar';
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const restaurantInfo = {
    name: user?.restaurant?.name || '',
    logo: user?.restaurant?.logoUrl || user?.restaurant?.logo || '',
  };

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

  const handlePrintQR = (table: Table) => {
    const qrImageUrl = `${BASE_URL}${table.qrCodeImage}`;
    const logoUrl = restaurantInfo?.logo ? `${BASE_URL}${restaurantInfo.logo}` : '';
    const restaurantName = restaurantInfo?.name || '';

    // Create print window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('الرجاء السماح بالنوافذ المنبثقة لطباعة رمز QR');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="${isRTL ? 'rtl' : 'ltr'}">
        <head>
          <title>QR Code - ${table.tableNumber}</title>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            @media print {
              @page {
                size: A4;
                margin: 0;
              }
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }

            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: white;
              color: #000;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 0;
            }

            .print-container {
              width: 210mm;
              height: 297mm;
              background: white;
              position: relative;
              overflow: hidden;
            }

            /* Decorative Border Frame */
            .decorative-border {
              position: absolute;
              top: 15mm;
              left: 15mm;
              right: 15mm;
              bottom: 15mm;
              border: 3px solid #000;
              border-radius: 8px;
            }

            .inner-border {
              position: absolute;
              top: 18mm;
              left: 18mm;
              right: 18mm;
              bottom: 18mm;
              border: 1px solid #000;
              border-radius: 6px;
            }

            /* Corner Decorations */
            .corner-decoration {
              position: absolute;
              width: 20mm;
              height: 20mm;
              border: 2px solid #000;
            }

            .corner-top-left {
              top: 20mm;
              ${isRTL ? 'right' : 'left'}: 20mm;
              border-right: none;
              border-bottom: none;
              ${isRTL ? 'border-left: none;' : 'border-right: none;'}
            }

            .corner-top-right {
              top: 20mm;
              ${isRTL ? 'left' : 'right'}: 20mm;
              border-left: none;
              border-bottom: none;
              ${isRTL ? 'border-right: none;' : 'border-left: none;'}
            }

            .corner-bottom-left {
              bottom: 20mm;
              ${isRTL ? 'right' : 'left'}: 20mm;
              border-right: none;
              border-top: none;
              ${isRTL ? 'border-left: none;' : 'border-right: none;'}
            }

            .corner-bottom-right {
              bottom: 20mm;
              ${isRTL ? 'left' : 'right'}: 20mm;
              border-left: none;
              border-top: none;
              ${isRTL ? 'border-right: none;' : 'border-left: none;'}
            }

            /* Content Area */
            .content {
              position: absolute;
              top: 25mm;
              left: 25mm;
              right: 25mm;
              bottom: 25mm;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              text-align: center;
            }

            /* Restaurant Header */
            .restaurant-header {
              width: 100%;
              padding-bottom: 8mm;
              border-bottom: 2px solid #000;
              margin-bottom: 8mm;
            }

            .restaurant-logo {
              max-width: 40mm;
              max-height: 40mm;
              object-fit: contain;
            }

            .restaurant-info {
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: ${isRTL ? 'right' : 'left'};
            }

            .restaurant-name {
              font-size: 24pt;
              font-weight: 700;
              letter-spacing: 1px;
              text-transform: uppercase;
              color: #000;
            }

            .restaurant-tagline {
              font-size: 10pt;
              margin-top: 2mm;
              font-style: italic;
              color: #333;
            }

            /* Table Section */
            .table-section {
              flex: 1;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              width: 100%;
            }

            .table-number-label {
              font-size: 14pt;
              font-weight: 300;
              letter-spacing: 3px;
              text-transform: uppercase;
              margin-bottom: 2mm;
            }

            .table-number {
              font-size: 64pt;
              font-weight: 700;
              margin-bottom: 6mm;
              border: 4px solid #000;
              padding: 8mm 20mm;
              border-radius: 12px;
              color: #000;
              letter-spacing: 2px;
            }

            .table-details {
              display: flex;
              gap: 8mm;
              margin-bottom: 8mm;
              font-size: 11pt;
            }

            .detail-item {
              display: flex;
              align-items: center;
              gap: 2mm;
              padding: 2mm 4mm;
              border: 1px solid #000;
              border-radius: 4px;
            }

            .detail-icon {
              font-weight: 700;
            }

            /* QR Code Section */
            .qr-section {
              width: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
            }

            .qr-container {
              background: white;
              padding: 8mm;
              border: 3px solid #000;
              border-radius: 8px;
              margin-bottom: 4mm;
              box-shadow: inset 0 0 0 1px #000;
            }

            .qr-image {
              width: 60mm;
              height: 60mm;
              display: block;
            }

            .qr-instruction {
              font-size: 12pt;
              font-weight: 600;
              margin-bottom: 2mm;
              text-transform: uppercase;
              letter-spacing: 1px;
            }

            .qr-code-text {
              font-family: 'Courier New', monospace;
              font-size: 8pt;
              color: #666;
              letter-spacing: 1px;
            }

            /* Footer */
            .footer {
              width: 100%;
              padding-top: 6mm;
              border-top: 2px solid #000;
              text-align: center;
            }

            .footer-text {
              font-size: 9pt;
              font-style: italic;
            }

            .divider-line {
              height: 2px;
              background: #000;
              width: 60mm;
              margin: 4mm auto;
            }

            /* Pattern Background */
            .pattern-bg {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              opacity: 0.03;
              background-image: 
                repeating-linear-gradient(45deg, transparent, transparent 10mm, #000 10mm, #000 10.5mm);
              pointer-events: none;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <!-- Pattern Background -->
            <div class="pattern-bg"></div>

            <!-- Decorative Borders -->
            <div class="decorative-border"></div>
            <div class="inner-border"></div>
            
            <!-- Corner Decorations -->
            <div class="corner-decoration corner-top-left"></div>
            <div class="corner-decoration corner-top-right"></div>
            <div class="corner-decoration corner-bottom-left"></div>
            <div class="corner-decoration corner-bottom-right"></div>

            <!-- Main Content -->
            <div class="content">
              <!-- Restaurant Header -->
              <div class="restaurant-header">
                <div class="restaurant-info">
                  ${restaurantName ? `
                    <div style="flex: 1; text-align: ${isRTL ? 'right' : 'left'};">
                      <div class="restaurant-name">${restaurantName}</div>
                      <div class="restaurant-tagline">${isRTL ? 'تجربة طعام استثنائية' : 'Exceptional Dining Experience'}</div>
                    </div>
                  ` : ''}
                  ${logoUrl ? `
                    <div>
                      <img src="${logoUrl}" alt="Restaurant Logo" class="restaurant-logo" />
                    </div>
                  ` : ''}
                </div>
              </div>

              <!-- Table Section -->
              <div class="table-section">
                <div class="table-number-label">${isRTL ? 'طاولة رقم' : 'Table Number'}</div>
                <div class="table-number">${table.tableNumber}</div>
                
                <div class="table-details">
                  <div class="detail-item">
                    <span class="detail-icon">👥</span>
                    <span>${table.capacity} ${isRTL ? 'شخص' : 'Guests'}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-icon">📍</span>
                    <span>${table.location || '-'}</span>
                  </div>
                </div>

                <div class="divider-line"></div>

                <!-- QR Code -->
                <div class="qr-section">
                  <div class="qr-instruction">
                    ${isRTL ? 'امسح الرمز لعرض القائمة' : 'Scan to View Menu'}
                  </div>
                  <div class="qr-container">
                    <img src="${qrImageUrl}" alt="QR Code" class="qr-image" />
                  </div>
                  <div class="qr-code-text">${table.qrCode}</div>
                </div>
              </div>

              <!-- Footer -->
              <div class="footer">
                <div class="footer-text">
                  ${isRTL ? 'استمتع بوجبتك وشاركنا تجربتك' : 'Enjoy your meal and share your experience'}
                </div>
              </div>
            </div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
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

                    {/* Print QR Button */}
                    {table.qrCodeImage && (
                      <Button
                        variant="secondary"
                        fullWidth
                        size="sm"
                        onClick={() => handlePrintQR(table)}
                      >
                        🖨️ طباعة QR
                      </Button>
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