
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const defaultUser: User = {
    name: 'Admin User',
    email: 'admin@assetzen.com',
    avatar: 'https://placehold.co/100x100.png',
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User>(defaultUser);

  useEffect(() => {
    try {
        const storedUser = localStorage.getItem('assetzen-user');
        if (storedUser) {
            setUserState(JSON.parse(storedUser));
        }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        // If parsing fails, we can fall back to the default user
        setUserState(defaultUser);
    }
  }, []);

  const setUser = (newUser: User) => {
    try {
        localStorage.setItem('assetzen-user', JSON.stringify(newUser));
        setUserState(newUser);
    } catch (error) {
        console.error("Failed to save user to localStorage", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
