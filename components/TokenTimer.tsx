'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import { ROUTES, AUTH_CONFIG } from '@/utils/constants';
import { useRouter } from 'next/navigation';

export function TokenTimer() {
  const { accessToken, refreshToken, getTokenExpiration, setAccessToken, clearAuth, isTokenExpired, _hasHydrated } = useAuthStore();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    // NO ejecutar lógica hasta que el store esté completamente hidratado
    if (!_hasHydrated) {
      return;
    }

    // Si no hay tokens, ocultar el timer
    if (!accessToken && !refreshToken) {
      setTimeLeft(null);
      return;
    }

    // Calcular el tiempo restante del token que expire primero
    const getMinExpiration = () => {
      const accessExp = accessToken ? getTokenExpiration(accessToken) : null;
      const refreshExp = refreshToken ? getTokenExpiration(refreshToken) : null;

      if (!accessExp && !refreshExp) return null;
      if (!accessExp) return refreshExp;
      if (!refreshExp) return accessExp;
      return Math.min(accessExp, refreshExp);
    };

    const expiration = getMinExpiration();
    if (!expiration) {
      setTimeLeft(null);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiration - now) / 1000));
      setTimeLeft(remaining);

      // Si el tiempo llegó a 0, cerrar sesión inmediatamente
      if (remaining === 0) {
        clearAuth();
        if (typeof window !== 'undefined') {
          router.push(ROUTES.LOGIN);
        }
        return;
      }

      // Verificar si el access token expiró (según validación local)
      const accessExpired = accessToken ? isTokenExpired(accessToken) : true;

      // Si el access token expiró, intentar refrescar si hay refresh token disponible
      // NO confiar solo en validación local - intentar con el backend primero
      if (accessExpired && refreshToken) {
        const { setTokens } = useAuthStore.getState();
        authService
          .refreshToken(refreshToken)
          .then((response) => {
            // Actualizar ambos tokens (access y refresh)
            setTokens(response.access_token, response.refresh_token);
          })
          .catch(() => {
            // Si el refresh falla (backend rechazó el token), cerrar sesión
            // Esto significa que el backend realmente rechazó el token
            clearAuth();
            if (typeof window !== 'undefined') {
              router.push(ROUTES.LOGIN);
            }
          });
      } else if (accessExpired && !refreshToken) {
        // Access token expirado y no hay refresh token disponible
        clearAuth();
        if (typeof window !== 'undefined') {
          router.push(ROUTES.LOGIN);
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [accessToken, refreshToken, getTokenExpiration, setAccessToken, clearAuth, isTokenExpired, router, _hasHydrated]);

  if (timeLeft === null) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLow = timeLeft < AUTH_CONFIG.TOKEN_WARNING_TIME;
  const isAccessExpired = accessToken ? isTokenExpired(accessToken) : true;
  const isRefreshExpired = refreshToken ? isTokenExpired(refreshToken) : true;
  const tokenType = isAccessExpired && !isRefreshExpired ? 'Refresh' : 'Access';

  return (
    <div className={`flex items-center gap-2 text-sm ${isLow ? 'text-red-600' : 'text-gray-600'}`}>
      <span className={`w-2 h-2 rounded-full ${isLow ? 'bg-red-600 animate-pulse' : 'bg-green-500'}`}></span>
      <span>
        Tu sesión terminara en: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}

