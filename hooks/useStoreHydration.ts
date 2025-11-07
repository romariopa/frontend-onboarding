'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

/**
 * Hook que espera a que Zustand haya terminado de hidratar el estado desde localStorage
 * Usa el flag _hasHydrated del store para saber cuándo está realmente listo
 */
export function useStoreHydration() {
  const _hasHydrated = useAuthStore((state) => state._hasHydrated);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Actualizar el estado local cuando el store se haya hidratado
    if (_hasHydrated) {
      setIsHydrated(true);
    }
  }, [_hasHydrated]);

  return isHydrated;
}

