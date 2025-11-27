'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/organisms/Header';
import { Button } from '@/components/atoms/Button';
import { Loader } from '@/components/atoms/Loader';
import { Invoice } from '@/components/organisms/Invoice';
import { useSessions } from '@/hooks/useSessions';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Session } from '@/types';
import { formatOrderTime } from '@/utils/format';

export default function SessionsPage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const { isAuthenticated, isInitialized } = useAuth();
  const {
    sessions,
    loading,
    fetchSessions,
    getSessionById,
    closeSession,
  } = useSessions();

  const [activeTab, setActiveTab] = useState<'active' | 'closed'>('active');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [closingSessionId, setClosingSessionId] = useState<number | null>(null);
  const [closeNotes, setCloseNotes] = useState('');

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isInitialized, router]);

  const loadSessions = async () => {
    const result = await fetchSessions(currentPage);
    setTotalPages(result.totalPages);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadSessions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, currentPage]); // Depend on isAuthenticated and currentPage

  if (!isInitialized || !isAuthenticated) {
    return <Loader fullScreen />;
  }

  const activeSessions = sessions.filter(s => s.status === 'active');
  const closedSessions = sessions.filter(s => s.status === 'closed');
  const displaySessions = activeTab === 'active' ? activeSessions : closedSessions;

  const handleCloseSession = async (sessionId: number) => {
    setClosingSessionId(sessionId);
  };

  const confirmCloseSession = async () => {
    if (!closingSessionId) return;

    const closedSessionData = await closeSession(closingSessionId, closeNotes);

    if (closedSessionData) {
      // Fetch full session details with orders
      const fullSessionData = await getSessionById(closingSessionId);

      if (fullSessionData) {
        setSelectedSession(fullSessionData);
        setShowInvoice(true);
      }
    }

    setClosingSessionId(null);
    setCloseNotes('');
  };

  const handleViewInvoice = async (sessionId: number) => {
    const sessionData = await getSessionById(sessionId);
    if (sessionData) {
      setSelectedSession(sessionData);
      setShowInvoice(true);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 py-8 lg:pr-72">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-text">إدارة الجلسات</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'active'
                  ? 'border-success text-success'
                  : 'border-transparent text-gray-600 hover:text-text'
              }`}
            >
              الجلسات النشطة ({activeSessions.length})
            </button>
            <button
              onClick={() => setActiveTab('closed')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'closed'
                  ? 'border-gray-500 text-gray-700'
                  : 'border-transparent text-gray-600 hover:text-text'
              }`}
            >
              الجلسات المغلقة ({closedSessions.length})
            </button>
          </div>

          {/* Sessions List */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader />
            </div>
          ) : displaySessions.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg shadow-md">
              <p className="text-xl text-gray-500">
                {activeTab === 'active' ? 'لا توجد جلسات نشطة' : 'لا توجد جلسات مغلقة'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {displaySessions.map((session) => {
                const totalAmount = typeof session.totalAmount === 'string'
                  ? parseFloat(session.totalAmount)
                  : session.totalAmount;

                return (
                  <div
                    key={session.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">الطاولة</p>
                        <p className="font-bold text-lg">
                          {session.table?.tableNumber || '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">عدد الضيوف</p>
                        <p className="font-bold text-lg">{session.numberOfGuests}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">المجموع</p>
                        <p className="font-bold text-lg text-primary">
                          {totalAmount.toFixed(2)} ل.س
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">وقت البدء</p>
                        <p className="font-medium">
                          {formatOrderTime(session.startTime, language)}
                        </p>
                      </div>
                      {session.endTime && (
                        <div>
                          <p className="text-sm text-gray-600">وقت الإغلاق</p>
                          <p className="font-medium">
                            {formatOrderTime(session.endTime, language)}
                          </p>
                        </div>
                      )}
                    </div>

                    {session.table?.location && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">الموقع</p>
                        <p className="font-medium">{session.table.location}</p>
                      </div>
                    )}

                    {session.notes && (
                      <div className="mb-4 bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-600 mb-1">ملاحظات:</p>
                        <p className="text-gray-800">{session.notes}</p>
                      </div>
                    )}

                    {session.closedByUser && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">
                          تم الإغلاق بواسطة: {session.closedByUser.username}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      {session.status === 'active' ? (
                        <Button
                          variant="error"
                          onClick={() => handleCloseSession(session.id)}
                          size="sm"
                        >
                          🔒 إغلاق الفاتورة
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          onClick={() => handleViewInvoice(session.id)}
                          size="sm"
                        >
                          🧾 عرض الفاتورة
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="secondary"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                size="sm"
              >
                السابق
              </Button>
              <span className="px-4 py-2">
                صفحة {currentPage} من {totalPages}
              </span>
              <Button
                variant="secondary"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                size="sm"
              >
                التالي
              </Button>
            </div>
          )}
        </main>

        {/* Close Session Modal */}
        {closingSessionId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold mb-4">إغلاق الجلسة</h2>
              <p className="text-gray-600 mb-4">
                هل أنت متأكد من إغلاق هذه الجلسة؟ سيتم عرض الفاتورة بعد الإغلاق.
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات (اختياري)
                </label>
                <textarea
                  value={closeNotes}
                  onChange={(e) => setCloseNotes(e.target.value)}
                  placeholder="مثال: الزبون غادر - دفع كاش"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="error"
                  onClick={confirmCloseSession}
                  fullWidth
                >
                  نعم، إغلاق الجلسة
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setClosingSessionId(null);
                    setCloseNotes('');
                  }}
                  fullWidth
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Modal */}
        {showInvoice && selectedSession && (
          <Invoice
            session={selectedSession}
            onClose={() => {
              setShowInvoice(false);
              setSelectedSession(null);
              loadSessions(); // Refresh the list
            }}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
