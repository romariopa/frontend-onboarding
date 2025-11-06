'use client';

import { useEffect } from 'react';
import { useSessionCleanup } from '@/hooks/useSessionCleanup';
import { useAuthRestore } from '@/hooks/useAuthRestore';

/**
 * Componente que gestiona la sesión del usuario
 * Se encarga de:
 * - Restaurar la sesión al cargar la página (si los tokens son válidos)
 * - Limpiar la sesión cuando el usuario cierra la pestaña (no al recargar)
 */
export function SessionManager() {
  const isRestored = useAuthRestore();
  useSessionCleanup();

  // Mostrar loading mientras se restaura la sesión
  if (!isRestored) {
    return null; // No mostrar nada mientras se restaura
  }

  return null; // Este componente no renderiza nada
}

