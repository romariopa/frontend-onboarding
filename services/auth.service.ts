import axios, { AxiosError } from 'axios';
import { api } from './api';
import type { LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse } from '@/types';
import { API_ENDPOINTS } from '@/utils/constants';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const { data } = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
      return data;
    } catch (error: unknown) {
      // Si es un error de Axios, extraer el mensaje de error de la respuesta
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        if (axiosError.response?.status === 401) {
          throw new Error(axiosError.response?.data?.message || 'Credenciales inválidas');
        }
        throw new Error(axiosError.response?.data?.message || 'Error al iniciar sesión');
      }
      throw error;
    }
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const { data } = await api.post<RefreshTokenResponse>(API_ENDPOINTS.AUTH.REFRESH, {
      refresh_token: refreshToken,
    } as RefreshTokenRequest);
    return data;
  },
};

