import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const sampleProducts = [
  {
    name: 'Samsung 55" 4K Smart TV',
    description: 'Ultra HD display with smart features',
    price: 45999,
    category: 'Electronics',
    stock: 15,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500',
      'https://images.unsplash.com/photo-1614008375890-cb53b6c5f8d5?w=500'
    ])
  },
  {
    name: 'iPhone 14 Pro',
    description: 'Latest Apple smartphone with ProMotion display',
    price: 129999,
    category: 'Electronics',
    stock: 25,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1592286927505-1def25115558?w=500',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500'
    ])
  },
  {
    name: 'Sony WH-1000XM4 Headphones',
    description: 'Noise cancelling wireless headphones',
    price: 19990,
    category: 'Electronics',
    stock: 40,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
    ])
  },
  {
    name: 'Nike Air Max 90',
    description: 'Classic Air Max shoes with visible Air unit',
    price: 8999,
    category: 'Fashion',
    stock: 60,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'
    ])
  },
  {
    name: 'Adidas Running Shoes',
    description: 'Comfortable running shoes with cushioning',
    price: 6499,
    category: 'Fashion',
    stock: 45,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'
    ])
  },
  {
    name: 'Blue Ray Polo T-Shirt',
    description: '100% cotton premium quality polo',
    price: 1299,
    category: 'Fashion',
    stock: 100,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'
    ])
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Keep drinks hot/cold for 24 hours',
    price: 799,
    category: 'Lifestyle',
    stock: 80,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1602143407151-7e36d85be0bb?w=500'
    ])
  },
  {
    name: 'Wireless Charging Pad',
    description: 'Fast charging compatible with all phones',
    price: 1499,
    category: 'Electronics',
    stock: 50,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500'
    ])
  },
  {
    name: 'Premium Cotton Bedsheet',
    description: '300 TC premium Egyptian cotton',
    price: 2499,
    category: 'Home',
    stock: 35,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'
    ])
  },
  {
    name: 'Coffee Maker Machine',
    description: 'Automatic coffee maker with timer',
    price: 3999,
    category: 'Home',
    stock: 20,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=500'
    ])
  },
  {
    name: 'LED Desk Lamp',
    description: 'Adjustable brightness with USB charging',
    price: 1899,
    category: 'Home',
    stock: 55,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1565636192335-14f0b46f5f97?w=500'
    ])
  },
  {
    name: 'Bluetooth Speaker',
    description: '360° surround sound portable speaker',
    price: 4999,
    category: 'Electronics',
    stock: 30,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1589003077984-894fdcff660b?w=500'
    ])
  },
  {
    name: 'Men Regular Fit T-Shirt',
    description: 'Cotton casual wear for daily use',
    price: 599,
    category: 'Fashion',
    stock: 120,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=500',
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500'
    ])
  },
  {
    name: 'Women Printed Kurti',
    description: 'Ethnic wear with stylish design',
    price: 1299,
    category: 'Fashion',
    stock: 70,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500',
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=500',
      'https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=500'
    ])
  },

  // 📱 Mobiles
  {
    name: 'Realme Narzo 60',
    description: 'Budget smartphone with powerful battery',
    price: 14999,
    category: 'Mobiles',
    stock: 40,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500'
    ])
  },
  {
    name: 'OnePlus 11R',
    description: 'Flagship performance with smooth display',
    price: 39999,
    category: 'Mobiles',
    stock: 30,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500',
      'https://images.unsplash.com/photo-1510557880182-3c21f8d4a4bb?w=500',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'
    ])
  },

  // 💄 Beauty
  {
    name: 'Makeup Kit Combo',
    description: 'Complete beauty kit for all occasions',
    price: 1999,
    category: 'Beauty',
    stock: 60,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500',
      'https://images.unsplash.com/photo-1583241800698-41b3d4dbde87?w=500',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500'
    ])
  },
  {
    name: 'Vitamin C Face Serum',
    description: 'Brightens skin and reduces dark spots',
    price: 699,
    category: 'Beauty',
    stock: 80,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500',
      'https://images.unsplash.com/photo-1556228578-ddc7c1d7b6dc?w=500'
    ])
  },

  // 🎧 Electronics
  {
    name: 'Gaming Mouse',
    description: 'High precision RGB gaming mouse',
    price: 1299,
    category: 'Electronics',
    stock: 90,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500'
    ])
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard',
    price: 3499,
    category: 'Electronics',
    stock: 35,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500'
    ])
  },

  // 🛋️ Home
  {
    name: 'Wall Clock',
    description: 'Modern design wall clock',
    price: 899,
    category: 'Home',
    stock: 50,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=500',
      'https://images.unsplash.com/photo-1582582494700-1d1f0a4cdd84?w=500'
    ])
  },
  {
    name: 'Curtains Set',
    description: 'Premium fabric curtains',
    price: 1499,
    category: 'Home',
    stock: 45,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=500',
      'https://images.unsplash.com/photo-1582582494700-1d1f0a4cdd84?w=500',
      'https://images.unsplash.com/photo-1598300053653-63cb3c1d4c0b?w=500'
    ])
  },

  // 🖥️ Appliances
  {
    name: 'Air Fryer',
    description: 'Healthy cooking with less oil',
    price: 4999,
    category: 'Appliances',
    stock: 25,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1615485737651-c3e2d2eab9c1?w=500',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500',
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500'
    ])
  },
  {
    name: 'Mixer Grinder',
    description: 'Powerful motor for kitchen use',
    price: 2999,
    category: 'Appliances',
    stock: 40,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500',
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500',
      'https://images.unsplash.com/photo-1598514982901-1f0d5a7e0d65?w=500'
    ])
  }
];

// Dynamically generate extra products
const generateExtraProducts = () => {
  const adjectives = ['Premium', 'Pro', 'Classic', 'Ultra', 'Smart', 'Wireless', 'Advanced', 'Basic', 'Luxury', 'Budget'];
  const colors = ['Black', 'White', 'Blue', 'Red', 'Silver', 'Gold', 'Rose Gold'];
  const productTypes = [
    { cat: 'Electronics', suffix: 'Headphones', price: [1000, 20000], img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500' },
    { cat: 'Electronics', suffix: 'Keyboard', price: [500, 5000], img: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500' },
    { cat: 'Electronics', suffix: 'Mouse', price: [300, 3000], img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500' },
    { cat: 'Mobiles', suffix: 'Smartphone', price: [8000, 50000], img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500' },
    { cat: 'Mobiles', suffix: 'Tablet', price: [15000, 40000], img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500' },
    { cat: 'Fashion', suffix: 'T-Shirt', price: [300, 1500], img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500' },
    { cat: 'Fashion', suffix: 'Sneakers', price: [1500, 8000], img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500' },
    { cat: 'Fashion', suffix: 'Jeans', price: [800, 3000], img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500' },
    { cat: 'Home', suffix: 'Lamp', price: [400, 2000], img: 'https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?w=500' },
    { cat: 'Home', suffix: 'Desk', price: [2000, 10000], img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500' },
    { cat: 'Appliances', suffix: 'Mixer', price: [1500, 4000], img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500' },
    { cat: 'Appliances', suffix: 'Microwave', price: [4000, 15000], img: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500' }
  ];

  for (let i = 0; i < 90; i++) {
    const t = productTypes[Math.floor(Math.random() * productTypes.length)];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    sampleProducts.push({
      name: `${adj} ${color} ${t.suffix}`,
      description: `High quality ${t.suffix.toLowerCase()} with excellent features. Perfect for everyday use.`,
      price: Math.floor(Math.random() * (t.price[1] - t.price[0])) + t.price[0],
      category: t.cat,
      stock: Math.floor(Math.random() * 100) + 10,
      images: JSON.stringify([t.img])
    });
  }
};
generateExtraProducts();

const createTables = async () => {
  // Users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id         VARCHAR(36) PRIMARY KEY,
      name       VARCHAR(255) NOT NULL,
      email      VARCHAR(255) NOT NULL UNIQUE,
      password   VARCHAR(255) NOT NULL,
      role       ENUM('user','admin') DEFAULT 'user',
      created_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Products table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      name        VARCHAR(255)    NOT NULL,
      description TEXT,
      price       DECIMAL(10, 2)  NOT NULL,
      category    VARCHAR(100),
      stock       INT             NOT NULL DEFAULT 0,
      images      JSON,
      created_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Carts table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS carts (
      id         VARCHAR(36)  PRIMARY KEY,
      created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Cart items table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      cart_id    VARCHAR(36)  NOT NULL,
      product_id INT          NOT NULL,
      quantity   INT          NOT NULL DEFAULT 1,
      created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cart_id)    REFERENCES carts(id)    ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  // Orders table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id               VARCHAR(36)    PRIMARY KEY,
      user_id          VARCHAR(36)    DEFAULT NULL,
      total_amount     DECIMAL(10, 2) NOT NULL,
      status           VARCHAR(50)    NOT NULL DEFAULT 'pending',
      shipping_address JSON,
      created_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
      updated_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // Order items table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      order_id   VARCHAR(36)    NOT NULL,
      product_id INT            DEFAULT NULL,
      quantity   INT            NOT NULL,
      price      DECIMAL(10, 2) NOT NULL,
      FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
    )
  `);

  console.log('✅ All tables ready (products, carts, cart_items, orders, order_items)');
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // ── 1. Ensure tables exist ──────────────────────────────────────────────
    await createTables();

    // ── 2. Clear existing data so re-runs stay idempotent ──────────────────
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query('DELETE FROM users');
    await pool.query('DELETE FROM products');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('🗑️  Cleared existing data');

    // ── 3. Insert fresh seed data ───────────────────────────────────────────
    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash('admin123', salt);
    const hashedUserPassword = await bcrypt.hash('user123', salt);
    
    // Create Default Users
    await pool.query(
      'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      ['user-admin-uuid-1', 'Admin User', 'admin@example.com', hashedAdminPassword, 'admin']
    );
    await pool.query(
      'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      ['user-test-uuid-2', 'Test User', 'user@example.com', hashedUserPassword, 'user']
    );
    console.log('✅ Base users created');

    for (const product of sampleProducts) {
      await pool.query(
        'INSERT INTO products (name, description, price, category, stock, images) VALUES (?, ?, ?, ?, ?, ?)',
        [product.name, product.description, product.price, product.category, product.stock, product.images]
      );
    }

    console.log(`✅ Successfully seeded ${sampleProducts.length} products`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();