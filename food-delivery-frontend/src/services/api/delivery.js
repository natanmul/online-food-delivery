import axiosInstance from './axiosConfig.js';
import { API_ENDPOINTS } from '../../utils/constants.js';

export const deliveryService = {
  getDeliveryRequests: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.DELIVERY.REQUESTS);
    return response.data;
  },

  acceptDeliveryRequest: async (id) => {
    const response = await axiosInstance.put(
      API_ENDPOINTS.DELIVERY.ACCEPT_REQUEST.replace(':id', id)
    );
    return response.data;
  },

  rejectDeliveryRequest: async (id) => {
    const response = await axiosInstance.put(
      API_ENDPOINTS.DELIVERY.REJECT_REQUEST.replace(':id', id)
    );
    return response.data;
  },

  completeDelivery: async (id) => {
    const response = await axiosInstance.put(
      API_ENDPOINTS.DELIVERY.COMPLETE_DELIVERY.replace(':id', id)
    );
    return response.data;
  },

  getDeliveryHistory: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.DELIVERY.HISTORY);
    return response.data;
  }
};