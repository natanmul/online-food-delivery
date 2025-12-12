import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'onlinefooddelivery',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Convert to promise-based pool
const promisePool = pool.promise();

// Test database connection function
export const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('✅ MySQL Database connected successfully!');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Error connecting to MySQL:', error.message);
    return false;
  }
};

// Export query function and connection helpers
export const query = (sql, params) => promisePool.execute(sql, params);
export const getConnection = () => promisePool.getConnection();