import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate, orderValidation } from '../middleware/validation.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Customer routes
router.post(
  '/',
  authorize('customer'),
  validate(orderValidation),
  createOrder
);

// Get orders based on user role
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrder);

// Update order status (restaurant, driver, admin)
router.put(
  '/:id/status',
  authorize('restaurant', 'driver', 'admin'),
  updateOrderStatus
);

export default router;