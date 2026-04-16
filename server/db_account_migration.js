import { pool } from './config/db.js';

const migrate = async () => {
  try {
    console.log('🚀 Starting Database Migration for Dynamic Dashboard...');

    // 1. Add pan_image to users
    try {
      await pool.query('ALTER TABLE users ADD COLUMN pan_image VARCHAR(255) AFTER pan_card');
      console.log('✅ Added pan_image to users');
    } catch (e) {
      if (e.code === 'ER_DUP_COLUMN_NAME') console.log('ℹ️ pan_image already exists');
      else throw e;
    }

    // 2. Gift Cards Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS gift_cards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        card_number VARCHAR(20) NOT NULL UNIQUE,
        pin VARCHAR(10) NOT NULL,
        amount DECIMAL(10, 2) DEFAULT 0.00,
        expiry DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ gift_cards table ready');

    // 3. Saved UPI Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS saved_upi (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        upi_id VARCHAR(100) NOT NULL,
        label VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ saved_upi table ready');

    // 4. Saved Cards Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS saved_cards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        card_number VARCHAR(20) NOT NULL,
        card_name VARCHAR(100) NOT NULL,
        expiry VARCHAR(10) NOT NULL,
        card_type ENUM('Credit', 'Debit') DEFAULT 'Debit',
        card_network VARCHAR(20) DEFAULT 'Visa',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ saved_cards table ready');

    // 5. Coupons Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS coupons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(20) NOT NULL UNIQUE,
        description TEXT,
        discount_value DECIMAL(10, 2) NOT NULL,
        discount_type ENUM('Percentage', 'Flat') DEFAULT 'Percentage',
        expiry TIMESTAMP NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ coupons table ready');

    // 6. Seed some coupons if they don't exist
    const [existingCoupons] = await pool.query('SELECT COUNT(*) as count FROM coupons');
    if (existingCoupons[0].count === 0) {
      await pool.query(`
        INSERT INTO coupons (code, description, discount_value, discount_type) VALUES 
        ('WELCOME50', 'Get 50% off on your first order', 50, 'Percentage'),
        ('FLIPKART10', 'Flat ₹10 off on all products', 10, 'Flat'),
        ('FREEZE20', 'Winter sale: 20% off', 20, 'Percentage')
      `);
      console.log('🌱 Seeded 3 Welcome Coupons');
    }

    console.log('✨ Migration Completed Successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration Failed:', err);
    process.exit(1);
  }
};

migrate();
