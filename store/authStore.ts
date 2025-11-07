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
  _hasHydrated: boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
  isTokenExpired: (token: string | null) => boolean;
  getTokenExpiration: (token: string | null) => number | null;
  validateAndRestoreSession: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
        // Estado inicial - estos valores se sobrescribirán durante la hidratación
        // si hay datos en localStorage
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        _hasHydrated: false,

      setHasHydrated: (value: boolean) => {
        set({ _hasHydrated: value });
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        // IMPORTANTE: NO validar tokens localmente aquí
        // Si estos tokens vienen del backend (después de login o refresh),
        // confiar en que el backend los validó correctamente.
        // Solo establecer los tokens sin validación local.
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      setAccessToken: (accessToken: string) => {
        // IMPORTANTE: NO validar tokens localmente aquí
        // Si este token viene del backend (después de refresh),
        // confiar en que el backend lo validó correctamente.
        // Solo establecer el token sin validación local.
        set({
          accessToken,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        // NO limpiar si el store aún no está hidratado
        // Esto previene que se borren los tokens durante la recarga
        const state = get();
        if (!state._hasHydrated) {
          return;
        }
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

        // IMPORTANTE: NO limpiar tokens aquí basándose solo en validación local
        // Mantener los tokens y permitir que el interceptor de axios intente
        // refrescar primero con el backend. Solo limpiar si el refresh falla.
        
        // Si hay tokens disponibles, marcar como autenticado
        // El interceptor de axios se encargará de validar y refrescar si es necesario
        if (accessToken || refreshToken) {
          set({ isAuthenticated: true });
        } else {
          set({ isAuthenticated: false });
        }
      },
    }),
    {
      name: AUTH_CONFIG.STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Excluir _hasHydrated de la persistencia (solo es un flag interno)
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      // Función que se ejecuta cuando se restaura el estado desde localStorage
      onRehydrateStorage: () => (state: AuthState | undefined, error: unknown) => {
        if (error) {
          console.error('Error al restaurar la sesión desde localStorage:', error);
          // Marcar como hidratado incluso si hay error para evitar bloqueos
          setTimeout(() => {
            useAuthStore.getState().setHasHydrated(true);
          }, 0);
          return;
        }
        
        // Validar y restaurar la sesión cuando se carga desde localStorage
        if (state) {
          const { accessToken, refreshToken } = state;
          
          // IMPORTANTE: NO limpiar tokens durante la hidratación
          // Mantener los tokens tal como están en localStorage
          // El interceptor de axios se encargará de validar y refrescar si es necesario
          
          // Mutar el estado directamente (esto es válido en onRehydrateStorage)
          // Solo actualizar isAuthenticated y _hasHydrated, NO tocar los tokens
          if (accessToken || refreshToken) {
            // Si hay tokens, mantenerlos y marcar como autenticado
            state.isAuthenticated = true;
          } else {
            // No hay tokens, asegurarse de que isAuthenticated sea false
            state.isAuthenticated = false;
          }
          
          // Marcar como hidratado
          state._hasHydrated = true;
        } else {
          // No hay estado, marcar como hidratado de todos modos
          setTimeout(() => {
            useAuthStore.getState().setHasHydrated(true);
          }, 0);
        }
      },
    }
  )
);

