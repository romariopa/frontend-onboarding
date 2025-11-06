'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import type { LoginRequest } from '@/types';
import { ROUTES } from '@/utils/constants';

export function useAuth() {
  const router = useRouter();
  const { setTokens, clearAuth } = useAuthStore();

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);
      setTokens(response.access_token, response.refresh_token);
      router.push(ROUTES.DASHBOARD);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    clearAuth();
    router.push(ROUTES.LOGIN);
  };

  return { login, logout };
}

