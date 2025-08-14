
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../dashboard-layout';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const syncLogout = useCallback((event: StorageEvent) => {
    if (event.key === 'isAuthenticated' && event.newValue === null) {
      console.log('logout event detected');
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    window.addEventListener('storage', syncLogout);
    return () => {
      window.removeEventListener('storage', syncLogout);
    };
  }, [syncLogout]);

  useEffect(() => {
    // This check should be quick and based on a client-side token/flag.
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
        setIsAuthenticated(true);
    } else {
        router.push('/login');
    }
  }, [router]);

  if (isAuthenticated === null) {
    // Render a loading state or nothing while checking auth
    return null; // Or a proper loading spinner component
  }
  
  return <DashboardLayout>{children}</DashboardLayout>;
}
