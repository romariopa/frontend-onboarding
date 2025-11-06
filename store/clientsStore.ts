import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RegisteredClient, OnboardingRequest, OnboardingResponse } from '@/types';

interface ClientsState {
  clients: RegisteredClient[];
  addClient: (clientData: OnboardingRequest, response: OnboardingResponse) => void;
  removeClient: (id: string) => void;
  clearAllClients: () => void;
  getClientById: (id: string) => RegisteredClient | undefined;
}

export const useClientsStore = create<ClientsState>()(
  persist(
    (set, get) => ({
      clients: [],

      addClient: (clientData: OnboardingRequest, response: OnboardingResponse) => {
        const newClient: RegisteredClient = {
          id: response.onboardingId,
          nombre: clientData.nombre,
          documento: clientData.documento,
          email: clientData.email,
          montoInicial: clientData.montoInicial,
          status: response.status,
          registeredAt: new Date().toISOString(),
        };

        set((state) => ({
          clients: [newClient, ...state.clients], // Agregar al inicio de la lista
        }));
      },

      removeClient: (id: string) => {
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== id),
        }));
      },

      clearAllClients: () => {
        set({ clients: [] });
      },

      getClientById: (id: string) => {
        return get().clients.find((client) => client.id === id);
      },
    }),
    {
      name: 'clients-storage',
    }
  )
);

