'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toggleLanguage } from '@/lib/redux/slices/languageSlice';
import { IconButton } from '../atoms/IconButton';

export const LanguageSwitcher: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector((state) => state.language.current);

  const handleToggle = () => {
    dispatch(toggleLanguage());
  };

  return (
    <IconButton
      icon={
        <span className="text-sm font-bold">
          {currentLanguage === 'ar' ? 'EN' : 'عر'}
        </span>
      }
      onClick={handleToggle}
      variant="ghost"
      size="md"
      title={currentLanguage === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    />
  );
};
