import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const [users] = await query(
        'SELECT id, name, email, phone, address, role, created_at FROM users WHERE id = ?',
        [decoded.id]
      );
      
      if (users.length === 0) {
        return res.status(401).json({ 
          success: false,
          message: 'User not found' 
        });
      }
      
      req.user = users[0];
      next();
    } catch (error) {
      console.error('Auth Error:', error.message);
      res.status(401).json({ 
        success: false,
        message: 'Not authorized, token failed' 
      });
    }
  } else {
    res.status(401).json({ 
      success: false,
      message: 'Not authorized, no token' 
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};