import { api } from '../../../lib/axios';
import type { AuthResponse } from '../types';

export const loginUser = async (data: any): Promise<AuthResponse> => {
  // FIXED: Changed 'auth' to 'Auth' (Capital A)
  const response = await api.post<AuthResponse>('/Auth/login', data);
  return response.data;
};

export const registerUser = async (data: any): Promise<AuthResponse> => {
  // FIXED: Changed 'auth' to 'Auth' (Capital A)
  const response = await api.post<AuthResponse>('/Auth/register', data);
  return response.data;
};