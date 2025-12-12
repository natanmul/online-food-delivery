-- ============================================
-- FOOD DELIVERY SYSTEM - TEST DATA
-- Run this file in MySQL to populate database
-- ============================================

USE onlinefooddelivery;

-- Clear existing data (Optional - Comment out if you want to keep existing data)
/*
DELETE FROM reports;
DELETE FROM delivery_requests;
DELETE FROM reviews;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM menu_items;
DELETE FROM restaurants;
DELETE FROM users;
*/

-- ============================================
-- 1. USERS (All passwords are: password123)
-- ============================================

INSERT INTO users (id, name, email, password, phone, address, role, created_at) VALUES
-- Admin
(1, 'Admin User', 'admin@food.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye9nN7.6W7lHjL7jZcQ8Jd1Y4gYQJ7W1a', '1234567890', '123 Admin Street, City', 'admin', '2024-01-01 10:00:00'),

-- Restaurant Owners
(2, 'John Pizza', 'john@pizza.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye9nN7.6W7lHjL7jZcQ8Jd1Y4gYQJ7W1a', '5550101', '456 Pizza Street', 'restaurant', '2024-01-02 09:00:00'),
(3, 'Maria Burgers', 'maria@burger.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye9nN7.6W7lHjL7jZcQ8Jd1Y4gYQJ7W1a', '5550102', '789 Burger Avenue', 'restaurant', '2024-01-02 10:00:00'),
(4, 'Chen Noodles', 'chen@noodle.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye9nN7.6W7lHjL7jZcQ8Jd1Y4gYQJ7W1a', '5550103', '321 Noodle Road', 'restaurant', '2024-01-03 11:00:00'),
(5, 'Lisa Tacos', 'lisa@taco.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye9nN7.6W7lHjL7jZcQ8Jd1Y4gYQJ7W1a', '5550104', '654 Taco Lane', 'restaurant', '2024-01-04 12:00:00'),
(6, 'Raj Curry', 'raj@curry.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye9nN7.6W7lHjL7jZcQ8Jd1Y4gYQJ7W1a', '5550105', '987 Curry Path', 'restaurant', '2024-01-05 13:00:00'),

-- Drivers
(7, 'Mike Driver', 'mike@driver.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye9nN7.6W7lHjL7jZcQ8Jd1Y4gYQJ7W1a', '5550201', '111 Driver Lane', 'driver', '2024-01-06 08:00:00'),
(8, 'Sarah Rider', 'sarah@driver.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye9nN7.6W7lHjL7jZcQ8Jd1Y4gYQJ7W1a', '5550202', '222 Rider Street', 'driver', '2024-01-06 09:00:00'),
(9, 'Alex Courier', 'alex@driver.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye9nN7.6W7lHjL7jZcQ8Jd1Y4gYQJ7W1a', '5550203', '333 Courier Ave', 'driver', '2024-01-07 10:00:00'),

-- Customers
(10, 'David Smith', 'david@customer.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye9nN7.6W7lHjL7jZcQ8Jd1Y4gYQJ7W1a', '5550301', '444 Customer Road', 'customer', '2024-01-08 14:00:00'),
(11, 'Emma Johnson', 'emma@customer.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye9nN7.6W7lHjL7jZcQ8Jd1Y4gYQJ7W1a', '5550302', '555 Johnson Street', 'customer', '2024-01-09 15:00:00'),
(12, 'Robert Brown', 'robert@customer.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye9nN7.6W7lHjL7jZcQ8Jd1Y4gYQJ7W1a', '5550303', '666 Brown Avenue', 'customer', '2024-01-10 16:00:00'),
(13, 'Sophia Wilson', 'sophia@customer.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye9nN7.6W7lHjL7jZcQ8Jd1Y4gYQJ7W1a', '5550304', '777 Wilson Lane', 'customer', '2024-01-11 17:00:00'),
(14, 'James Taylor', 'james@customer.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye9nN7.6W7lHjL7jZcQ8Jd1Y4gYQJ7W1a', '5550305', '888 Taylor Road', 'customer', '2024-01-12 18:00:00'),
(15, 'Olivia Martinez', 'olivia@customer.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye9nN7.6W7lHjL7jZcQ8Jd1Y4gYQJ7W1a', '5550306', '999 Martinez Street', 'customer', '2024-01-13 19:00:00');

-- ============================================
-- 2. RESTAURANTS
-- ============================================

INSERT INTO restaurants (id, user_id, name, location, phone, created_at) VALUES
(1, 2, 'Pizza Palace', '123 Pizza Street, New York', '212-555-1001', '2024-01-02 10:00:00'),
(2, 3, 'Burger Joint', '456 Burger Ave, Brooklyn', '212-555-1002', '2024-01-02 11:00:00'),
(3, 4, 'Noodle House', '789 Chinatown, Queens', '212-555-1003', '2024-01-03 12:00:00'),
(4, 5, 'Taco Fiesta', '321 Mexican Street, Manhattan', '212-555-1004', '2024-01-04 13:00:00'),
(5, 6, 'Curry Corner', '654 Indian Road, Bronx', '212-555-1005', '2024-01-05 14:00:00'),
(6, 2, 'Pizza Express', '987 Fast Food Lane', '212-555-1006', '2024-01-06 15:00:00');

-- ============================================
-- 3. MENU ITEMS
-- ============================================

-- Pizza Palace (ID: 1)
INSERT INTO menu_items (id, restaurant_id, name, description, price, image_url, availability, created_at) VALUES
(1, 1, 'Margherita Pizza', 'Classic tomato, mozzarella, basil', 12.99, '/images/pizza1.jpg', 1, '2024-01-02 11:00:00'),
(2, 1, 'Pepperoni Pizza', 'Tomato sauce, mozzarella, pepperoni', 14.99, '/images/pizza2.jpg', 1, '2024-01-02 11:10:00'),
(3, 1, 'BBQ Chicken Pizza', 'BBQ sauce, chicken, onions', 16.99, '/images/pizza3.jpg', 1, '2024-01-02 11:20:00'),
(4, 1, 'Veggie Supreme', 'Mushrooms, peppers, onions, olives', 15.99, '/images/pizza4.jpg', 1, '2024-01-02 11:30:00'),
(5, 1, 'Garlic Breadsticks', 'Fresh baked with garlic butter', 6.99, '/images/breadsticks.jpg', 1, '2024-01-02 11:40:00'),
(6, 1, 'Caesar Salad', 'Romaine, croutons, parmesan', 8.99, '/images/salad.jpg', 1, '2024-01-02 11:50:00'),
(7, 1, 'Coke 500ml', 'Cold beverage', 2.50, '/images/coke.jpg', 1, '2024-01-02 12:00:00');

-- Burger Joint (ID: 2)
INSERT INTO menu_items (id, restaurant_id, name, description, price, image_url, availability, created_at) VALUES
(8, 2, 'Classic Cheeseburger', 'Beef patty, cheese, lettuce, tomato', 10.99, '/images/burger1.jpg', 1, '2024-01-02 12:00:00'),
(9, 2, 'Bacon Deluxe', 'Double beef, bacon, cheese, onion rings', 14.99, '/images/burger2.jpg', 1, '2024-01-02 12:10:00'),
(10, 2, 'Veggie Burger', 'Plant-based patty, avocado, sprouts', 11.99, '/images/burger3.jpg', 1, '2024-01-02 12:20:00'),
(11, 2, 'Crispy Chicken Burger', 'Fried chicken breast, coleslaw, pickles', 12.99, '/images/burger4.jpg', 1, '2024-01-02 12:30:00'),
(12, 2, 'French Fries', 'Golden crispy fries', 4.99, '/images/fries.jpg', 1, '2024-01-02 12:40:00'),
(13, 2, 'Onion Rings', 'Beer battered onion rings', 5.99, '/images/onionrings.jpg', 1, '2024-01-02 12:50:00'),
(14, 2, 'Chocolate Milkshake', 'Thick and creamy', 6.99, '/images/milkshake.jpg', 1, '2024-01-02 13:00:00');

-- Noodle House (ID: 3)
INSERT INTO menu_items (id, restaurant_id, name, description, price, image_url, availability, created_at) VALUES
(15, 3, 'Chicken Chow Mein', 'Stir-fried noodles with chicken', 11.99, '/images/noodle1.jpg', 1, '2024-01-03 13:00:00'),
(16, 3, 'Beef Lo Mein', 'Soft noodles with beef', 12.99, '/images/noodle2.jpg', 1, '2024-01-03 13:10:00'),
(17, 3, 'Vegetable Fried Rice', 'Fried rice with vegetables', 9.99, '/images/rice.jpg', 1, '2024-01-03 13:20:00'),
(18, 3, 'Spring Rolls (4 pcs)', 'Crispy vegetable spring rolls', 5.99, '/images/springrolls.jpg', 1, '2024-01-03 13:30:00'),
(19, 3, 'Sweet & Sour Chicken', 'Crispy chicken in tangy sauce', 10.99, '/images/chicken.jpg', 1, '2024-01-03 13:40:00'),
(20, 3, 'Hot & Sour Soup', 'Traditional Chinese soup', 4.99, '/images/soup.jpg', 1, '2024-01-03 13:50:00');

-- Taco Fiesta (ID: 4)
INSERT INTO menu_items (id, restaurant_id, name, description, price, image_url, availability, created_at) VALUES
(21, 4, 'Beef Tacos (3 pcs)', 'Soft tortillas with beef, lettuce, cheese', 8.99, '/images/taco1.jpg', 1, '2024-01-04 14:00:00'),
(22, 4, 'Chicken Tacos (3 pcs)', 'Grilled chicken, salsa, avocado', 9.99, '/images/taco2.jpg', 1, '2024-01-04 14:10:00'),
(23, 4, 'Veggie Tacos (3 pcs)', 'Black beans, corn, peppers, guacamole', 8.49, '/images/taco3.jpg', 1, '2024-01-04 14:20:00'),
(24, 4, 'Nachos Supreme', 'Tortilla chips with cheese, beans', 10.99, '/images/nachos.jpg', 1, '2024-01-04 14:30:00'),
(25, 4, 'Guacamole & Chips', 'Avocado dip with chips', 6.99, '/images/guacamole.jpg', 1, '2024-01-04 14:40:00'),
(26, 4, 'Churros (4 pcs)', 'Fried dough with cinnamon', 5.99, '/images/churros.jpg', 1, '2024-01-04 14:50:00');

-- Curry Corner (ID: 5)
INSERT INTO menu_items (id, restaurant_id, name, description, price, image_url, availability, created_at) VALUES
(27, 5, 'Butter Chicken', 'Chicken in creamy tomato sauce', 14.99, '/images/curry1.jpg', 1, '2024-01-05 15:00:00'),
(28, 5, 'Chicken Tikka Masala', 'Grilled chicken in spiced sauce', 15.99, '/images/curry2.jpg', 1, '2024-01-05 15:10:00'),
(29, 5, 'Vegetable Korma', 'Mixed vegetables in creamy sauce', 12.99, '/images/curry3.jpg', 1, '2024-01-05 15:20:00'),
(30, 5, 'Garlic Naan', 'Soft bread with garlic', 3.99, '/images/naan.jpg', 1, '2024-01-05 15:30:00'),
(31, 5, 'Basmati Rice', 'Fragrant long-grain rice', 4.99, '/images/rice2.jpg', 1, '2024-01-05 15:40:00'),
(32, 5, 'Mango Lassi', 'Yogurt mango drink', 4.49, '/images/lassi.jpg', 1, '2024-01-05 15:50:00');

-- ============================================
-- 4. ORDERS
-- ============================================

INSERT INTO orders (id, user_id, restaurant_id, delivery_driver_id, total_price, payment_method, status, type, created_at) VALUES
(1, 10, 1, 7, 32.97, 'card', 'delivered', 'delivery', '2024-01-15 18:30:00'),
(2, 11, 2, 8, 25.98, 'online', 'on_the_way', 'delivery', '2024-01-15 19:15:00'),
(3, 12, 3, NULL, 28.97, 'cash', 'ready', 'delivery', '2024-01-15 19:45:00'),
(4, 13, 4, NULL, 24.97, 'card', 'preparing', 'delivery', '2024-01-16 12:30:00'),
(5, 14, 5, NULL, 38.96, 'online', 'accepted', 'delivery', '2024-01-16 13:15:00'),
(6, 15, 1, NULL, 18.98, 'cash', 'pending', 'pickup', '2024-01-16 14:00:00'),
(7, 10, 2, NULL, 16.98, 'card', 'cancelled', 'delivery', '2024-01-14 20:30:00');

-- ============================================
-- 5. ORDER ITEMS
-- ============================================

INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES
-- Order 1
(1, 1, 2, 12.99),
(1, 5, 1, 6.99),

-- Order 2
(2, 8, 2, 10.99),
(2, 12, 1, 4.99),

-- Order 3
(3, 15, 1, 11.99),
(3, 18, 2, 5.99),
(3, 20, 1, 4.99),

-- Order 4
(4, 22, 1, 9.99),
(4, 24, 1, 10.99),
(4, 25, 1, 3.99),

-- Order 5
(5, 27, 1, 14.99),
(5, 30, 2, 3.99),
(5, 31, 1, 4.99),
(5, 32, 1, 4.49),

-- Order 6
(6, 2, 1, 14.99),
(6, 7, 1, 3.99),

-- Order 7
(7, 9, 1, 14.99),
(7, 12, 1, 1.99);

-- ============================================
-- 6. REVIEWS
-- ============================================

INSERT INTO reviews (user_id, restaurant_id, order_id, rating, comment, created_at) VALUES
(10, 1, 1, 5, 'Amazing pizza! Fast delivery.', '2024-01-15 20:00:00'),
(11, 1, NULL, 4, 'Good pizza but pricey.', '2024-01-14 19:30:00'),
(12, 1, NULL, 5, 'Best pizza in town!', '2024-01-13 18:45:00'),
(13, 2, NULL, 3, 'Burgers okay, fries cold.', '2024-01-14 21:00:00'),
(14, 2, NULL, 4, 'Delicious burgers! Good value.', '2024-01-13 20:15:00'),
(15, 3, NULL, 5, 'Authentic Chinese food!', '2024-01-12 19:00:00'),
(10, 3, NULL, 4, 'Good portions, slow delivery.', '2024-01-11 18:30:00'),
(11, 4, NULL, 5, 'Fresh ingredients, amazing!', '2024-01-10 20:45:00'),
(12, 4, NULL, 4, 'Great tacos, needs more spice.', '2024-01-09 19:15:00'),
(13, 5, NULL, 5, 'Authentic Indian food!', '2024-01-08 21:30:00'),
(14, 5, NULL, 5, 'Best curry in the city!', '2024-01-07 20:00:00');

-- ============================================
-- 7. DELIVERY REQUESTS
-- ============================================

INSERT INTO delivery_requests (order_id, driver_id, status, assigned_at, completed_at) VALUES
-- Order 1 - Completed
(1, 7, 'completed', '2024-01-15 18:35:00', '2024-01-15 19:00:00'),

-- Order 2 - Accepted
(2, 8, 'accepted', '2024-01-15 19:20:00', NULL),

-- Order 3 - Pending (ready for delivery)
(3, 7, 'pending', '2024-01-15 19:50:00', NULL),
(3, 8, 'pending', '2024-01-15 19:50:00', NULL),
(3, 9, 'pending', '2024-01-15 19:50:00', NULL),

-- Order 4 - Pending (preparing)
(4, 7, 'pending', '2024-01-16 12:35:00', NULL),
(4, 8, 'pending', '2024-01-16 12:35:00', NULL);

-- ============================================
-- 8. REPORTS
-- ============================================

INSERT INTO reports (report_type, data, created_at) VALUES
('sales', '{"period": "January 2024", "total_sales": 168.82, "order_count": 7}', '2024-01-31 23:59:59'),
('orders', '[{"restaurant_name": "Pizza Palace", "order_count": 2, "total_revenue": 51.95}, {"restaurant_name": "Burger Joint", "order_count": 2, "total_revenue": 42.96}, {"restaurant_name": "Noodle House", "order_count": 1, "total_revenue": 28.97}, {"restaurant_name": "Taco Fiesta", "order_count": 1, "total_revenue": 24.97}, {"restaurant_name": "Curry Corner", "order_count": 1, "total_revenue": 38.96}]', '2024-01-31 23:59:59'),
('user_activity', '{"customer_count": 6, "average_orders_per_customer": 1.17, "top_customer": "David Smith", "total_orders": 7}', '2024-01-31 23:59:59');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

SELECT '✅ DATA INSERTION COMPLETE' as message;

SELECT '📊 DATABASE STATISTICS:' as heading;

SELECT '👥 Users' as category, COUNT(*) as count FROM users
UNION ALL
SELECT '🏪 Restaurants', COUNT(*) FROM restaurants
UNION ALL
SELECT '🍕 Menu Items', COUNT(*) FROM menu_items
UNION ALL
SELECT '📦 Orders', COUNT(*) FROM orders
UNION ALL
SELECT '📝 Order Items', COUNT(*) FROM order_items
UNION ALL
SELECT '⭐ Reviews', COUNT(*) FROM reviews
UNION ALL
SELECT '🚚 Delivery Requests', COUNT(*) FROM delivery_requests
UNION ALL
SELECT '📈 Reports', COUNT(*) FROM reports;

SELECT '' as line;

SELECT '🔐 TEST LOGINS:' as heading;
SELECT 'Email' as field, 'Password' as value, 'Role' as role
UNION ALL
SELECT 'admin@food.com', 'password123', 'Admin'
UNION ALL
SELECT 'john@pizza.com', 'password123', 'Restaurant Owner'
UNION ALL
SELECT 'mike@driver.com', 'password123', 'Driver'
UNION ALL
SELECT 'david@customer.com', 'password123', 'Customer';

SELECT '' as line;

SELECT '📦 ORDER STATUSES:' as heading;
SELECT 
    o.id as order_id,
    u.name as customer,
    r.name as restaurant,
    o.status,
    o.total_price,
    DATE(o.created_at) as order_date
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN restaurants r ON o.restaurant_id = r.id
ORDER BY o.created_at DESC;

SELECT '' as line;

SELECT '🚚 AVAILABLE DELIVERY REQUESTS:' as heading;
SELECT 
    dr.id as request_id,
    o.id as order_id,
    r.name as restaurant,
    o.total_price,
    d.name as driver,
    dr.status
FROM delivery_requests dr
JOIN orders o ON dr.order_id = o.id
JOIN restaurants r ON o.restaurant_id = r.id
JOIN users d ON dr.driver_id = d.id
WHERE dr.status IN ('pending', 'accepted')
ORDER BY dr.assigned_at DESC;

SELECT '' as line;

SELECT '🏆 TOP RESTAURANTS BY RATING:' as heading;
SELECT 
    r.name,
    ROUND(AVG(rev.rating), 1) as avg_rating,
    COUNT(rev.id) as review_count
FROM restaurants r
LEFT JOIN reviews rev ON r.id = rev.restaurant_id
GROUP BY r.id
ORDER BY avg_rating DESC;

SELECT '' as line;
SELECT '🎯 READY TO TEST YOUR APPLICATION!' as final_message;
