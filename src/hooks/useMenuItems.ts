'use client';

import { useState, useCallback } from 'react';
import axiosInstance from '@/lib/axios';
import { MenuItem } from '@/types';
import toast from 'react-hot-toast';

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all menu items
  const fetchMenuItems = useCallback(async () => {
    try {
      console.log('[useMenuItems] Fetching menu items...');
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get('/api/menu/items');
      console.log('[useMenuItems] Response:', response.data);

      const items: MenuItem[] = response.data.data || [];
      setMenuItems(items);

      return items;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'فشل تحميل عناصر القائمة';
      setError(errorMessage);
      console.error('[useMenuItems] Error:', err);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle item availability
  const toggleItemAvailability = useCallback(
    async (itemId: number, isAvailable: boolean) => {
      try {
        console.log('[useMenuItems] Toggling availability for item:', itemId, 'to:', isAvailable);

        const response = await axiosInstance.patch(
          `/api/menu/items/${itemId}/availability`,
          { isAvailable }
        );

        console.log('[useMenuItems] Toggle response:', response.data);

        // Update local state
        setMenuItems(prev =>
          prev.map(item =>
            item.id === itemId ? { ...item, isAvailable } : item
          )
        );

        toast.success(
          isAvailable ? 'تم تفعيل الصنف بنجاح' : 'تم تعطيل الصنف بنجاح'
        );

        return true;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'فشل تحديث حالة الصنف';
        toast.error(errorMessage);
        console.error('[useMenuItems] Error toggling availability:', err);
        return false;
      }
    },
    []
  );

  // Parse images from JSON string or array
  const getItemImages = useCallback((item: MenuItem): string[] => {
    if (!item.images) return [];

    console.log('[useMenuItems] Processing images for item:', item.id, 'Type:', typeof item.images, 'Value:', item.images);

    // If already an array, return it
    if (Array.isArray(item.images)) {
      console.log('[useMenuItems] Images is already an array:', item.images);
      return item.images;
    }

    // If it's a string, try to parse it
    try {
      const images = JSON.parse(item.images);
      console.log('[useMenuItems] Parsed images:', images);
      return Array.isArray(images) ? images : [];
    } catch (error) {
      console.error('[useMenuItems] Error parsing images:', error);
      return [];
    }
  }, []);

  // Get first image
  const getItemFirstImage = useCallback((item: MenuItem): string | null => {
    const images = getItemImages(item);
    return images.length > 0 ? images[0] : null;
  }, [getItemImages]);

  return {
    menuItems,
    loading,
    error,
    fetchMenuItems,
    toggleItemAvailability,
    getItemImages,
    getItemFirstImage,
  };
};
