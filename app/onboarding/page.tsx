'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { onboardingService } from '@/services/onboarding.service';
import { useClientsStore } from '@/store/clientsStore';
import { TokenTimer } from '@/components/TokenTimer';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FormInput } from '@/components/FormInput';
import type { OnboardingResponse } from '@/types';

const onboardingSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  documento: z.string().min(5, 'El documento debe tener al menos 5 caracteres'),
  email: z.string().email('Email inválido'),
  montoInicial: z.number().positive('El monto debe ser positivo'),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const { logout } = useAuth();
  const { addClient } = useClientsStore();
  const [result, setResult] = useState<OnboardingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
  });

  const onSubmit = async (data: OnboardingFormData) => {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const response = await onboardingService.create(data);
      setResult(response);
      // Agregar el cliente a la lista
      addClient(data, response);
      reset();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al registrar el cliente');
    } finally {
      setLoading(false);
    }
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

        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">🧾 Registro de Cliente</h1>

          <div className="bg-white rounded-xl shadow-md p-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormInput
                label="Nombre Completo"
                type="text"
                placeholder="Juan Pérez"
                {...register('nombre')}
                error={errors.nombre?.message}
              />

              <FormInput
                label="Documento"
                type="text"
                placeholder="12345678"
                {...register('documento')}
                error={errors.documento?.message}
              />

              <FormInput
                label="Email"
                type="email"
                placeholder="juan.perez@example.com"
                {...register('email')}
                error={errors.email?.message}
              />

              <FormInput
                label="Monto Inicial"
                type="number"
                step="0.01"
                placeholder="1000.50"
                {...register('montoInicial', { valueAsNumber: true })}
                error={errors.montoInicial?.message}
              />

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {result && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">✅ Cliente registrado exitosamente</h3>
                  <p className="text-sm text-green-700">ID de Onboarding: {result.onboardingId}</p>
                  <p className="text-sm text-green-700">Estado: {result.status}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Registrando...' : 'Registrar Cliente'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

