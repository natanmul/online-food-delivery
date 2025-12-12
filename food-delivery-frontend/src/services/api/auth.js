import axiosInstance from './axiosConfig.js';
import { API_ENDPOINTS } from '../../utils/constants.js';

export const authService = {
  register: async (userData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    const payload = response.data || {};
    // support responses like { token, user } or { data: { token, user } }
    const token = payload.token || payload.data?.token;
    const user = payload.user || payload.data?.user || payload.data;
    if (token) {
      localStorage.setItem('token', token.startsWith('Bearer ') ? token : `Bearer ${token}`);
    }
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    return payload;
  },

  getMe: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};