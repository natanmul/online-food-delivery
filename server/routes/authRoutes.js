import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate, registerValidation, loginValidation } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);

// Protected route
router.get('/me', protect, getMe);

export default router;