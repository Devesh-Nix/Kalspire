import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to transform MongoDB _id to id
const transformResponse = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(transformResponse);
  }
  
  if (data && typeof data === 'object') {
    const transformed: any = {};
    
    for (const key in data) {
      if (key === '_id') {
        transformed.id = data[key];
      } else if (key === 'categoryId' && typeof data[key] === 'object' && data[key] !== null) {
        // Transform categoryId object to category
        transformed.category = transformResponse(data[key]);
        transformed.categoryId = data[key]._id || data[key].id;
      } else if (key === 'productId' && typeof data[key] === 'object' && data[key] !== null) {
        // Transform productId object to product (for order items)
        transformed.product = transformResponse(data[key]);
        transformed.productId = data[key]._id || data[key].id;
      } else if (typeof data[key] === 'object' && data[key] !== null) {
        transformed[key] = transformResponse(data[key]);
      } else {
        transformed[key] = data[key];
      }
    }
    
    return transformed;
  }
  
  return data;
};

// Response interceptor for error handling and data transformation
apiClient.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = transformResponse(response.data);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
