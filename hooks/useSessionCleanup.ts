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

    const cleanupSession = () => {
      // Evitar limpiar múltiples veces
      if (hasCleanedUp.current) {
        return;
      }
      hasCleanedUp.current = true;
      clearAuth();
    };

    // SOLO usar pagehide para detectar cuando la página se descarta permanentemente
    // event.persisted === false significa que la página NO se está guardando en cache
    // (es decir, se está cerrando definitivamente, no recargando)
    const handlePageHide = (event: PageTransitionEvent) => {
      // Si la página se está descartando (cerrando) y NO se está persistiendo en cache
      if (event.persisted === false) {
        cleanupSession();
      }
      // Si event.persisted === true, significa que la página se está guardando en cache
      // (por ejemplo, cuando se recarga), en cuyo caso NO limpiamos la sesión
    };

    // Agregar el listener
    window.addEventListener('pagehide', handlePageHide);

    // Cleanup
    return () => {
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [clearAuth, isAuthenticated, accessToken, refreshToken, isTokenExpired]);
}

