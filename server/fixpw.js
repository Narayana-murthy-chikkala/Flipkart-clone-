import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

async function run() {
  const db = await mysql.createPool({ 
    host: 'localhost', 
    user: 'root', 
    password: 'root123', 
    database: 'ecommerce' 
  });
  
  const h = await bcrypt.hash('user123', 10);
  console.log('Generating accurate hash:', h);
  
  await db.query('UPDATE users SET password = ? WHERE email IN (?, ?)', [h, 'user@example.com', 'admin@example.com']);
  console.log('Passwords fixed safely in JS file!');
  process.exit(0);
}
run();
