'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { healthService } from '@/services/health.service';
import { TokenTimer } from '@/components/TokenTimer';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import type { HealthResponse } from '@/types';

export default function DashboardPage() {
  const { logout } = useAuth();
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await healthService.check();
        setHealth(response);
      } catch (error) {
        setHealth({ ok: false });
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      checkHealth();
    }
  }, [accessToken]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-bold text-gray-800">🛡️ Onboarding Guardian</h1>
              <div className="flex items-center gap-4">
                <TokenTimer />
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
            
            {/* Health Status */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Estado del Sistema</h3>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600">Verificando...</span>
                </div>
              ) : (
                <div
                  className={`flex items-center gap-2 ${
                    health?.ok ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  <span
                    className={`w-3 h-3 rounded-full ${
                      health?.ok ? 'bg-green-600' : 'bg-red-600'
                    }`}
                  ></span>
                  <span className="font-semibold">
                    {health?.ok ? 'API Online' : 'API Offline'}
                  </span>
                </div>
              )}
            </div>

            {/* Navigation Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/products"
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">💳</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Productos</h3>
                <p className="text-gray-600">Ver lista de productos disponibles</p>
              </Link>

              <Link
                href="/onboarding"
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">🧾</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Onboarding</h3>
                <p className="text-gray-600">Registrar nuevos clientes</p>
              </Link>

              <Link
                href="/clients"
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Clientes</h3>
                <p className="text-gray-600">Ver clientes registrados</p>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

