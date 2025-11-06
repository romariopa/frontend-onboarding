import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/authStore';
import { authService } from './auth.service';
import { API_CONFIG, ROUTES } from '@/utils/constants';

export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request para agregar token y refrescar si es necesario
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const { accessToken, refreshToken, isTokenExpired, setAccessToken, clearAuth } = useAuthStore.getState();

    // Si no hay token, continuar sin Authorization
    if (!accessToken) {
      return config;
    }

    // Verificar si el token expiró
    if (isTokenExpired(accessToken)) {
      // Intentar refrescar el token
      if (refreshToken && !isTokenExpired(refreshToken)) {
        try {
          const response = await authService.refreshToken(refreshToken);
          setAccessToken(response.access_token);
          config.headers.Authorization = `Bearer ${response.access_token}`;
        } catch (error) {
          // Si el refresh falla, limpiar auth y redirigir
          clearAuth();
          if (typeof window !== 'undefined') {
            window.location.href = ROUTES.LOGIN;
          }
          return Promise.reject(error);
        }
      } else {
        // Refresh token también expiró
        clearAuth();
        if (typeof window !== 'undefined') {
          window.location.href = ROUTES.LOGIN;
        }
        return Promise.reject(new Error('Refresh token expired'));
      }
    } else {
      // Token válido, agregar al header
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de response para manejar errores 401
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Solo redirigir al login si es un 401 y NO estamos en el proceso de login
    // El endpoint de login debe manejar su propio error sin redirigir
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || '';
      const isLoginEndpoint = requestUrl.includes('/auth/login');
      
      // Si NO es el endpoint de login, limpiar auth y redirigir
      // Si es el endpoint de login, solo rechazar la promesa para que se maneje en el componente
      if (!isLoginEndpoint) {
        const { clearAuth } = useAuthStore.getState();
        clearAuth();
        if (typeof window !== 'undefined') {
          window.location.href = ROUTES.LOGIN;
        }
      }
    }
    return Promise.reject(error);
  }
);

