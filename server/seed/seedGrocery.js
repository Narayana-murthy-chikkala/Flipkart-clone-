import { pool } from '../config/db.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const groceryProducts = [
  // 🥛 Dairy & Beverages
  {
    name: 'Amul Gold Full Cream Milk (1L)',
    description: 'Fresh and creamy milk from Amul. High in nutrients and fat content.',
    price: 66,
    category: 'Grocery',
    brand: 'Amul',
    rating: 4.8,
    discount: 5,
    stock: 200,
    images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/milk/k/v/w/-original-imagp6mdfgzztvfy.jpeg?q=70'])
  },
  {
    name: 'Tata Tea Gold (500g)',
    description: 'A blend of tea with rich aroma and taste from the hills of Assam.',
    price: 310,
    category: 'Grocery',
    brand: 'Tata',
    rating: 4.5,
    discount: 10,
    stock: 150,
    images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/tea/v/y/k/-original-imagzdyhuzp8hzhz.jpeg?q=70'])
  },
  {
    name: 'Nescafe Classic Instant Coffee (100g Jar)',
    description: 'Start your morning with the signature taste of Nescafe Classic.',
    price: 285,
    category: 'Grocery',
    brand: 'Nestle',
    rating: 4.6,
    discount: 8,
    stock: 100,
    images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/coffee/b/e/l/-original-imagp7y7zfgzztff.jpeg?q=70'])
  },

  // 🍞 Staples
  {
    name: 'Aashirvaad Superior MP Atta (5kg)',
    description: 'Made from the finest grains with 0% Maida. Pure whole wheat flour.',
    price: 245,
    category: 'Grocery',
    brand: 'Aashirvaad',
    rating: 4.7,
    discount: 12,
    stock: 80,
    images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/flour/a/l/k/-original-imagp7y7zfgzztff.jpeg?q=70'])
  },
  {
    name: 'Fortune Sunlite Refined Sunflower Oil (1L)',
    description: 'Light and healthy cooking oil, rich in Vitamin E.',
    price: 135,
    category: 'Grocery',
    brand: 'Fortune',
    rating: 4.4,
    discount: 20,
    stock: 120,
    images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/edible-oil/l/r/v/-original-imagp7y7zfgzztff.jpeg?q=70'])
  },
  {
    name: 'Daawat Rozana Super Basmati Rice (5kg)',
    description: 'Long grain aromatic basmati rice for your everyday meals.',
    price: 450,
    category: 'Grocery',
    brand: 'Daawat',
    rating: 4.3,
    discount: 15,
    stock: 60,
    images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/rice/f/n/l/-original-imagp7y7zfgzztff.jpeg?q=70'])
  },

  // 🍫 Snacks & Confectionery
  {
    name: 'Cadbury Dairy Milk Silk (150g)',
    description: 'Indulge in the smooth and creamy taste of Dairy Milk Silk.',
    price: 175,
    category: 'Grocery',
    brand: 'Cadbury',
    rating: 4.9,
    discount: 5,
    stock: 200,
    images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/chocolate/b/e/l/-original-imagp7y7zfgzztff.jpeg?q=70'])
  },
  {
    name: 'Lay\'s India\'s Magic Masala Chips',
    description: 'Perfectly seasoned chips with a unique Indian spice blend.',
    price: 20,
    category: 'Grocery',
    brand: 'Lay\'s',
    rating: 4.5,
    discount: 0,
    stock: 500,
    images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/chips/x/l/v/-original-imagp7y7zfgzztff.jpeg?q=70'])
  },
  {
    name: 'Britannia Good Day Cashew Cookies (200g)',
    description: 'Rich buttery cookies loaded with premium cashews.',
    price: 35,
    category: 'Grocery',
    brand: 'Britannia',
    rating: 4.4,
    discount: 10,
    stock: 300,
    images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/cookie-biscuit/s/o/i/-original-imagp7y7zfgzztff.jpeg?q=70'])
  },
  {
    name: 'Maggi 2-Minute Masala Noodles (70g Pack of 6)',
    description: 'The classic taste that everyone loves. Ready in just 2 minutes.',
    price: 168,
    category: 'Grocery',
    brand: 'Nestle',
    rating: 4.8,
    discount: 5,
    stock: 250,
    images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/instant-noodles/p/q/h/-original-imagp7y7zfgzztff.jpeg?q=70'])
  }
];

const seedGrocery = async () => {
    try {
        console.log('🌱 Seeding fresh grocery data...');
        for (const p of groceryProducts) {
            await pool.query(
                `INSERT INTO products (name, description, price, category, brand, rating, discount, stock, images)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [p.name, p.description, p.price, p.category, p.brand, p.rating, p.discount, p.stock, p.images]
            );
        }
        console.log(`✅ Seeded ${groceryProducts.length} high-quality grocery items!`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding grocery data:', err.message);
        process.exit(1);
    }
};

seedGrocery();
