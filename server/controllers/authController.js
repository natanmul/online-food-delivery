import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    // Check if user exists
    const [existingUser] = await query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const [result] = await query(
      `INSERT INTO users (name, email, phone, password, address, role) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, phone || null, hashedPassword, address || null, role]
    );

    // Create JWT token
    const token = jwt.sign(
      { id: result.insertId, email, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: result.insertId,
        name,
        email,
        role
      }
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration' 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const [users] = await query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    const user = users[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const [users] = await query(
      `SELECT id, name, email, phone, address, role, created_at 
       FROM users WHERE id = ?`,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: users[0]
    });
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};