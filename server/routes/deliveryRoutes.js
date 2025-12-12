import express from 'express';
import {
  getDeliveryRequests,
  acceptDeliveryRequest,
  rejectDeliveryRequest,
  completeDelivery,
  getDeliveryHistory
} from '../controllers/deliveryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected for drivers
router.use(protect);
router.use(authorize('driver'));

router.get('/requests', getDeliveryRequests);
router.put('/requests/:id/accept', acceptDeliveryRequest);
router.put('/requests/:id/reject', rejectDeliveryRequest);
router.put('/orders/:id/complete', completeDelivery);
router.get('/history', getDeliveryHistory);

export default router;