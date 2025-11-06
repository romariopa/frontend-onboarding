'use client';

import { useEffect, useState } from 'react';

/**
 * Hook que espera a que Zustand haya terminado de hidratar el estado desde localStorage
 * Esto es necesario para evitar que se verifique la autenticación antes de que se restaure el estado
 */
export function useStoreHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // En el cliente, esperar a que el componente se monte completamente
    // y Zustand haya tenido tiempo de hidratar desde localStorage
    if (typeof window !== 'undefined') {
      // Usar requestAnimationFrame para asegurar que el DOM esté listo
      requestAnimationFrame(() => {
        // Pequeño delay adicional para asegurar que localStorage se haya leído
        setTimeout(() => {
          setIsHydrated(true);
        }, 100);
      });
    }
  }, []);

  return isHydrated;
}

