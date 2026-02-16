import { api } from '../../../lib/axios';
import type { Product, Category } from '../types';

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>('/products');
  return response.data;
};

// --- NEW FUNCTION ---
export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>('/Categories'); // Matches your Swagger
  return response.data;
};

export const createProduct = async (data: any) => {
  const response = await api.post<Product>('/products', data);
  return response.data;
};

export const updateProduct = async (id: number, data: any) => {
  const response = await api.put<Product>(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: number) => {
  await api.delete(`/products/${id}`);
};