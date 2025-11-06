'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useStoreHydration } from './useStoreHydration';

/**
 * Hook que restaura y valida la sesión al cargar la página
 * Verifica si los tokens en localStorage son válidos y actualiza el estado
 */
export function useAuthRestore() {
  const { validateAndRestoreSession, accessToken, refreshToken } = useAuthStore();
  const isHydrated = useStoreHydration();
  const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    // Esperar a que Zustand haya terminado de hidratar el estado
    if (!isHydrated) {
      return;
    }

    // Validar y restaurar la sesión cuando se carga la página
    // Esto asegura que el estado isAuthenticated esté sincronizado con los tokens
    validateAndRestoreSession();
    
    // Marcar como restaurado después de validar
    setIsRestored(true);
  }, [isHydrated, validateAndRestoreSession, accessToken, refreshToken]);

  return isRestored;
}

