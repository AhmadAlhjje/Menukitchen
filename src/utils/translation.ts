import { Translation, Language } from '@/types';
import arTranslations from '@/translations/ar.json';
import enTranslations from '@/translations/en.json';

const translations: Record<Language, Translation> = {
  ar: arTranslations,
  en: enTranslations,
};

/**
 * Get translation for a key
 * Supports nested keys with dot notation (e.g., "common.login")
 */
export const getTranslation = (
  key: string,
  lang: Language = 'ar',
  defaultValue?: string
): string => {
  const keys = key.split('.');
  let value: any = translations[lang];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return defaultValue || key;
    }
  }

  return typeof value === 'string' ? value : defaultValue || key;
};

/**
 * Get all translations for current language
 */
export const getTranslations = (lang: Language = 'ar'): Translation => {
  return translations[lang];
};

/**
 * Check if translation key exists
 */
export const hasTranslation = (key: string, lang: Language = 'ar'): boolean => {
  const keys = key.split('.');
  let value: any = translations[lang];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return false;
    }
  }

  return typeof value === 'string';
};
