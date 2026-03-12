import api from '../lib/api';
import { User, Session, Analytics } from '../types';

export const adminService = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  deleteUser: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  blockUser: async (id: string): Promise<User> => {
    const response = await api.patch(`/admin/users/${id}/block`);
    return response.data;
  },

  getSessions: async (): Promise<Session[]> => {
    const response = await api.get('/admin/sessions');
    return response.data;
  },

  approveSession: async (id: string): Promise<Session> => {
    const response = await api.patch(`/admin/sessions/${id}/approve`);
    return response.data;
  },

  rejectSession: async (id: string): Promise<Session> => {
    const response = await api.patch(`/admin/sessions/${id}/reject`);
    return response.data;
  },

  deleteSession: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/admin/sessions/${id}`);
    return response.data;
  },

  getAnalytics: async (): Promise<Analytics> => {
    const response = await api.get('/admin/analytics');
    return response.data;
  },
};
