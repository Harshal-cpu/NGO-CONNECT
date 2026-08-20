import axios from 'axios';
import { LoginData, RegisterData } from '../types/auth';

const API_URL = 'https://ngo-connect-backend-ct0p.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data: LoginData) => api.post('/auth/login', data),
  register: (data: RegisterData) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const ngoAPI = {
  register: (data: any) => api.post('/ngo/register', data),
  getProfile: () => api.get('/ngo/profile'),
  updateProfile: (data: any) => api.put('/ngo/profile', data),
  getAll: (params?: any) => api.get('/browse/ngos', { params }),
  getById: (id: string) => api.get(`/browse/ngos/${id}`),
};

export default api;
