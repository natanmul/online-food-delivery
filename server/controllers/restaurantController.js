import { query } from '../config/database.js';

export const getAllRestaurants = async (req, res) => {
  try {
    const { search, minPrice, maxPrice, rating } = req.query;
    
    let queryStr = `
      SELECT r.*, 
        COALESCE(AVG(rev.rating), 0) as avg_rating,
        COUNT(DISTINCT rev.id) as review_count
      FROM restaurants r
      LEFT JOIN reviews rev ON r.id = rev.restaurant_id
    `;
    
    const conditions = [];
    const params = [];
    
    if (search) {
      conditions.push('r.name LIKE ?');
      params.push(`%${search}%`);
    }
    
    if (conditions.length > 0) {
      queryStr += ' WHERE ' + conditions.join(' AND ');
    }
    
    queryStr += ' GROUP BY r.id HAVING 1=1';
    
    if (rating) {
      queryStr += ' AND avg_rating >= ?';
      params.push(rating);
    }
    
    const [restaurants] = await query(queryStr, params);
    
    res.json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    console.error('GetAllRestaurants Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching restaurants' 
    });
  }
};

export const getRestaurant = async (req, res) => {
  try {
    const [restaurants] = await query(
      `SELECT r.*, 
        COALESCE(AVG(rev.rating), 0) as avg_rating,
        COUNT(DISTINCT rev.id) as review_count
       FROM restaurants r
       LEFT JOIN reviews rev ON r.id = rev.restaurant_id
       WHERE r.id = ?
       GROUP BY r.id`,
      [req.params.id]
    );
    
    if (restaurants.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Restaurant not found' 
      });
    }
    
    // Get menu items
    const [menuItems] = await query(
      'SELECT * FROM menu_items WHERE restaurant_id = ? AND availability = TRUE ORDER BY name',
      [req.params.id]
    );
    
    // Get reviews
    const [reviews] = await query(
      `SELECT rev.*, u.name as user_name
       FROM reviews rev
       JOIN users u ON rev.user_id = u.id
       WHERE rev.restaurant_id = ?
       ORDER BY rev.created_at DESC`,
      [req.params.id]
    );
    
    res.json({
      success: true,
      data: {
        ...restaurants[0],
        menu_items: menuItems,
        reviews: reviews
      }
    });
  } catch (error) {
    console.error('GetRestaurant Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching restaurant' 
    });
  }
};

export const createRestaurant = async (req, res) => {
  try {
    const { name, location, phone } = req.body;
    
    // Check if user already has a restaurant
    const [existingRestaurants] = await query(
      'SELECT id FROM restaurants WHERE user_id = ?',
      [req.user.id]
    );
    
    if (existingRestaurants.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'You already have a restaurant' 
      });
    }
    
    const [result] = await query(
      `INSERT INTO restaurants (user_id, name, location, phone)
       VALUES (?, ?, ?, ?)`,
      [req.user.id, name, location, phone || null]
    );
    
    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        user_id: req.user.id,
        name,
        location,
        phone
      }
    });
  } catch (error) {
    console.error('CreateRestaurant Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error creating restaurant' 
    });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const { name, location, phone } = req.body;
    
    // Check if restaurant exists and user owns it (or is admin)
    const [restaurants] = await query(
      'SELECT user_id FROM restaurants WHERE id = ?',
      [req.params.id]
    );
    
    if (restaurants.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Restaurant not found' 
      });
    }
    
    if (req.user.role !== 'admin' && restaurants[0].user_id !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this restaurant' 
      });
    }
    
    await query(
      `UPDATE restaurants 
       SET name = ?, location = ?, phone = ?
       WHERE id = ?`,
      [name, location, phone, req.params.id]
    );
    
    res.json({
      success: true,
      message: 'Restaurant updated successfully'
    });
  } catch (error) {
    console.error('UpdateRestaurant Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error updating restaurant' 
    });
  }
};

export const getMyRestaurant = async (req, res) => {
  try {
    const [restaurants] = await query(
      'SELECT * FROM restaurants WHERE user_id = ?',
      [req.user.id]
    );
    
    if (restaurants.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Restaurant not found for this user' 
      });
    }
    
    // Get menu items for the restaurant
    const [menuItems] = await query(
      'SELECT * FROM menu_items WHERE restaurant_id = ? ORDER BY created_at DESC',
      [restaurants[0].id]
    );
    
    res.json({
      success: true,
      data: {
        ...restaurants[0],
        menu_items: menuItems
      }
    });
  } catch (error) {
    console.error('GetMyRestaurant Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching restaurant' 
    });
  }
};