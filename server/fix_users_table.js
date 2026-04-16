import { pool } from './config/db.js';

async function fix() {
  try {
    console.log('Adding phone and gender columns to users table...');
    await pool.query('ALTER TABLE users ADD COLUMN phone VARCHAR(20) AFTER role');
    await pool.query('ALTER TABLE users ADD COLUMN gender VARCHAR(10) AFTER phone');
    console.log('✅ Columns added successfully');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit();
  }
}

fix();
