import { body, validationResult } from 'express-validator';

export const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  };
};

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['customer', 'restaurant', 'driver', 'admin']).withMessage('Invalid role')
];

export const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

export const restaurantValidation = [
  body('name').trim().notEmpty().withMessage('Restaurant name is required'),
  body('location').trim().notEmpty().withMessage('Location is required')
];

export const menuItemValidation = [
  body('name').trim().notEmpty().withMessage('Menu item name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('restaurant_id').isInt().withMessage('Restaurant ID is required')
];

export const orderValidation = [
  body('restaurant_id').isInt().withMessage('Valid restaurant ID is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('type').optional().isIn(['delivery', 'pickup']).withMessage('Invalid order type'),
  body('payment_method').optional().isIn(['cash', 'card', 'online']).withMessage('Invalid payment method')
];

export const reviewValidation = [
  body('restaurant_id').isInt().withMessage('Restaurant ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
];