import express from 'express';
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
  getStatistics,
  generateReport,
  getReports
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { getAllDeliveryRequests } from '../controllers/adminController.js';
const router = express.Router();

// All routes are protected for admins only
router.use(protect);
router.use(authorize('admin'));

// User management
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);
router.get('/delivery-requests', getAllDeliveryRequests);
// Reports and statistics
router.get('/statistics', getStatistics);
router.post('/reports', generateReport);
router.get('/reports', getReports);

export default router;