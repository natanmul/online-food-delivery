import express from 'express';
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/menuController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate, menuItemValidation } from '../middleware/validation.js';

const router = express.Router();

// Public route
router.get('/restaurants/:restaurantId/menu', getMenuItems);

// Protected routes
router.post(
  '/',
  protect,
  authorize('restaurant', 'admin'),
  validate(menuItemValidation),
  createMenuItem
);

router.put(
  '/:id',
  protect,
  authorize('restaurant', 'admin'),
  validate(menuItemValidation),
  updateMenuItem
);

router.delete(
  '/:id',
  protect,
  authorize('restaurant', 'admin'),
  deleteMenuItem
);

export default router;