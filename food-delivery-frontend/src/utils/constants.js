export const USER_ROLES = {
  CUSTOMER: 'customer',
  RESTAURANT: 'restaurant',
  DRIVER: 'driver',
  ADMIN: 'admin'
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  PREPARING: 'preparing',
  READY: 'ready',
  ON_THE_WAY: 'on_the_way',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const ORDER_TYPE = {
  DELIVERY: 'delivery',
  PICKUP: 'pickup'
};

export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  ONLINE: 'online'
};

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me'
  },
  RESTAURANTS: {
    BASE: '/restaurants',
    MY_RESTAURANT: '/restaurants/owner/my-restaurant'
  },
  MENU: {
    GET: '/menu/restaurants/:restaurantId/menu',
    BASE: '/menu'
  },
  ORDERS: {
    BASE: '/orders',
    MY_ORDERS: '/orders/my-orders',
    UPDATE_STATUS: '/orders/:id/status'
  },
  REVIEWS: {
    BASE: '/reviews',
    RESTAURANT_REVIEWS: '/reviews/restaurants/:restaurantId/reviews',
    MY_REVIEWS: '/reviews/my-reviews'
  },
  DELIVERY: {
    REQUESTS: '/delivery/requests',
    ACCEPT_REQUEST: '/delivery/requests/:id/accept',
    REJECT_REQUEST: '/delivery/requests/:id/reject',
    COMPLETE_DELIVERY: '/delivery/orders/:id/complete',
    HISTORY: '/delivery/history'
  },
  ADMIN: {
    USERS: '/admin/users',
    STATISTICS: '/admin/statistics',
    REPORTS: '/admin/reports',
    DELIVERY_REQUESTS: '/admin/delivery-requests'
  }
};