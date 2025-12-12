import axiosInstance from './axiosConfig.js';
import { API_ENDPOINTS } from '../../utils/constants.js';

export const orderService = {
  createOrder: async (orderData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ORDERS.BASE, orderData);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.MY_ORDERS);
    return response.data;
  },

  getOrder: async (id) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.ORDERS.BASE}/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id, statusData) => {
    const response = await axiosInstance.put(
      API_ENDPOINTS.ORDERS.UPDATE_STATUS.replace(':id', id),
      statusData
    );
    return response.data;
  }
};