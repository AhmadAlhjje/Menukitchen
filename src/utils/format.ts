/**
 * Format currency amount in SYP
 */
export const formatCurrency = (amount: number, locale: string = 'ar-SA'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'SYP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date to readable format
 */
export const formatDate = (date: string | Date, locale: string = 'ar-SA'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Use Gregorian calendar for Arabic locale to avoid Hijri dates
  const effectiveLocale = locale === 'ar-SA' ? 'ar-EG' : locale;

  return new Intl.DateTimeFormat(effectiveLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    calendar: 'gregory',
  }).format(dateObj);
};

/**
 * Format time to readable format
 */
export const formatTime = (date: string | Date, locale: string = 'ar-SA'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Use Gregorian calendar for Arabic locale to avoid Hijri dates
  const effectiveLocale = locale === 'ar-SA' ? 'ar-EG' : locale;

  return new Intl.DateTimeFormat(effectiveLocale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    calendar: 'gregory',
  }).format(dateObj);
};

/**
 * Format date and time together
 */
export const formatDateTime = (date: string | Date, locale: string = 'ar-SA'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Use Gregorian calendar for Arabic locale to avoid Hijri dates
  const effectiveLocale = locale === 'ar-SA' ? 'ar-EG' : locale;

  return new Intl.DateTimeFormat(effectiveLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    calendar: 'gregory',
  }).format(dateObj);
};

/**
 * Format order time in a clear and beautiful format
 */
export const formatOrderTime = (date: string | Date, locale: string = 'ar'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60));

  // If the order is from today, show relative time
  if (diffInHours < 24 && dateObj.getDate() === now.getDate()) {
    const effectiveLocale = locale === 'ar' ? 'ar-EG' : 'en-US';
    const timeStr = new Intl.DateTimeFormat(effectiveLocale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      calendar: 'gregory',
    }).format(dateObj);

    return locale === 'ar' ? `اليوم ${timeStr}` : `Today ${timeStr}`;
  }

  // Otherwise show full date and time
  const effectiveLocale = locale === 'ar' ? 'ar-EG' : 'en-US';
  return new Intl.DateTimeFormat(effectiveLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    calendar: 'gregory',
  }).format(dateObj);
};

/**
 * Get relative time (e.g., "5 minutes ago")
 */
export const getRelativeTime = (date: string | Date, locale: string = 'ar'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return locale === 'ar' ? 'الآن' : 'now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return locale === 'ar'
      ? `منذ ${diffInMinutes} دقيقة`
      : `${diffInMinutes} min ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return locale === 'ar' ? `منذ ${diffInHours} ساعة` : `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return locale === 'ar' ? `منذ ${diffInDays} يوم` : `${diffInDays}d ago`;
};

/**
 * Format number with thousands separator
 */
export const formatNumber = (num: number, locale: string = 'ar-SA'): string => {
  return new Intl.NumberFormat(locale).format(num);
};
