import { pool } from './config/db.js';

async function check() {
  try {
    const [columns] = await pool.query('DESCRIBE users');
    console.log('Users columns:', columns.map(c => c.Field));
    
    const [tables] = await pool.query('SHOW TABLES');
    console.log('Tables:', tables.map(t => Object.values(t)[0]));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit();
  }
}

check();
