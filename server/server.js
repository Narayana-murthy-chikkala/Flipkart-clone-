import app from './app.js';
import { testConnection } from './config/db.js';
import { initDB } from './config/initDB.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.SERVER_PORT || 5000;

// Test database connection, initialise tables, then start server
const startServer = async () => {
  try {
    await testConnection();
    await initDB();         // ← create all tables if they don't exist

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

