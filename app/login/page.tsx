'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios, { AxiosError } from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { FormInput } from '@/components/FormInput';

const loginSchema = z.object({
  username: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { accessToken, refreshToken, isTokenExpired } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [hasCheckedInitial, setHasCheckedInitial] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    // Solo verificar la sesión una vez al montar el componente
    // No volver a verificar si ya se hizo la verificación inicial
    if (hasCheckedInitial) {
      return;
    }

    // Esperar un momento para que Zustand restaure el estado desde localStorage
    const timer = setTimeout(() => {
      // Verificar si hay tokens válidos
      const hasValidToken = accessToken && !isTokenExpired(accessToken);
      const hasValidRefreshToken = refreshToken && !isTokenExpired(refreshToken);

      if (hasValidToken || hasValidRefreshToken) {
        // Si hay tokens válidos, redirigir al dashboard
        router.push('/dashboard');
      } else {
        // No hay tokens válidos, mostrar el formulario de login
        setIsChecking(false);
        setHasCheckedInitial(true);
      }
    }, 150); // Dar tiempo para que se restaure el estado

    return () => clearTimeout(timer);
  }, [accessToken, refreshToken, isTokenExpired, router, hasCheckedInitial]);

  const onSubmit = async (data: LoginFormData) => {
    // Limpiar cualquier error previo
    setError(null);
    setLoading(true);
    
    try {
      await login(data);
      // Si el login es exitoso, el hook useAuth redirigirá al dashboard
      // No necesitamos hacer nada más aquí
    } catch (err: unknown) {
      // Capturar el error y mostrarlo al usuario
      let errorMessage = 'Error al iniciar sesión';
      
      if (axios.isAxiosError(err)) {
        // Si es un error de Axios, extraer el mensaje de la respuesta
        const axiosError = err as AxiosError<{ message?: string }>;
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.response?.status === 401) {
          errorMessage = 'Credenciales inválidas';
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      // No limpiar el formulario si hay un error, permitir que el usuario corrija
    } finally {
      setLoading(false);
    }
  };

  // Mostrar loading mientras se verifica la sesión
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          🛡️ Onboarding Guardian
        </h1>
        <p className="text-center text-gray-600 mb-8">Inicia sesión para continuar</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            label="Usuario"
            type="text"
            placeholder="guardian"
            {...register('username')}
            error={errors.username?.message}
          />

          <FormInput
            label="Contraseña"
            type="password"
            placeholder="onboarding123"
            {...register('password')}
            error={errors.password?.message}
          />

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <span className="text-red-600">⚠️</span>
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Credenciales de prueba:</p>
          <p className="font-mono mt-1">Usuario: guardian</p>
          <p className="font-mono">Contraseña: onboarding123</p>
        </div>
      </div>
    </div>
  );
}

