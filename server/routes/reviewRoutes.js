import express from 'express';
import {
  createReview,
  getRestaurantReviews,
  getMyReviews
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate, reviewValidation } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/restaurants/:restaurantId/reviews', getRestaurantReviews);

// Protected routes
router.post('/', protect, authorize('customer'), validate(reviewValidation), createReview);
router.get('/my-reviews', protect, getMyReviews);

export default router;