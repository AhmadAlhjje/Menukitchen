/**
 * Format currency amount in SAR
 */
export const formatCurrency = (amount: number, locale: string = 'ar-SA'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format date to readable format
 */
export const formatDate = (date: string | Date, locale: string = 'ar-SA'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

/**
 * Format time to readable format
 */
export const formatTime = (date: string | Date, locale: string = 'ar-SA'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(dateObj);
};

/**
 * Format date and time together
 */
export const formatDateTime = (date: string | Date, locale: string = 'ar-SA'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
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
