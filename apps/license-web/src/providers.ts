import type { DataProvider } from '@refinedev/core';
import axios from 'axios';

const API_URL = import.meta.env.VITE_LICENSE_API_URL ?? '/api';

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('licenseAccessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authProvider = {
  login: async ({ email, password }: { email: string; password: string }) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('licenseAccessToken', data.accessToken);
    return { success: true, redirectTo: '/' };
  },
  logout: async () => {
    localStorage.removeItem('licenseAccessToken');
    return { success: true, redirectTo: '/login' };
  },
  check: async () => {
    const token = localStorage.getItem('licenseAccessToken');
    return token ? { authenticated: true } : { authenticated: false, redirectTo: '/login' };
  },
  getIdentity: async () => ({ name: 'License Admin' }),
  onError: async (error: { response?: { status?: number } }) => {
    if (error.response?.status === 401) return { logout: true };
    return {};
  },
};

export const dataProvider: DataProvider = {
  getList: async ({ resource }) => {
    const { data } = await api.get(`/admin/${resource}`);
    return { data: data.data ?? data, total: data.meta?.total ?? data.length };
  },
  getOne: async ({ resource, id }) => {
    const { data } = await api.get(`/admin/${resource}/${String(id)}`);
    return { data };
  },
  create: async ({ resource, variables }) => {
    if (resource === 'licenses') {
      const { data } = await api.post('/admin/licenses/generate', variables);
      return { data };
    }
    const { data } = await api.post(`/admin/${resource}`, variables);
    return { data };
  },
  update: async ({ resource, id, variables }) => {
    const { data } = await api.patch(`/admin/${resource}/${String(id)}`, variables);
    return { data };
  },
  deleteOne: async () => ({ data: {} }) as { data: never },
  getApiUrl: () => API_URL,
};
