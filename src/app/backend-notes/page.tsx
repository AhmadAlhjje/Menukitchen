'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/organisms/Header';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Badge } from '@/components/atoms/Badge';
import { Loader } from '@/components/atoms/Loader';
import { EmptyState } from '@/components/molecules/EmptyState';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { BackendNote } from '@/types';
import { downloadTextFile } from '@/utils/download';
import toast from 'react-hot-toast';

export default function BackendNotesPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated, isInitialized } = useAuth();

  const [notes, setNotes] = useState<BackendNote[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    endpoint: '',
    type: 'bug' as 'bug' | 'missing' | 'enhancement',
    severity: 'medium' as 'high' | 'medium' | 'low',
  });

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Load notes from localStorage
    if (isAuthenticated) {
      loadNotes();
    }
  }, [isAuthenticated, isInitialized, router]);

  const loadNotes = () => {
    const savedNotes = localStorage.getItem('backend_notes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    }
  };

  const saveNotes = (newNotes: BackendNote[]) => {
    localStorage.setItem('backend_notes', JSON.stringify(newNotes));
    setNotes(newNotes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.endpoint) {
      toast.error(t('errors.validationError'));
      return;
    }

    const newNote: BackendNote = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
    };

    saveNotes([...notes, newNote]);
    setFormData({
      title: '',
      description: '',
      endpoint: '',
      type: 'bug',
      severity: 'medium',
    });
    setShowForm(false);
    toast.success('تمت إضافة الملاحظة بنجاح');
  };

  const handleDelete = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    saveNotes(updatedNotes);
    toast.success('تم حذف الملاحظة');
  };

  const handleDownload = () => {
    if (notes.length === 0) {
      toast.error('لا توجد ملاحظات للتحميل');
      return;
    }

    let content = '='.repeat(80) + '\n';
    content += 'BACKEND FIXES & ENHANCEMENTS REQUIRED\n';
    content += 'Restaurant Kitchen System\n';
    content += '='.repeat(80) + '\n\n';

    notes.forEach((note, index) => {
      content += `${index + 1}. ${note.title.toUpperCase()}\n`;
      content += '-'.repeat(80) + '\n';
      content += `Type: ${note.type.toUpperCase()}\n`;
      content += `Severity: ${note.severity.toUpperCase()}\n`;
      content += `Endpoint: ${note.endpoint}\n\n`;
      content += `Description:\n${note.description}\n\n`;
      content += `Date: ${new Date(note.createdAt).toLocaleString()}\n`;
      content += '='.repeat(80) + '\n\n';
    });

    content += `\nTotal Issues: ${notes.length}\n`;
    content += `Generated: ${new Date().toLocaleString()}\n`;

    downloadTextFile(content, 'backend-fixes.txt');
    toast.success(t('backendNotes.downloadSuccess'));
  };

  if (!isInitialized || !isAuthenticated) {
    return <Loader fullScreen />;
  }

  const typeColors: Record<string, 'error' | 'warning' | 'success'> = {
    bug: 'error',
    missing: 'warning',
    enhancement: 'success',
  };

  const severityColors: Record<string, 'error' | 'warning' | 'default'> = {
    high: 'error',
    medium: 'warning',
    low: 'default',
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">
            {t('backendNotes.title')}
          </h1>
          <p className="text-gray-600">{t('backendNotes.subtitle')}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-6">
          <Button
            variant="primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? t('common.cancel') : t('backendNotes.addNote')}
          </Button>
          {notes.length > 0 && (
            <Button variant="success" onClick={handleDownload}>
              {t('backendNotes.downloadFile')}
            </Button>
          )}
        </div>

        {/* Add Note Form */}
        {showForm && (
          <Card className="mb-6">
            <h2 className="text-xl font-bold text-text mb-4">
              {t('backendNotes.addNote')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label={t('backendNotes.noteTitle')}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                fullWidth
              />

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  {t('backendNotes.description')}
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <Input
                label={t('backendNotes.endpoint')}
                value={formData.endpoint}
                onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                placeholder="/api/example"
                required
                fullWidth
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    {t('backendNotes.type')}
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  >
                    <option value="bug">{t('backendNotes.bug')}</option>
                    <option value="missing">{t('backendNotes.missing')}</option>
                    <option value="enhancement">{t('backendNotes.enhancement')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    {t('backendNotes.severity')}
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                  >
                    <option value="high">{t('backendNotes.high')}</option>
                    <option value="medium">{t('backendNotes.medium')}</option>
                    <option value="low">{t('backendNotes.low')}</option>
                  </select>
                </div>
              </div>

              <Button type="submit" variant="primary" fullWidth>
                {t('common.save')}
              </Button>
            </form>
          </Card>
        )}

        {/* Notes List */}
        {notes.length === 0 ? (
          <EmptyState
            title={t('backendNotes.noNotes')}
            icon={
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {notes.map((note) => (
              <Card key={note.id}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-text">{note.title}</h3>
                  <div className="flex gap-2">
                    <Badge variant={typeColors[note.type]}>{note.type}</Badge>
                    <Badge variant={severityColors[note.severity]}>{note.severity}</Badge>
                  </div>
                </div>

                <p className="text-gray-600 mb-3">{note.description}</p>

                <div className="bg-gray-50 rounded p-2 mb-3">
                  <code className="text-sm text-primary">{note.endpoint}</code>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                  <Button
                    variant="error"
                    size="sm"
                    onClick={() => handleDelete(note.id)}
                  >
                    {t('common.delete')}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
