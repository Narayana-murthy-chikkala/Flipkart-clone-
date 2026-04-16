import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  console.log('\n🔧 Running migration: Add payment columns to orders table...\n');

  try {
    // Check if column already exists
    const [cols] = await connection.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'orders' AND COLUMN_NAME = 'payment_method'
    `, [process.env.DB_NAME]);

    if (cols.length > 0) {
      console.log('✅ Columns already exist – migration skipped.');
    } else {
      await connection.query(`
        ALTER TABLE orders
          ADD COLUMN payment_method VARCHAR(50) DEFAULT 'Card' AFTER status,
          ADD COLUMN payment_status VARCHAR(50) NOT NULL DEFAULT 'unpaid' AFTER payment_method
      `);
      console.log('✅ Migration successful: payment_method and payment_status added to orders table.');
    }
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    await connection.end();
  }
}

migrate();
