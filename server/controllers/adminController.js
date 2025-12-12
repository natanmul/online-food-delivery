import { query } from '../config/database.js';

export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    let queryStr = 'SELECT id, name, email, phone, role, created_at FROM users';
    const params = [];
    
    if (role) {
      queryStr += ' WHERE role = ?';
      params.push(role);
    }
    
    queryStr += ' ORDER BY created_at DESC';
    
    const [users] = await query(queryStr, params);
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('GetAllUsers Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching users' 
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    // Cannot delete yourself
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot delete yourself' 
      });
    }
    
    const [result] = await query('DELETE FROM users WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('DeleteUser Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error deleting user' 
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ['customer', 'restaurant', 'driver', 'admin'];
    
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid role' 
      });
    }
    
    const [result] = await query(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      message: `User role updated to ${role}`
    });
  } catch (error) {
    console.error('UpdateUserRole Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error updating user role' 
    });
  }
};

export const getStatistics = async (req, res) => {
  try {
    // Get counts
    const [userCounts] = await query(
      `SELECT role, COUNT(*) as count 
       FROM users 
       GROUP BY role`
    );
    
    const [orderStats] = await query(
      `SELECT 
         COUNT(*) as total_orders,
         SUM(total_price) as total_revenue,
         AVG(total_price) as avg_order_value,
         COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
         COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders
       FROM orders`
    );
    
    const [orderStatusCounts] = await query(
      `SELECT status, COUNT(*) as count 
       FROM orders 
       GROUP BY status`
    );
    
    const [restaurantStats] = await query(
      `SELECT 
         COUNT(*) as total_restaurants,
         (SELECT COUNT(*) FROM menu_items WHERE availability = 1) as active_menu_items
       FROM restaurants`
    );
    
    // Recent activities
    const [recentOrders] = await query(
      `SELECT o.*, u.name as customer_name, r.name as restaurant_name
       FROM orders o
       JOIN users u ON o.user_id = u.id
       JOIN restaurants r ON o.restaurant_id = r.id
       ORDER BY o.created_at DESC
       LIMIT 10`
    );
    
    // Top restaurants by orders
    const [topRestaurants] = await query(
      `SELECT r.name, COUNT(o.id) as order_count, 
              SUM(o.total_price) as revenue,
              COALESCE(AVG(rev.rating), 0) as avg_rating
       FROM restaurants r
       LEFT JOIN orders o ON r.id = o.restaurant_id
       LEFT JOIN reviews rev ON r.id = rev.restaurant_id
       GROUP BY r.id
       ORDER BY order_count DESC
       LIMIT 10`
    );
    
    res.json({
      success: true,
      data: {
        user_counts: userCounts,
        order_stats: orderStats[0] || {},
        order_status_counts: orderStatusCounts,
        restaurant_stats: restaurantStats[0] || {},
        recent_orders: recentOrders,
        top_restaurants: topRestaurants
      }
    });
  } catch (error) {
    console.error('GetStatistics Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching statistics' 
    });
  }
};

export const generateReport = async (req, res) => {
  try {
    const { report_type, start_date, end_date } = req.body;
    
    let queryStr = '';
    const params = [];
    
    switch (report_type) {
      case 'sales':
        queryStr = `
          SELECT 
            DATE(created_at) as date,
            COUNT(*) as order_count,
            SUM(total_price) as total_sales,
            AVG(total_price) as avg_order_value,
            COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_count,
            COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_count
          FROM orders
          WHERE 1=1
        `;
        
        if (start_date && end_date) {
          queryStr += ' AND DATE(created_at) BETWEEN ? AND ?';
          params.push(start_date, end_date);
        }
        
        queryStr += ' GROUP BY DATE(created_at) ORDER BY date';
        break;
        
      case 'orders':
        queryStr = `
          SELECT 
            r.name as restaurant_name,
            COUNT(o.id) as order_count,
            SUM(o.total_price) as total_revenue,
            AVG(o.total_price) as avg_order_value,
            COALESCE(AVG(rev.rating), 0) as avg_rating,
            COUNT(CASE WHEN o.status = 'delivered' THEN 1 END) as delivered_count
          FROM restaurants r
          LEFT JOIN orders o ON r.id = o.restaurant_id
          LEFT JOIN reviews rev ON r.id = rev.restaurant_id
          WHERE 1=1
        `;
        
        if (start_date && end_date) {
          queryStr += ' AND DATE(o.created_at) BETWEEN ? AND ?';
          params.push(start_date, end_date);
        }
        
        queryStr += ' GROUP BY r.id ORDER BY order_count DESC';
        break;
        
      case 'user_activity':
        queryStr = `
          SELECT 
            u.role,
            COUNT(DISTINCT u.id) as user_count,
            COUNT(o.id) as order_count,
            SUM(o.total_price) as total_spent,
            AVG(o.total_price) as avg_order_value
          FROM users u
          LEFT JOIN orders o ON u.id = o.user_id
          WHERE 1=1
        `;
        
        if (start_date && end_date) {
          queryStr += ' AND (DATE(o.created_at) BETWEEN ? AND ? OR o.id IS NULL)';
          params.push(start_date, end_date);
        }
        
        queryStr += ' GROUP BY u.role';
        break;
        
      default:
        return res.status(400).json({ 
          success: false,
          message: 'Invalid report type' 
        });
    }
    
    const [data] = await query(queryStr, params);
    
    // Save report to database
    const [result] = await query(
      `INSERT INTO reports (report_type, data)
       VALUES (?, ?)`,
      [report_type, JSON.stringify(data)]
    );
    
    res.json({
      success: true,
      data: {
        report_id: result.insertId,
        report_type,
        generated_at: new Date(),
        data: data
      }
    });
  } catch (error) {
    console.error('GenerateReport Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error generating report' 
    });
  }
};

export const getReports = async (req, res) => {
  try {
    const [reports] = await query(
      'SELECT * FROM reports ORDER BY created_at DESC'
    );
    
    // Safely parse JSON - handle both objects and arrays
    const parsedReports = reports.map(report => {
      try {
        return {
          ...report,
          data: report.data ? report.data : null
        };
      } catch (parseError) {
        console.error(`Failed to parse report ${report.id}:`, parseError);
        return {
          ...report,
          data: null,
          parse_error: true
        };
      }
    });
    
    res.json({
      success: true,
      data: parsedReports
    });
  } catch (error) {
    console.error('GetReports Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching reports' 
    });
  }
};

export const getAllDeliveryRequests = async (req, res) => {
  try {
    const [requests] = await query(
      `SELECT dr.*, 
              o.total_price, o.status as order_status,
              r.name as restaurant_name,
              u.name as customer_name,
              d.name as driver_name
       FROM delivery_requests dr
       JOIN orders o ON dr.order_id = o.id
       JOIN restaurants r ON o.restaurant_id = r.id
       JOIN users u ON o.user_id = u.id
       JOIN users d ON dr.driver_id = d.id
       ORDER BY dr.assigned_at DESC`
    );
    
    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('GetAllDeliveryRequests Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching delivery requests' 
    });
  }
};

