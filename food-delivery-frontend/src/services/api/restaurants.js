import axiosInstance from './axiosConfig.js';
import { API_ENDPOINTS } from '../../utils/constants.js';

export const restaurantService = {
  getAllRestaurants: async (params = {}) => {
    const response = await axiosInstance.get(API_ENDPOINTS.RESTAURANTS.BASE, { params });
    return response.data;
  },

  getRestaurant: async (id) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.RESTAURANTS.BASE}/${id}`);
    return response.data;
  },

  createRestaurant: async (restaurantData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.RESTAURANTS.BASE, restaurantData);
    return response.data;
  },

  updateRestaurant: async (id, restaurantData) => {
    const response = await axiosInstance.put(`${API_ENDPOINTS.RESTAURANTS.BASE}/${id}`, restaurantData);
    return response.data;
  },

  getMyRestaurant: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.RESTAURANTS.MY_RESTAURANT);
    return response.data;
  }
};