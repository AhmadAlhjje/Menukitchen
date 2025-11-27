'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { LanguageSwitcher } from '@/components/molecules/LanguageSwitcher';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { isValidEmail, isEmpty } from '@/utils/validation';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading, isInitialized } = useAuth();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  // Redirect if already authenticated
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isInitialized, router]);

  const validate = (): boolean => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (isEmpty(email)) {
      newErrors.email = t('errors.validationError');
      isValid = false;
    } else if (!isValidEmail(email)) {
      newErrors.email = t('errors.validationError');
      isValid = false;
    }

    if (isEmpty(password)) {
      newErrors.password = t('errors.validationError');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await login({ email, password });
    } catch (error) {
      // Error handled by useAuth hook
      console.error('Login error:', error);
    }
  };

  if (!isInitialized) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-6 end-6">
        <LanguageSwitcher />
      </div>

      <div className="bg-surface rounded-lg shadow-md border border-border p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
            <Icon name="restaurant" className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-text mb-2">
            {t('common.appName')}
          </h1>
          <p className="text-text-light text-sm">{t('auth.loginSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="email"
            label={t('common.email')}
            placeholder={t('auth.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            fullWidth
            autoComplete="email"
            disabled={loading}
          />

          <Input
            type="password"
            label={t('common.password')}
            placeholder={t('auth.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            fullWidth
            autoComplete="current-password"
            disabled={loading}
          />

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
            {loading ? t('auth.loggingIn') : t('auth.loginButton')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <div className="bg-primary-50 rounded-lg p-3 border border-primary-100">
            <p className="text-xs text-text-light font-medium mb-1">{t('auth.loginSubtitle')}</p>
            <p className="text-xs font-mono text-text">kitchen@restaurant.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
