import { api } from './api';
import type { HealthResponse } from '@/types';
import { API_ENDPOINTS } from '@/utils/constants';

export const healthService = {
  check: async (): Promise<HealthResponse> => {
    const { data } = await api.get<HealthResponse>(API_ENDPOINTS.HEALTH);
    return data;
  },
};

