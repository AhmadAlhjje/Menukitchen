'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/atoms/Loader';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard by default
    const token = localStorage.getItem('kitchen_token');
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return <Loader fullScreen />;
}
