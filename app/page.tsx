'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useStoreHydration } from '@/hooks/useStoreHydration';
import { ROUTES } from '@/utils/constants';

export default function Home() {
  const router = useRouter();
  const { accessToken, refreshToken, isTokenExpired } = useAuthStore();
  const isHydrated = useStoreHydration();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Esperar a que el store esté hidratado
    if (!isHydrated) {
      return;
    }

    // Dar un pequeño delay adicional para asegurar que la validación se complete
    const timer = setTimeout(() => {
      // Verificar si hay tokens válidos
      const hasValidToken = accessToken && !isTokenExpired(accessToken);
      const hasValidRefreshToken = refreshToken && !isTokenExpired(refreshToken);

      if (hasValidToken || hasValidRefreshToken) {
        router.push(ROUTES.DASHBOARD);
      } else {
        router.push(ROUTES.LOGIN);
      }
      setHasChecked(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [isHydrated, accessToken, refreshToken, isTokenExpired, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}
