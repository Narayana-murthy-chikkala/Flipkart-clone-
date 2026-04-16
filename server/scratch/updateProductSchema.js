import { pool } from '../config/db.js';

async function updateSchema() {
  try {
    console.log('Adding new columns to products table...');
    
    // Add new columns
    const columns = [
      'ALTER TABLE products ADD COLUMN brand VARCHAR(255) DEFAULT "Generic"',
      'ALTER TABLE products ADD COLUMN highlights JSON DEFAULT NULL',
      'ALTER TABLE products ADD COLUMN specifications JSON DEFAULT NULL',
      'ALTER TABLE products ADD COLUMN delivery_info JSON DEFAULT NULL',
      'ALTER TABLE products ADD COLUMN seller_info JSON DEFAULT NULL'
    ];

    for (const sql of columns) {
      try {
        await pool.query(sql);
      } catch (err) {
        // 1060 is ER_DUP_FIELDNAME
        if (err.errno !== 1060) {
          throw err;
        }
      }
    }

    console.log('Schema updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating schema:', error);
    process.exit(1);
  }
}

updateSchema();
