import { pool } from '../config/db.js';

const fixSchema = async () => {
  try {
    console.log('⏳ Starting schema repair...');

    // 1. Check if user_id exists in orders
    const [orderColumns] = await pool.query('DESCRIBE orders');
    const hasUserIdInOrders = orderColumns.some(col => col.Field === 'user_id');

    if (!hasUserIdInOrders) {
      console.log('➕ Adding user_id to orders table...');
      await pool.query('ALTER TABLE orders ADD COLUMN user_id VARCHAR(36) DEFAULT NULL AFTER id');
      await pool.query('ALTER TABLE orders ADD CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL');
      console.log('✅ user_id added to orders.');
    } else {
      console.log('✔ user_id already exists in orders.');
    }

    // 2. Check if user_id exists in carts
    const [cartColumns] = await pool.query('DESCRIBE carts');
    const hasUserIdInCarts = cartColumns.some(col => col.Field === 'user_id');

    if (!hasUserIdInCarts) {
      console.log('➕ Adding user_id to carts table...');
      await pool.query('ALTER TABLE carts ADD COLUMN user_id VARCHAR(36) DEFAULT NULL AFTER id');
      await pool.query('ALTER TABLE carts ADD CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL');
      console.log('✅ user_id added to carts.');
    } else {
      console.log('✔ user_id already exists in carts.');
    }

    console.log('🎉 Schema repair complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Schema repair failed:', error.message);
    process.exit(1);
  }
};

fixSchema();
