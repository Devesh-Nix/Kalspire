import apiClient from './client';
import type { Order } from '@/types';

export const ordersApi = {
  getAll: async (params?: {
    userId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ orders: Order[]; total: number }> => {
    const { data } = await apiClient.get('/orders', { params });
    return data;
  },

  getById: async (id: string): Promise<Order> => {
    const { data } = await apiClient.get<Order>(`/orders/${id}`);
    return data;
  },

  create: async (orderData: {
    items: { productId: string; quantity: number; selectedColor?: any }[];
    shippingAddress: any;
  }): Promise<Order> => {
    const { data } = await apiClient.post<Order>('/orders', orderData);
    return data;
  },

  updateStatus: async (id: string, status: Order['status']): Promise<Order> => {
    const { data } = await apiClient.patch<Order>(`/orders/${id}/status`, { status });
    return data;
  },

  getUserOrders: async (userId: string): Promise<Order[]> => {
    const { data } = await apiClient.get<Order[]>(`/users/${userId}/orders`);
    return data;
  },

  getMyOrders: async (): Promise<{ orders: Order[] }> => {
    const { data } = await apiClient.get('/orders/my');
    return data;
  },
};
