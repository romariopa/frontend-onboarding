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
    const { accessToken, refreshToken, isTokenExpired, setAccessToken, clearAuth, _hasHydrated } = useAuthStore.getState();

    // NO ejecutar lógica de autenticación hasta que el store esté completamente hidratado
    // Esto previene que se limpien los tokens durante la recarga de página
    if (!_hasHydrated) {
      // Si no está hidratado, no agregar token por ahora (la petición puede fallar pero se reintentará)
      return config;
    }

    // Si no hay access token, intentar refrescar si hay refresh token disponible
    if (!accessToken) {
      if (refreshToken) {
        // Intentar refrescar el token con el backend (no confiar solo en validación local)
        try {
          const { setTokens } = useAuthStore.getState();
          const response = await authService.refreshToken(refreshToken);
          // Actualizar ambos tokens (access y refresh)
          setTokens(response.access_token, response.refresh_token);
          config.headers.Authorization = `Bearer ${response.access_token}`;
        } catch (error) {
          // Si el refresh falla (backend rechazó el token), limpiar auth y redirigir
          clearAuth();
          if (typeof window !== 'undefined') {
            window.location.href = ROUTES.LOGIN;
          }
          return Promise.reject(error);
        }
      }
      // Si no hay refresh token o ya se refrescó, continuar con la petición
      return config;
    }

    // Verificar si el access token expiró (según validación local)
    const accessExpired = isTokenExpired(accessToken);
    
    if (accessExpired) {
      // Intentar refrescar el token si hay refresh token disponible
      // NO confiar solo en la validación local del refresh token - intentar con el backend
      if (refreshToken) {
        try {
          const { setTokens } = useAuthStore.getState();
          const response = await authService.refreshToken(refreshToken);
          // Actualizar ambos tokens (access y refresh)
          setTokens(response.access_token, response.refresh_token);
          config.headers.Authorization = `Bearer ${response.access_token}`;
        } catch (error) {
          // Si el refresh falla (backend rechazó el token), limpiar auth y redirigir
          // Esto significa que el backend realmente rechazó el token, no solo una validación local
          clearAuth();
          if (typeof window !== 'undefined') {
            window.location.href = ROUTES.LOGIN;
          }
          return Promise.reject(error);
        }
      } else {
        // No hay refresh token disponible, limpiar sesión
        clearAuth();
        if (typeof window !== 'undefined') {
          window.location.href = ROUTES.LOGIN;
        }
        return Promise.reject(new Error('No refresh token available'));
      }
    } else {
      // Access token válido según validación local, agregar al header
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
    const { _hasHydrated } = useAuthStore.getState();
    
    // NO ejecutar lógica de autenticación hasta que el store esté completamente hidratado
    if (!_hasHydrated) {
      return Promise.reject(error);
    }
    
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

