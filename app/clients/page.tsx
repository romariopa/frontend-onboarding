'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useClientsStore } from '@/store/clientsStore';
import { TokenTimer } from '@/components/TokenTimer';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function ClientsPage() {
  const { logout } = useAuth();
  const { clients, removeClient, clearAllClients } = useClientsStore();
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const handleClearAll = () => {
    clearAllClients();
    setShowConfirmClear(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
                  ← Volver al Dashboard
                </Link>
              </div>
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
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">👥 Clientes Registrados</h1>
              <p className="text-gray-600">
                Total de clientes: <span className="font-semibold">{clients.length}</span>
              </p>
            </div>
            {clients.length > 0 && (
              <div className="flex gap-2">
                {showConfirmClear ? (
                  <>
                    <button
                      onClick={handleClearAll}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => setShowConfirmClear(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowConfirmClear(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Limpiar Lista
                  </button>
                )}
              </div>
            )}
          </div>

          {clients.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                No hay clientes registrados
              </h2>
              <p className="text-gray-600 mb-6">
                Los clientes que registres aparecerán aquí
              </p>
              <Link
                href="/onboarding"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Registrar Cliente
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-800">{client.nombre}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            client.status === 'REQUESTED'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {client.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Documento:</span>
                          <span className="ml-2 font-medium text-gray-800">{client.documento}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Email:</span>
                          <span className="ml-2 font-medium text-gray-800">{client.email}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Monto Inicial:</span>
                          <span className="ml-2 font-medium text-gray-800">
                            {formatCurrency(client.montoInicial)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Registrado:</span>
                          <span className="ml-2 font-medium text-gray-800">
                            {formatDate(client.registeredAt)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="text-gray-500 text-xs">ID de Onboarding:</span>
                        <span className="ml-2 text-xs font-mono text-gray-600">{client.id}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeClient(client.id)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar cliente"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

