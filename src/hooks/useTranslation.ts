'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import { getTranslation } from '@/utils/translation';

export const useTranslation = () => {
  const language = useAppSelector((state) => state.language.current);

  const t = (key: string, defaultValue?: string): string => {
    return getTranslation(key, language, defaultValue);
  };

  return { t, language };
};
