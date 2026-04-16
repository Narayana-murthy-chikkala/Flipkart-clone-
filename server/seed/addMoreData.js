import { pool } from '../config/db.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const moreProducts = [
  // 🍎 Grocery
  {
    name: 'Fresh Fuji Apples (1kg)',
    description: 'Crisp and sweet premium apples imported from Japan.',
    price: 249,
    category: 'Grocery',
    stock: 100,
    images: JSON.stringify(['https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?w=500'])
  },
  {
    name: 'Organic Full Cream Milk (1L)',
    description: 'Fresh organic milk from local farms. Pasteurized and homogenized.',
    price: 75,
    category: 'Grocery',
    stock: 200,
    images: JSON.stringify(['https://images.unsplash.com/photo-1550583724-125581fe2f8a?w=500'])
  },
  {
    name: 'Roasted Cashew Nuts (500g)',
    description: 'Premium quality roasted and salted cashews. Healthy snack.',
    price: 499,
    category: 'Grocery',
    stock: 150,
    images: JSON.stringify(['https://images.unsplash.com/photo-1509482560494-4126f8225994?w=500'])
  },
  {
    name: 'Instant Arabica Coffee',
    description: '100% pure Arabica coffee beans for a rich aroma and taste.',
    price: 349,
    category: 'Grocery',
    stock: 80,
    images: JSON.stringify(['https://images.unsplash.com/photo-1559056191-7237f11b7d54?w=500'])
  },
  {
    name: 'Basmati Rice Premium (5kg)',
    description: 'Long grain aromatic basmati rice for perfect biryani.',
    price: 799,
    category: 'Grocery',
    stock: 60,
    images: JSON.stringify(['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500'])
  },

  // 🧳 Travel
  {
    name: 'Hard Shell Carry-on Luggage',
    description: 'Durable polycarbonate suitcase with 360-degree spinner wheels.',
    price: 3499,
    category: 'Travel',
    stock: 30,
    images: JSON.stringify(['https://images.unsplash.com/photo-1565026073735-a1459430acc7?w=500'])
  },
  {
    name: 'Anti-Theft Travel Backpack',
    description: 'Water-resistant backpack with hidden zippers and USB charging port.',
    price: 1899,
    category: 'Travel',
    stock: 45,
    images: JSON.stringify(['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'])
  },
  {
    name: 'Memory Foam Neck Pillow',
    description: 'U-shaped pillow for comfortable sleep during flights and train rides.',
    price: 599,
    category: 'Travel',
    stock: 120,
    images: JSON.stringify(['https://images.unsplash.com/photo-1520639889427-8c1446a3f30c?w=500'])
  },

  // 🪑 Furniture
  {
    name: 'Ergonomic Office Chair',
    description: 'High-back mesh chair with adjustable lumbar support and armrests.',
    price: 8999,
    category: 'Furniture',
    stock: 20,
    images: JSON.stringify(['https://images.unsplash.com/photo-1505843490708-466f1b176664?w=500'])
  },
  {
    name: 'Minimalist Wooden Study Table',
    description: 'Compact design with built-in drawer. Solid pine wood finish.',
    price: 4599,
    category: 'Furniture',
    stock: 15,
    images: JSON.stringify(['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500'])
  },
  {
    name: '4-Tier Modern Bookshelf',
    description: 'Open shelf design with metal frame. Ideal for living room or office.',
    price: 2999,
    category: 'Furniture',
    stock: 25,
    images: JSON.stringify(['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=500'])
  },

  // 📱 Mobiles (Ensuring more data)
  {
    name: 'Samsung Galaxy S23 Ultra',
    description: 'Ultimate power with 200MP camera and Snapdragon 8 Gen 2.',
    price: 104999,
    category: 'Mobiles',
    stock: 10,
    images: JSON.stringify(['https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=500'])
  },
  {
    name: 'Google Pixel 7 Pro',
    description: 'The smartest smartphone with the best camera software.',
    price: 74999,
    category: 'Mobiles',
    stock: 15,
    images: JSON.stringify(['https://images.unsplash.com/photo-1666874984223-933e4590320a?w=500'])
  },

  // 👗 Fashion
  {
    name: 'Premium Leather Wallet',
    description: 'Handcrafted genuine leather wallet with RFID protection.',
    price: 1299,
    category: 'Fashion',
    stock: 50,
    images: JSON.stringify(['https://images.unsplash.com/photo-1627123424574-724758594e93?w=500'])
  },
  {
    name: 'Sunglasses - Classic Aviator',
    description: 'Polarized lenses with lightweight metal frame.',
    price: 899,
    category: 'Fashion',
    stock: 75,
    images: JSON.stringify(['https://images.unsplash.com/photo-1511499767350-a46e1bbdb711?w=500'])
  }
];

// Add generic products to fill all categories and ensure variation
const categories = ['Grocery', 'Travel', 'Furniture', 'Appliances', 'Home', 'Electronics', 'Beauty', 'Mobiles', 'Fashion'];
const adjectives = ['Premium', 'Advanced', 'Simple', 'Professional', 'Modern', 'Eco-friendly', 'Limited Edition', 'Best-selling'];

const generateMore = () => {
    for (let i = 0; i < 50; i++) {
        const cat = categories[Math.floor(Math.random() * categories.length)];
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        moreProducts.push({
            name: `${adj} ${cat} Product ${i+1}`,
            description: `A high-quality ${cat.toLowerCase()} item designed for your daily needs. Very durable and efficient.`,
            price: Math.floor(Math.random() * 5000) + 100,
            category: cat,
            stock: Math.floor(Math.random() * 100) + 10,
            images: JSON.stringify(['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500']) // Generic lifestyle product
        });
    }
}
generateMore();

const addData = async () => {
    try {
        console.log('🚀 Adding more data to the database...');
        for (const p of moreProducts) {
            await pool.query(
                'INSERT INTO products (name, description, price, category, stock, images) VALUES (?, ?, ?, ?, ?, ?)',
                [p.name, p.description, p.price, p.category, p.stock, p.images]
            );
        }
        console.log(`✅ successfully added ${moreProducts.length} new products!`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error adding data:', err.message);
        process.exit(1);
    }
};

addData();
