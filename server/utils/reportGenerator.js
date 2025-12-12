import { query } from '../config/database.js';

export const generateSalesReport = async (startDate, endDate) => {
  const [data] = await query(
    `SELECT 
      DATE(o.created_at) as date,
      COUNT(*) as order_count,
      SUM(o.total_price) as total_sales,
      AVG(o.total_price) as avg_order_value,
      COUNT(CASE WHEN o.status = 'delivered' THEN 1 END) as delivered_count,
      COUNT(CASE WHEN o.status = 'cancelled' THEN 1 END) as cancelled_count
    FROM orders o
    WHERE o.created_at BETWEEN ? AND ?
    GROUP BY DATE(o.created_at)
    ORDER BY date`,
    [startDate, endDate]
  );
  
  const summary = {
    period: `${startDate} to ${endDate}`,
    total_orders: data.reduce((sum, row) => sum + row.order_count, 0),
    total_sales: data.reduce((sum, row) => sum + row.total_sales, 0),
    avg_daily_sales: data.length > 0 ? 
      data.reduce((sum, row) => sum + row.total_sales, 0) / data.length : 0
  };
  
  return { data, summary };
};

export const generatePopularItemsReport = async () => {
  const [data] = await query(
    `SELECT 
      mi.name as item_name,
      r.name as restaurant_name,
      SUM(oi.quantity) as total_quantity,
      COUNT(DISTINCT oi.order_id) as order_count,
      SUM(oi.quantity * oi.price) as total_revenue
    FROM order_items oi
    JOIN menu_items mi ON oi.menu_item_id = mi.id
    JOIN restaurants r ON mi.restaurant_id = r.id
    GROUP BY mi.id
    ORDER BY total_quantity DESC
    LIMIT 20`
  );
  
  return data;
};

export const generateUserActivityReport = async (days = 30) => {
  const [data] = await query(
    `SELECT 
      u.role,
      COUNT(DISTINCT u.id) as user_count,
      COUNT(DISTINCT o.id) as order_count,
      SUM(o.total_price) as total_spent
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id AND o.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    GROUP BY u.role`,
    [days]
  );
  
  return data;
};