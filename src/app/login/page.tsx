'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary p-4">
      <div className="absolute top-4 end-4">
        <LanguageSwitcher />
      </div>

      <div className="bg-surface rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            {t('common.appName')}
          </h1>
          <p className="text-gray-600">{t('auth.loginSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>{t('auth.loginSubtitle')}</p>
          <p className="mt-2">kitchen@restaurant.com / admin123</p>
        </div>
      </div>
    </div>
  );
}
