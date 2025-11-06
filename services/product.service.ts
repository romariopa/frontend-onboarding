import { api } from './api';
import type { Product } from '@/types';
import { API_ENDPOINTS } from '@/utils/constants';

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await api.get<Product[]>(API_ENDPOINTS.PRODUCTS.BASE);
    return data;
  },

  getById: async (id: number): Promise<Product> => {
    const { data } = await api.get<Product>(API_ENDPOINTS.PRODUCTS.BY_ID(id));
    return data;
  },
};

