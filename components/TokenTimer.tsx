'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import { ROUTES, AUTH_CONFIG } from '@/utils/constants';

export function TokenTimer() {
  const { accessToken, refreshToken, getTokenExpiration, setAccessToken, clearAuth, isTokenExpired } = useAuthStore();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setTimeLeft(null);
      return;
    }

    const expiration = getTokenExpiration(accessToken);
    if (!expiration) {
      setTimeLeft(null);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiration - now) / 1000));
      setTimeLeft(remaining);

      // Si el token expiró, intentar refrescar
      if (remaining === 0 && refreshToken && !isTokenExpired(refreshToken)) {
        authService
          .refreshToken(refreshToken)
          .then((response) => {
            setAccessToken(response.access_token);
          })
          .catch(() => {
            clearAuth();
            if (typeof window !== 'undefined') {
              window.location.href = ROUTES.LOGIN;
            }
          });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [accessToken, refreshToken, getTokenExpiration, setAccessToken, clearAuth, isTokenExpired]);

  if (timeLeft === null) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLow = timeLeft < AUTH_CONFIG.TOKEN_WARNING_TIME;

  return (
    <div className={`flex items-center gap-2 text-sm ${isLow ? 'text-red-600' : 'text-gray-600'}`}>
      <span className={`w-2 h-2 rounded-full ${isLow ? 'bg-red-600 animate-pulse' : 'bg-green-500'}`}></span>
      <span>
        Token expira en: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}

