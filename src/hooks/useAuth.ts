"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User, UserRole } from '@/types';
import { AUTH_COOKIE_NAME, APP_ROUTES } from '@/lib/authConstants';

interface AuthHook {
  user: User | null;
  isLoading: boolean;
  login: (userData: User, redirectTo?: string) => void;
  logout: (redirectTo?: string) => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

// Mock function to simulate getting user from cookie
const getUserFromCookie = (): User | null => {
  if (typeof window === 'undefined') return null;
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${AUTH_COOKIE_NAME}=`))
    ?.split('=')[1];
  if (cookieValue) {
    try {
      return JSON.parse(decodeURIComponent(cookieValue));
    } catch (error) {
      console.error("Failed to parse auth cookie", error);
      // Clear corrupted cookie
      document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax; Secure`;
      return null;
    }
  }
  return null;
};

export function useAuth(): AuthHook {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getUserFromCookie();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = useCallback((userData: User, redirectTo: string = APP_ROUTES.DASHBOARD) => {
    const cookieValue = encodeURIComponent(JSON.stringify(userData));
    // Set cookie to expire in 7 days
    document.cookie = `${AUTH_COOKIE_NAME}=${cookieValue}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure`;
    setUser(userData);
    router.push(redirectTo);
  }, [router]);

  const logout = useCallback((redirectTo: string = APP_ROUTES.LOGIN) => {
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax; Secure`;
    setUser(null);
    router.push(redirectTo);
  }, [router]);

  const hasRole = useCallback((roleOrRoles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(roleOrRoles)) {
      return roleOrRoles.includes(user.role);
    }
    return user.role === roleOrRoles;
  }, [user]);


  return { user, isLoading, login, logout, hasRole };
}
