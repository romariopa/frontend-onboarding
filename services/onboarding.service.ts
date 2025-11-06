import { api } from './api';
import type { OnboardingRequest, OnboardingResponse } from '@/types';
import { API_ENDPOINTS } from '@/utils/constants';

export const onboardingService = {
  create: async (data: OnboardingRequest): Promise<OnboardingResponse> => {
    const { data: response } = await api.post<OnboardingResponse>(API_ENDPOINTS.ONBOARDING, data);
    return response;
  },
};

