import { query, getConnection } from '../config/database.js';

export const createOrder = async (req, res) => {
  const connection = await getConnection();
  
  try {
    const { restaurant_id, items, type = 'delivery', payment_method = 'cash' } = req.body;
    
    await connection.beginTransaction();
    
    try {
      // Calculate total price
      let totalPrice = 0;
      for (const item of items) {
        const [menuItems] = await connection.query(
          'SELECT price, availability, name FROM menu_items WHERE id = ?',
          [item.menu_item_id]
        );
        
        if (menuItems.length === 0) {
          throw new Error(`Menu item with ID ${item.menu_item_id} not found`);
        }
        
        if (!menuItems[0].availability) {
          throw new Error(`Menu item "${menuItems[0].name}" is not available`);
        }
        
        totalPrice += menuItems[0].price * item.quantity;
      }
      
      // Create order
      const [orderResult] = await connection.query(
        `INSERT INTO orders (user_id, restaurant_id, total_price, payment_method, type, status)
         VALUES (?, ?, ?, ?, ?, 'pending')`,
        [req.user.id, restaurant_id, totalPrice, payment_method, type]
      );
      
      const orderId = orderResult.insertId;
      
      // Add order items
      for (const item of items) {
        const [menuItems] = await connection.query(
          'SELECT price FROM menu_items WHERE id = ?',
          [item.menu_item_id]
        );
        
        await connection.query(
          `INSERT INTO order_items (order_id, menu_item_id, quantity, price)
           VALUES (?, ?, ?, ?)`,
          [orderId, item.menu_item_id, item.quantity, menuItems[0].price]
        );
      }
      
      // If delivery order, create delivery requests
      if (type === 'delivery') {
        const [drivers] = await connection.query(
          'SELECT id FROM users WHERE role = "driver"'
        );
        
        for (const driver of drivers) {
          await connection.query(
            `INSERT INTO delivery_requests (order_id, driver_id, status)
             VALUES (?, ?, 'pending')`,
            [orderId, driver.id]
          );
        }
      }
      
      await connection.commit();
      
      // Get complete order details
      const [orders] = await query(
        `SELECT o.*, r.name as restaurant_name, u.name as customer_name
         FROM orders o
         JOIN restaurants r ON o.restaurant_id = r.id
         JOIN users u ON o.user_id = u.id
         WHERE o.id = ?`,
        [orderId]
      );
      
      const [orderItems] = await query(
        `SELECT oi.*, mi.name as item_name, mi.image_url
         FROM order_items oi
         JOIN menu_items mi ON oi.menu_item_id = mi.id
         WHERE oi.order_id = ?`,
        [orderId]
      );
      
      res.status(201).json({
        success: true,
        data: {
          ...orders[0],
          items: orderItems
        }
      });
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('CreateOrder Error:', error);
    res.status(400).json({ 
      success: false,
      message: error.message || 'Error creating order' 
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    let queryStr;
    let params = [];
    
    if (req.user.role === 'customer') {
      queryStr = `
        SELECT o.*, r.name as restaurant_name, r.location as restaurant_location
        FROM orders o
        JOIN restaurants r ON o.restaurant_id = r.id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
      `;
      params = [req.user.id];
    } else if (req.user.role === 'restaurant') {
      // Get restaurant ID for this user
      const [restaurants] = await query(
        'SELECT id FROM restaurants WHERE user_id = ?',
        [req.user.id]
      );
      
      if (restaurants.length === 0) {
        return res.json({ 
          success: true, 
          data: [] 
        });
      }
      
      queryStr = `
        SELECT o.*, u.name as customer_name, u.phone as customer_phone
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE o.restaurant_id = ?
        ORDER BY o.created_at DESC
      `;
      params = [restaurants[0].id];
    } else if (req.user.role === 'driver') {
      queryStr = `
        SELECT o.*, r.name as restaurant_name, r.location as restaurant_location,
               u.name as customer_name, u.address as customer_address
        FROM orders o
        JOIN restaurants r ON o.restaurant_id = r.id
        JOIN users u ON o.user_id = u.id
        WHERE o.delivery_driver_id = ?
        ORDER BY o.created_at DESC
      `;
      params = [req.user.id];
    } else if (req.user.role === 'admin') {
      queryStr = `
        SELECT o.*, r.name as restaurant_name, u.name as customer_name
        FROM orders o
        JOIN restaurants r ON o.restaurant_id = r.id
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
      `;
    }
    
    const [orders] = await query(queryStr, params);
    
    // Get order items for each order
    for (let order of orders) {
      const [items] = await query(
        `SELECT oi.*, mi.name as item_name
         FROM order_items oi
         JOIN menu_items mi ON oi.menu_item_id = mi.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('GetMyOrders Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching orders' 
    });
  }
};

export const getOrder = async (req, res) => {
  try {
    const [orders] = await query(
      `SELECT o.*, r.name as restaurant_name, r.location as restaurant_location,
              u.name as customer_name, u.phone as customer_phone, u.address as customer_address
       FROM orders o
       JOIN restaurants r ON o.restaurant_id = r.id
       JOIN users u ON o.user_id = u.id
       WHERE o.id = ?`,
      [req.params.id]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }
    
    const order = orders[0];
    
    // Authorization check
    if (req.user.role === 'customer' && order.user_id !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to view this order' 
      });
    }
    
    if (req.user.role === 'restaurant') {
      const [restaurants] = await query(
        'SELECT id FROM restaurants WHERE user_id = ?',
        [req.user.id]
      );
      if (restaurants.length === 0 || order.restaurant_id !== restaurants[0].id) {
        return res.status(403).json({ 
          success: false,
          message: 'Not authorized to view this order' 
        });
      }
    }
    
    // Get order items
    const [items] = await query(
      `SELECT oi.*, mi.name as item_name, mi.image_url
       FROM order_items oi
       JOIN menu_items mi ON oi.menu_item_id = mi.id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );
    
    // Get driver info if exists
    let driver = null;
    if (order.delivery_driver_id) {
      const [drivers] = await query(
        'SELECT name, phone FROM users WHERE id = ?',
        [order.delivery_driver_id]
      );
      driver = drivers[0] || null;
    }
    
    res.json({
      success: true,
      data: {
        ...order,
        items: items,
        driver: driver
      }
    });
  } catch (error) {
    console.error('GetOrder Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching order' 
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'accepted', 'preparing', 'ready', 'on_the_way', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid status' 
      });
    }
    
    // Get current order
    const [orders] = await query(
      `SELECT o.*, r.user_id as restaurant_owner_id
       FROM orders o
       JOIN restaurants r ON o.restaurant_id = r.id
       WHERE o.id = ?`,
      [req.params.id]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }
    
    const order = orders[0];
    
    // Authorization check
    let isAuthorized = false;
    const validRestaurantStatuses = ['accepted', 'preparing', 'ready', 'cancelled'];
    const validDriverStatuses = ['on_the_way', 'delivered'];
    
    if (req.user.role === 'admin') {
      isAuthorized = true;
    } else if (req.user.role === 'restaurant' && order.restaurant_owner_id === req.user.id) {
      if (validRestaurantStatuses.includes(status)) {
        isAuthorized = true;
      }
    } else if (req.user.role === 'driver' && order.delivery_driver_id === req.user.id) {
      if (validDriverStatuses.includes(status)) {
        isAuthorized = true;
      }
    }
    
    if (!isAuthorized) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this order status' 
      });
    }
    
    await query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    
    // If status is 'ready' and order is delivery, notify drivers
    if (status === 'ready' && order.type === 'delivery') {
      const [drivers] = await query(
        'SELECT id FROM users WHERE role = "driver"'
      );
      
      for (const driver of drivers) {
        await query(
          `INSERT INTO delivery_requests (order_id, driver_id, status)
           VALUES (?, ?, 'pending')
           ON DUPLICATE KEY UPDATE status = 'pending'`,
          [req.params.id, driver.id]
        );
      }
    }
    
    res.json({
      success: true,
      message: `Order status updated to ${status}`
    });
  } catch (error) {
    console.error('UpdateOrderStatus Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error updating order status' 
    });
  }
};