import apiClient from './client';
import type { Address, User } from '@/types';

export const usersApi = {
  getAddresses: async (): Promise<{ addresses: Address[] }> => {
    const { data } = await apiClient.get('/users/addresses');
    return data;
  },

  addAddress: async (address: Omit<Address, 'id'>): Promise<{ address: Address; message: string }> => {
    const { data } = await apiClient.post('/users/addresses', address);
    return data;
  },

  updateAddress: async (addressId: string, address: Partial<Address>): Promise<{ address: Address; message: string }> => {
    const { data } = await apiClient.put(`/users/addresses/${addressId}`, address);
    return data;
  },

  deleteAddress: async (addressId: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete(`/users/addresses/${addressId}`);
    return data;
  },

  updateProfile: async (profile: { name?: string; phone?: string }): Promise<{ user: User; message: string }> => {
    const { data } = await apiClient.put('/users/profile', profile);
    return data;
  },
};
