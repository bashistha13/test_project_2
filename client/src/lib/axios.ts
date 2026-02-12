import axios from 'axios';

export const api = axios.create({
  // Pointing to your .NET Server
  baseURL: 'http://localhost:5175/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the login token if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});