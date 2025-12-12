import { query } from '../config/database.js';

export const createReview = async (req, res) => {
  try {
    const { restaurant_id, order_id, rating, comment } = req.body;
    
    // Check if user has ordered from this restaurant
    const [orders] = await query(
      `SELECT id FROM orders 
       WHERE user_id = ? AND restaurant_id = ? AND status = 'delivered'`,
      [req.user.id, restaurant_id]
    );
    
    if (orders.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'You can only review restaurants you have ordered from and received delivery' 
      });
    }
    
    // Check if already reviewed for this order
    if (order_id) {
      const [existingOrderReviews] = await query(
        'SELECT id FROM reviews WHERE user_id = ? AND order_id = ?',
        [req.user.id, order_id]
      );
      
      if (existingOrderReviews.length > 0) {
        return res.status(400).json({ 
          success: false,
          message: 'You have already reviewed this order' 
        });
      }
    }
    
    const [result] = await query(
      `INSERT INTO reviews (user_id, restaurant_id, order_id, rating, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, restaurant_id, order_id || null, rating, comment || null]
    );
    
    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        user_id: req.user.id,
        restaurant_id,
        order_id,
        rating,
        comment
      }
    });
  } catch (error) {
    console.error('CreateReview Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error creating review' 
    });
  }
};

export const getRestaurantReviews = async (req, res) => {
  try {
    const [reviews] = await query(
      `SELECT r.*, u.name as user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.restaurant_id = ?
       ORDER BY r.created_at DESC`,
      [req.params.restaurantId]
    );
    
    // Calculate average rating
    const [stats] = await query(
      `SELECT 
        COALESCE(AVG(rating), 0) as avg_rating, 
        COUNT(*) as total_reviews,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_stars,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_stars,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_stars,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_stars,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_stars
       FROM reviews
       WHERE restaurant_id = ?`,
      [req.params.restaurantId]
    );
    
    res.json({
      success: true,
      data: reviews,
      stats: stats[0]
    });
  } catch (error) {
    console.error('GetRestaurantReviews Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching reviews' 
    });
  }
};

export const getMyReviews = async (req, res) => {
  try {
    const [reviews] = await query(
      `SELECT r.*, res.name as restaurant_name
       FROM reviews r
       JOIN restaurants res ON r.restaurant_id = res.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    
    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('GetMyReviews Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching reviews' 
    });
  }
};