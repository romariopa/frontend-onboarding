'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import type { DecodedToken } from '@/types';
import { AUTH_CONFIG } from '@/utils/constants';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
  isTokenExpired: (token: string | null) => boolean;
  getTokenExpiration: (token: string | null) => number | null;
  validateAndRestoreSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setTokens: (accessToken: string, refreshToken: string) => {
        // Verificar que los tokens sean válidos antes de establecerlos
        const isAccessValid = !get().isTokenExpired(accessToken);
        const isRefreshValid = !get().isTokenExpired(refreshToken);
        
        if (isAccessValid || isRefreshValid) {
          set({
            accessToken,
            refreshToken,
            isAuthenticated: true,
          });
        } else {
          // Si ambos tokens están expirados, limpiar
          get().clearAuth();
        }
      },

      setAccessToken: (accessToken: string) => {
        // Verificar que el token sea válido
        const isValid = !get().isTokenExpired(accessToken);
        
        if (isValid) {
          set({
            accessToken,
            isAuthenticated: true,
          });
        } else {
          // Si el token está expirado, intentar usar refresh token
          const { refreshToken } = get();
          if (refreshToken && !get().isTokenExpired(refreshToken)) {
            // El refresh token es válido, mantener la sesión
            set({
              accessToken,
              isAuthenticated: true,
            });
          } else {
            // Ambos tokens expirados, limpiar
            get().clearAuth();
          }
        }
      },

      clearAuth: () => {
        set({
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      isTokenExpired: (token: string | null): boolean => {
        if (!token) return true;
        try {
          const decoded = jwtDecode<DecodedToken>(token);
          const currentTime = Date.now() / 1000;
          return decoded.exp < currentTime;
        } catch {
          return true;
        }
      },

      getTokenExpiration: (token: string | null): number | null => {
        if (!token) return null;
        try {
          const decoded = jwtDecode<DecodedToken>(token);
          return decoded.exp * 1000; // Convertir a milisegundos
        } catch {
          return null;
        }
      },

      validateAndRestoreSession: () => {
        const state = get();
        const { accessToken, refreshToken } = state;

        // Si no hay tokens, asegurarse de que isAuthenticated sea false
        if (!accessToken && !refreshToken) {
          if (state.isAuthenticated) {
            set({ isAuthenticated: false });
          }
          return;
        }

        // Verificar si al menos uno de los tokens es válido
        const hasValidAccess = accessToken && !state.isTokenExpired(accessToken);
        const hasValidRefresh = refreshToken && !state.isTokenExpired(refreshToken);

        if (hasValidAccess || hasValidRefresh) {
          // Al menos un token es válido, mantener la sesión
          set({ isAuthenticated: true });
        } else {
          // Ambos tokens expirados, limpiar sesión
          state.clearAuth();
        }
      },
    }),
    {
      name: AUTH_CONFIG.STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Función que se ejecuta cuando se restaura el estado desde localStorage
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Error al restaurar la sesión desde localStorage:', error);
          return;
        }
        
        // Validar y restaurar la sesión cuando se carga desde localStorage
        if (state) {
          const { accessToken, refreshToken } = state;
          
          // Función auxiliar para validar tokens directamente con jwtDecode
          const isTokenExpiredHelper = (token: string | null): boolean => {
            if (!token) return true;
            try {
              const decoded = jwtDecode<DecodedToken>(token);
              const currentTime = Date.now() / 1000;
              return decoded.exp < currentTime;
            } catch {
              return true;
            }
          };
          
          // Si hay tokens, validarlos
          if (accessToken || refreshToken) {
            const hasValidAccess = accessToken && !isTokenExpiredHelper(accessToken);
            const hasValidRefresh = refreshToken && !isTokenExpiredHelper(refreshToken);
            
            if (hasValidAccess || hasValidRefresh) {
              // Al menos un token es válido, mantener la sesión
              state.isAuthenticated = true;
            } else {
              // Ambos tokens expirados, limpiar sesión
              state.accessToken = null;
              state.refreshToken = null;
              state.isAuthenticated = false;
            }
          } else {
            // No hay tokens, asegurarse de que isAuthenticated sea false
            state.isAuthenticated = false;
          }
        }
      },
    }
  )
);

