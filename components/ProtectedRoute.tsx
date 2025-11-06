'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useAuthRestore } from '@/hooks/useAuthRestore';
import { useStoreHydration } from '@/hooks/useStoreHydration';
import { ROUTES } from '@/utils/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { accessToken, refreshToken, isTokenExpired } = useAuthStore();
  const router = useRouter();
  const isHydrated = useStoreHydration();
  const isRestored = useAuthRestore();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Esperar a que el store esté hidratado y restaurado
    if (!isHydrated || !isRestored) {
      return;
    }

    // Verificar autenticación después de que todo esté listo
    const hasValidToken = accessToken && !isTokenExpired(accessToken);
    const hasValidRefreshToken = refreshToken && !isTokenExpired(refreshToken);

    // Si hay un token válido (access o refresh), permitir acceso
    // El interceptor de axios se encargará de refrescar el access token si es necesario
    if (hasValidToken || hasValidRefreshToken) {
      setHasChecked(true);
    } else {
      // No hay tokens válidos, redirigir al login
      setHasChecked(true);
      router.push(ROUTES.LOGIN);
    }
  }, [isHydrated, isRestored, accessToken, refreshToken, isTokenExpired, router]);

  // Mostrar loading mientras se verifica la sesión
  if (!isHydrated || !isRestored || !hasChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Verificar si tiene tokens válidos antes de renderizar
  const hasValidToken = accessToken && !isTokenExpired(accessToken);
  const hasValidRefreshToken = refreshToken && !isTokenExpired(refreshToken);

  if (!hasValidToken && !hasValidRefreshToken) {
    return null; // Ya se está redirigiendo al login
  }

  return <>{children}</>;
}

