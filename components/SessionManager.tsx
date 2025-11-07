'use client';

import { useEffect } from 'react';
import { useSessionCleanup } from '@/hooks/useSessionCleanup';
import { useAuthRestore } from '@/hooks/useAuthRestore';
import { useAuthStore } from '@/store/authStore';

/**
 * Componente que gestiona la sesión del usuario
 * Se encarga de:
 * - Restaurar la sesión al cargar la página (si los tokens son válidos)
 * - Limpiar la sesión cuando el usuario cierra la pestaña (no al recargar)
 * - Asegurar que el store esté marcado como hidratado
 */
export function SessionManager() {
  const { _hasHydrated, setHasHydrated } = useAuthStore();
  const isRestored = useAuthRestore();
  useSessionCleanup();

  // Asegurar que el store esté marcado como hidratado después de un breve delay
  // Esto es un fallback por si onRehydrateStorage no se ejecuta por alguna razón
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Si después de 500ms todavía no está hidratado, forzar la hidratación
    const timer = setTimeout(() => {
      if (!_hasHydrated) {
        setHasHydrated(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [_hasHydrated, setHasHydrated]);

  // Mostrar loading mientras se restaura la sesión
  if (!isRestored) {
    return null; // No mostrar nada mientras se restaura
  }

  return null; // Este componente no renderiza nada
}

