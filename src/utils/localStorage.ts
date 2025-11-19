/**
 * Safe localStorage wrapper with error handling
 */

export const storage = {
  /**
   * Get item from localStorage
   */
  get: <T = string>(key: string, defaultValue?: T): T | null => {
    if (typeof window === 'undefined') return defaultValue || null;

    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue || null;

      // Try to parse JSON, if fails return as string
      try {
        return JSON.parse(item) as T;
      } catch {
        return item as T;
      }
    } catch (error) {
      console.error(`Error getting item "${key}" from localStorage:`, error);
      return defaultValue || null;
    }
  },

  /**
   * Set item in localStorage
   */
  set: (key: string, value: any): boolean => {
    if (typeof window === 'undefined') return false;

    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
      return true;
    } catch (error) {
      console.error(`Error setting item "${key}" in localStorage:`, error);
      return false;
    }
  },

  /**
   * Remove item from localStorage
   */
  remove: (key: string): boolean => {
    if (typeof window === 'undefined') return false;

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item "${key}" from localStorage:`, error);
      return false;
    }
  },

  /**
   * Clear all localStorage
   */
  clear: (): boolean => {
    if (typeof window === 'undefined') return false;

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  /**
   * Check if key exists
   */
  has: (key: string): boolean => {
    if (typeof window === 'undefined') return false;

    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`Error checking key "${key}" in localStorage:`, error);
      return false;
    }
  },
};
