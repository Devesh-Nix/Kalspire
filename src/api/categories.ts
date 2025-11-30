import apiClient from './client';
import type { Category } from '@/types';

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<Category[]>('/categories');
    return data;
  },

  getById: async (id: string): Promise<Category> => {
    const { data } = await apiClient.get<Category>(`/categories/${id}`);
    return data;
  },

  create: async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> => {
    const { data } = await apiClient.post<Category>('/categories', categoryData);
    return data;
  },

  update: async (id: string, updates: Partial<Category>): Promise<Category> => {
    const { data } = await apiClient.put<Category>(`/categories/${id}`, updates);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },

  toggleActive: async (id: string, isActive: boolean): Promise<Category> => {
    const { data } = await apiClient.patch<Category>(`/categories/${id}/toggle`, { isActive });
    return data;
  },
};
