import axiosInstance from './axiosConfig.js';
import { API_ENDPOINTS } from '../../utils/constants.js';

export const menuService = {
  getMenuItems: async (restaurantId) => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.MENU.GET.replace(':restaurantId', restaurantId)
    );
    return response.data;
  },

  createMenuItem: async (menuItemData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.MENU.BASE, menuItemData);
    return response.data;
  },

  updateMenuItem: async (id, menuItemData) => {
    const response = await axiosInstance.put(`${API_ENDPOINTS.MENU.BASE}/${id}`, menuItemData);
    return response.data;
  },

  deleteMenuItem: async (id) => {
    const response = await axiosInstance.delete(`${API_ENDPOINTS.MENU.BASE}/${id}`);
    return response.data;
  }
};