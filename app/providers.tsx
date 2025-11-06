'use client';

import { useEffect, useState } from 'react';
import { MSW_CONFIG, APP_CONFIG } from '@/utils/constants';

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && MSW_CONFIG.ENABLED) {
      import('@/mocks/browser')
        .then(({ worker }) => {
          worker.start({
            onUnhandledRequest: MSW_CONFIG.ON_UNHANDLED_REQUEST,
          });
          setMswReady(true);
        })
        .catch((err) => {
          if (APP_CONFIG.IS_DEVELOPMENT) {
            console.error('Error starting MSW:', err);
          }
          setMswReady(true); // Continuar aunque MSW falle
        });
    } else {
      setMswReady(true);
    }
  }, []);

  if (!mswReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Inicializando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

