import { query, getConnection } from '../config/database.js';

export const getDeliveryRequests = async (req, res) => {
  try {
    const [requests] = await query(
      `SELECT dr.*, o.total_price, o.status as order_status,
              r.name as restaurant_name, r.location as restaurant_location,
              u.name as customer_name, u.address as customer_address,
              u.phone as customer_phone
       FROM delivery_requests dr
       JOIN orders o ON dr.order_id = o.id
       JOIN restaurants r ON o.restaurant_id = r.id
       JOIN users u ON o.user_id = u.id
       WHERE dr.driver_id = ? AND dr.status = 'pending'
       ORDER BY dr.assigned_at DESC`,
      [req.user.id]
    );
    
    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('GetDeliveryRequests Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching delivery requests' 
    });
  }
};

export const acceptDeliveryRequest = async (req, res) => {
  const connection = await getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Check if request exists and is pending
    const [requests] = await connection.query(
      `SELECT dr.*, o.status as order_status, o.id as order_id
       FROM delivery_requests dr
       JOIN orders o ON dr.order_id = o.id
       WHERE dr.id = ? AND dr.driver_id = ? AND dr.status = 'pending'`,
      [req.params.id, req.user.id]
    );
    
    if (requests.length === 0) {
      await connection.rollback();
      return res.status(404).json({ 
        success: false,
        message: 'Delivery request not found or already processed' 
      });
    }
    
    const request = requests[0];
    
    if (request.order_status !== 'ready') {
      await connection.rollback();
      return res.status(400).json({ 
        success: false,
        message: 'Order is not ready for delivery' 
      });
    }
    
    // Update delivery request
    await connection.query(
      `UPDATE delivery_requests 
       SET status = 'accepted'
       WHERE id = ?`,
      [req.params.id]
    );
    
    // Update order with driver and status
    await connection.query(
      `UPDATE orders 
       SET delivery_driver_id = ?, status = 'on_the_way'
       WHERE id = ?`,
      [req.user.id, request.order_id]
    );
    
    // Reject other pending requests for same order
    await connection.query(
      `UPDATE delivery_requests 
       SET status = 'rejected'
       WHERE order_id = ? AND id != ? AND status = 'pending'`,
      [request.order_id, req.params.id]
    );
    
    await connection.commit();
    
    res.json({
      success: true,
      message: 'Delivery request accepted successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('AcceptDeliveryRequest Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error accepting delivery request' 
    });
  } finally {
    connection.release();
  }
};

export const rejectDeliveryRequest = async (req, res) => {
  try {
    const [requests] = await query(
      'SELECT * FROM delivery_requests WHERE id = ? AND driver_id = ? AND status = "pending"',
      [req.params.id, req.user.id]
    );
    
    if (requests.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Delivery request not found' 
      });
    }
    
    await query(
      `UPDATE delivery_requests 
       SET status = 'rejected'
       WHERE id = ?`,
      [req.params.id]
    );
    
    res.json({
      success: true,
      message: 'Delivery request rejected'
    });
  } catch (error) {
    console.error('RejectDeliveryRequest Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error rejecting delivery request' 
    });
  }
};

export const completeDelivery = async (req, res) => {
  try {
    // Check if order exists and driver is assigned
    const [orders] = await query(
      `SELECT o.* 
       FROM orders o
       WHERE o.id = ? AND o.delivery_driver_id = ? AND o.status = 'on_the_way'`,
      [req.params.id, req.user.id]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found or not assigned to you' 
      });
    }
    
    // Update order status
    await query(
      `UPDATE orders 
       SET status = 'delivered'
       WHERE id = ?`,
      [req.params.id]
    );
    
    // Update delivery request
    await query(
      `UPDATE delivery_requests 
       SET status = 'completed', completed_at = CURRENT_TIMESTAMP
       WHERE order_id = ? AND driver_id = ?`,
      [req.params.id, req.user.id]
    );
    
    res.json({
      success: true,
      message: 'Delivery completed successfully'
    });
  } catch (error) {
    console.error('CompleteDelivery Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error completing delivery' 
    });
  }
};

export const getDeliveryHistory = async (req, res) => {
  try {
    const [deliveries] = await query(
      `SELECT dr.*, o.total_price, o.created_at as order_date,
              r.name as restaurant_name, 
              u.name as customer_name,
              u.address as customer_address
       FROM delivery_requests dr
       JOIN orders o ON dr.order_id = o.id
       JOIN restaurants r ON o.restaurant_id = r.id
       JOIN users u ON o.user_id = u.id
       WHERE dr.driver_id = ? AND dr.status IN ('accepted', 'completed')
       ORDER BY dr.assigned_at DESC`,
      [req.user.id]
    );
    
    res.json({
      success: true,
      count: deliveries.length,
      data: deliveries
    });
  } catch (error) {
    console.error('GetDeliveryHistory Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching delivery history' 
    });
  }
};