import { pool } from '../config/db.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const brandsMap = {
  'Electronics': ['Samsung', 'Sony', 'Apple', 'Dell', 'Boat', 'Marshall', 'Logitech'],
  'Fashion': ['Nike', 'Adidas', 'Puma', 'Levi\'s', 'Zara', 'H&M'],
  'Mobiles': ['Samsung', 'iPhone', 'OnePlus', 'Google', 'Realme', 'Xiaomi'],
  'Beauty': ['L\'Oreal', 'Mamaearth', 'Nivea', 'Lakme', 'The Body Shop'],
  'Home': ['Nilkamal', 'IKEA', 'Sleepwell', 'Philips', 'Prestige'],
  'Appliances': ['LG', 'Samsung', 'Whirlpool', 'Haier', 'Dyson'],
  'Travel': ['American Tourister', 'Safari', 'Skybags', 'Aristocrat'],
  'Furniture': ['Pepperfry', 'HomeTown', 'Godrej', 'Wipro'],
  'Grocery': ['Amul', 'Tata', 'Nestle', 'Aashirvaad', 'Cadbury', 'Fortune']
};

const backfill = async () => {
    try {
        console.log('🚀 Starting product data backfill...');
        
        // 1. Fetch all products
        const [products] = await pool.query('SELECT id, name, category, brand FROM products');
        console.log(`🔍 Found ${products.length} products to check.`);

        let updatedCount = 0;

        for (const p of products) {
            let brand = 'Generic';
            
            // Heuristic 1: Check if name starts with a known brand
            const nameLower = p.name.toLowerCase();
            const allBrands = Object.values(brandsMap).flat();
            
            for (const b of allBrands) {
                if (nameLower.startsWith(b.split(' ')[0].toLowerCase())) {
                    brand = b;
                    break;
                }
            }

            // Heuristic 2: If still Generic, assign a random one from category
            if (brand === 'Generic' && brandsMap[p.category]) {
                const possible = brandsMap[p.category];
                brand = possible[Math.floor(Math.random() * possible.length)];
            }

            // Random rating between 3.8 and 4.9
            const rating = (3.8 + Math.random() * 1.1).toFixed(1);
            // Random discount between 5 and 60
            const discount = Math.floor(Math.random() * 55) + 5;

            // 2. Update product
            await pool.query(
                'UPDATE products SET brand = ?, rating = ?, discount = ? WHERE id = ?',
                [brand, rating, discount, p.id]
            );
            updatedCount++;
        }

        console.log(`✅ Successfully backfilled data for ${updatedCount} products!`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during backfill:', err.message);
        process.exit(1);
    }
};

backfill();
