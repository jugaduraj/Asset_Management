
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useCookies } from 'next-client-cookies';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const cookies = useCookies();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!cookies.get('auth-token'));
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(false);
  }, []);
  
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && pathname !== '/login') {
        router.push('/login');
      } else if (isAuthenticated && pathname === '/login') {
        router.push('/dashboard');
      }
    }
  }, [pathname, isAuthenticated, isLoading, router]);

  const login = () => {
    cookies.set('auth-token', 'true', { path: '/' }); // Expires on session end
    setIsAuthenticated(true);
  };

  const logout = () => {
    cookies.remove('auth-token');
    setIsAuthenticated(false);
    router.push('/login');
  };

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
