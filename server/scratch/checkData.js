import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function checkDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  console.log('\n📊 DATABASE PERSISTENCE CHECK');
  console.log('=============================\n');

  const tables = ['users', 'products', 'carts', 'orders', 'addresses', 'wishlist'];

  for (const table of tables) {
    try {
      const [rows] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`[${table.toUpperCase()}]`);
      console.log(`- Total Records: ${rows[0].count}`);
      
      if (rows[0].count > 0) {
        // Show the latest entry
        const [latest] = await connection.query(`SELECT * FROM ${table} ORDER BY created_at DESC LIMIT 1`);
        console.log(`- Latest entry ID: ${latest[0].id}`);
        if (table === 'orders') {
          console.log(`- Payment: ${latest[0].payment_method} (${latest[0].payment_status})`);
        }
        console.log(`- Last Updated: ${latest[0].updated_at || latest[0].created_at}`);
      }
      console.log('');
    } catch (err) {
      console.log(`[${table.toUpperCase()}] - ❌ Error: ${err.message}\n`);
    }
  }

  await connection.end();
  console.log('Check complete.\n');
}

checkDatabase();
