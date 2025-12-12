import { query } from '../config/database.js';

export const getMenuItems = async (req, res) => {
  try {
    const [menuItems] = await query(
      `SELECT m.*, r.name as restaurant_name
       FROM menu_items m
       JOIN restaurants r ON m.restaurant_id = r.id
       WHERE m.restaurant_id = ? AND m.availability = TRUE
       ORDER BY m.created_at DESC`,
      [req.params.restaurantId]
    );
    
    res.json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    console.error('GetMenuItems Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching menu items' 
    });
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const { restaurant_id, name, description, price, image_url, availability = true } = req.body;
    
    // Verify restaurant exists and user owns it
    const [restaurants] = await query(
      'SELECT user_id FROM restaurants WHERE id = ?',
      [restaurant_id]
    );
    
    if (restaurants.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Restaurant not found' 
      });
    }
    
    // Check if user owns the restaurant or is admin
    if (req.user.role !== 'admin' && Number(restaurants[0].user_id )!== Number(req.user.id)) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to add menu items to this restaurant' 
      });
    }
    
    const [result] = await query(
      `INSERT INTO menu_items (restaurant_id, name, description, price, image_url, availability)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [restaurant_id, name, description || null, price, image_url || null, availability]
    );
    
    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        restaurant_id,
        name,
        description,
        price,
        image_url,
        availability
      }
    });
  } catch (error) {
    console.error('CreateMenuItem Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error creating menu item' 
    });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { name, description, price, image_url, availability } = req.body;
    
    // Get menu item with restaurant info
    const [menuItems] = await query(
      `SELECT m.*, r.user_id as restaurant_owner_id
       FROM menu_items m
       JOIN restaurants r ON m.restaurant_id = r.id
       WHERE m.id = ?`,
      [req.params.id]
    );
    
    if (menuItems.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Menu item not found' 
      });
    }
    
    if (req.user.role !== 'admin' && menuItems[0].restaurant_owner_id !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this menu item' 
      });
    }
    
    await query(
      `UPDATE menu_items 
       SET name = ?, description = ?, price = ?, image_url = ?, availability = ?
       WHERE id = ?`,
      [
        name || menuItems[0].name,
        description !== undefined ? description : menuItems[0].description,
        price || menuItems[0].price,
        image_url !== undefined ? image_url : menuItems[0].image_url,
        availability !== undefined ? availability : menuItems[0].availability,
        req.params.id
      ]
    );
    
    res.json({
      success: true,
      message: 'Menu item updated successfully'
    });
  } catch (error) {
    console.error('UpdateMenuItem Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error updating menu item' 
    });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    // Get menu item with restaurant info
    const [menuItems] = await query(
      `SELECT m.*, r.user_id as restaurant_owner_id
       FROM menu_items m
       JOIN restaurants r ON m.restaurant_id = r.id
       WHERE m.id = ?`,
      [req.params.id]
    );
    
    if (menuItems.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Menu item not found' 
      });
    }
    
    if (req.user.role !== 'admin' && menuItems[0].restaurant_owner_id !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to delete this menu item' 
      });
    }
    
    await query('DELETE FROM menu_items WHERE id = ?', [req.params.id]);
    
    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('DeleteMenuItem Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error deleting menu item' 
    });
  }
};