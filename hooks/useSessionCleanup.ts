'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';

/**
 * Hook que limpia la sesión automáticamente cuando el usuario cierra la pestaña del navegador
 * 
 * IMPORTANTE: NO limpia la sesión al recargar la página (F5), solo al cerrar la pestaña/navegador
 * 
 * Usa el evento pagehide para detectar cuando la página se está descartando definitivamente.
 * Los eventos beforeunload y unload NO se usan porque se disparan también al recargar.
 */
export function useSessionCleanup() {
  const { clearAuth, isAuthenticated, accessToken, refreshToken, isTokenExpired } = useAuthStore();
  const hasCleanedUp = useRef(false);

  useEffect(() => {
    // Solo ejecutar si hay una sesión activa
    if (!isAuthenticated || (!accessToken && !refreshToken)) {
      hasCleanedUp.current = false;
      return;
    }

    // Verificar si los tokens expiraron - si el refresh token expiró, cerrar sesión inmediatamente
    const refreshExpired = refreshToken ? isTokenExpired(refreshToken) : true;
    if (refreshExpired && refreshToken) {
      clearAuth();
      hasCleanedUp.current = true;
      return;
    }

    const cleanupSession = () => {
      if (hasCleanedUp.current) {
        return;
      }
      hasCleanedUp.current = true;
      clearAuth();
    };

    const RELOAD_FLAG_KEY = 'guardian_is_reload_navigation';
    let isReloading = false;

    const markReload = () => {
      try {
        sessionStorage.setItem(RELOAD_FLAG_KEY, 'true');
      } catch {
        // Ignorar si sessionStorage no está disponible
      }
    };

    const checkAndClearReloadFlag = () => {
      try {
        const value = sessionStorage.getItem(RELOAD_FLAG_KEY);
        isReloading = value === 'true';
        if (value) {
          sessionStorage.removeItem(RELOAD_FLAG_KEY);
        }
      } catch {
        isReloading = false;
      }
    };

    checkAndClearReloadFlag();

    // SOLO usar pagehide para detectar cuando la página se descarta permanentemente
    // event.persisted === false significa que la página NO se está guardando en cache
    // (es decir, se está cerrando definitivamente, no recargando)
    const handlePageHide = (event: PageTransitionEvent) => {
      // Si la navegación actual es un reload, no limpiar la sesión
      if (isReloading) {
        return;
      }

      // Si la página se está descartando (cerrando) y NO se está persistiendo en cache
      if (event.persisted === false) {
        cleanupSession();
      }
      // Si event.persisted === true, significa que la página se está guardando en cache
      // (por ejemplo, cuando se recarga), en cuyo caso NO limpiamos la sesión
    };

    const handleBeforeUnload = () => {
      markReload();
    };

    // Agregar el listener
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [clearAuth, isAuthenticated, accessToken, refreshToken, isTokenExpired]);
}

