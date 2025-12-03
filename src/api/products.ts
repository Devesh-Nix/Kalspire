import apiClient from './client';
import type { Product } from '@/types';

export const productsApi = {
  getAll: async (params?: {
    categoryId?: string;
    search?: string;
    page?: number;
    limit?: number;
    priceMin?: number;
    priceMax?: number;
    sort?: 'price:asc' | 'price:desc' | string;
  }): Promise<{ products: Product[]; total: number }> => {
    const { data } = await apiClient.get('/products', { params });
    return data;
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await apiClient.get<Product>(`/products/${id}`);
    return data;
  },

  create: async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    const { data } = await apiClient.post<Product>('/products', productData);
    return data;
  },

  update: async (id: string, updates: Partial<Product>): Promise<Product> => {
    const { data } = await apiClient.put<Product>(`/products/${id}`, updates);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  updateStock: async (id: string, stock: number): Promise<Product> => {
    const { data } = await apiClient.patch<Product>(`/products/${id}/stock`, { stock });
    return data;
  },
};
