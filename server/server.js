import app from './app.js';
import { query, testConnection } from './config/database.js';

const PORT = process.env.PORT || 4444;

// Test database connection
testConnection().then(isConnected => {
  if (isConnected) {
    // Start server
    const server = app.listen(PORT, () => {
      console.log(`
🚀 FOOD DELIVERY BACKEND STARTED
────────────────────────────────
📊 Port: ${PORT}
🌐 Base URL: http://localhost:${PORT}
📚 API Documentation:
   ✅ Health Check: http://localhost:${PORT}/health
   🔐 Auth API:     http://localhost:${PORT}/api/auth
   🏪 Restaurants:  http://localhost:${PORT}/api/restaurants
   📝 Orders:       http://localhost:${PORT}/api/orders
   🚚 Delivery:     http://localhost:4444/api/delivery
   👑 Admin:        http://localhost:4444/api/admin
────────────────────────────────
🎯 Ready to accept requests!
      `);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error(`❌ Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });
  } else {
    console.error('❌ Server cannot start without database connection');
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});