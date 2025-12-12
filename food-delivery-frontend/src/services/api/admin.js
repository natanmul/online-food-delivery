import axiosInstance from './axiosConfig.js';
import { API_ENDPOINTS } from '../../utils/constants.js';

export const adminService = {
  getAllUsers: async (params = {}) => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.USERS, { params });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await axiosInstance.delete(`${API_ENDPOINTS.ADMIN.USERS}/${id}`);
    return response.data;
  },

  updateUserRole: async (id, roleData) => {
    const response = await axiosInstance.put(
      `${API_ENDPOINTS.ADMIN.USERS}/${id}/role`,
      roleData
    );
    return response.data;
  },

  getStatistics: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.STATISTICS);
    return response.data;
  },

  generateReport: async (reportData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ADMIN.REPORTS, reportData);
    return response.data;
  },

  getReports: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.REPORTS);
    return response.data;
  },

  getAllDeliveryRequests: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.DELIVERY_REQUESTS);
    return response.data;
  }
};