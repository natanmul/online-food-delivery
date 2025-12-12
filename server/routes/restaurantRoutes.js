import express from 'express';
import {
  getAllRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  getMyRestaurant
} from '../controllers/restaurantController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate, restaurantValidation } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurant);

// Protected routes
router.post(
  '/',
  protect,
  authorize('restaurant'),
  validate(restaurantValidation),
  createRestaurant
);

router.put(
  '/:id',
  protect,
  validate(restaurantValidation),
  updateRestaurant
);

router.get(
  '/owner/my-restaurant',
  protect,
  authorize('restaurant'),
  getMyRestaurant
);

export default router;