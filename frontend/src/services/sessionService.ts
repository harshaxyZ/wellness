import api from '../lib/api';
import { Session } from '../types';

export const sessionService = {
  create: async (): Promise<Session> => {
    const response = await api.post('/sessions');
    return response.data;
  },

  getAll: async (): Promise<Session[]> => {
    const response = await api.get('/sessions');
    return response.data;
  },

  getById: async (id: string): Promise<Session> => {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<Session>): Promise<Session> => {
    const response = await api.put(`/sessions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/sessions/${id}`);
    return response.data;
  },

  autosave: async (id: string, data: Partial<Session>): Promise<Session> => {
    const response = await api.patch(`/sessions/${id}/autosave`, data);
    return response.data;
  },
};
