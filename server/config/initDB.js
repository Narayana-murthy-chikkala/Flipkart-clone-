import { pool } from './db.js';

export const initDB = async () => {
  try {
    // 0. Users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id         VARCHAR(36) PRIMARY KEY,
        name       VARCHAR(255) NOT NULL,
        email      VARCHAR(255) NOT NULL UNIQUE,
        password   VARCHAR(255) NOT NULL,
        role       ENUM('user','admin') DEFAULT 'user',
        phone      VARCHAR(20),
        gender     VARCHAR(10),
        created_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 1. Products
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        name        VARCHAR(255)   NOT NULL,
        description TEXT,
        price       DECIMAL(10,2)  NOT NULL,
        category    VARCHAR(100),
        brand       VARCHAR(255)   DEFAULT 'Generic',
        rating      DECIMAL(3,2)   DEFAULT 4.0,
        discount    INT            DEFAULT 0,
        stock       INT            NOT NULL DEFAULT 0,
        images      JSON,
        created_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 2. Carts
    await pool.query(`
      CREATE TABLE IF NOT EXISTS carts (
        id         VARCHAR(36) PRIMARY KEY,
        user_id    VARCHAR(36) DEFAULT NULL,
        created_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // 3. Cart items  (depends on carts + products)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        cart_id    VARCHAR(36) NOT NULL,
        product_id INT         NOT NULL,
        quantity   INT         NOT NULL DEFAULT 1,
        created_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cart_id)    REFERENCES carts(id)    ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    // 4. Orders
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id               VARCHAR(36)    PRIMARY KEY,
        user_id          VARCHAR(36)    DEFAULT NULL,
        total_amount     DECIMAL(10,2)  NOT NULL,
        status           VARCHAR(50)    NOT NULL DEFAULT 'pending',
        payment_method   VARCHAR(50)    DEFAULT 'COD',
        payment_status   VARCHAR(50)    NOT NULL DEFAULT 'unpaid',
        shipping_address JSON,
        created_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
        updated_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // 5. Order items  (depends on orders + products)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        order_id   VARCHAR(36)    NOT NULL,
        product_id INT            DEFAULT NULL,
        quantity   INT            NOT NULL,
        price      DECIMAL(10,2)  NOT NULL,
        FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
      )
    `);

    // 6. Addresses
    await pool.query(`
      CREATE TABLE IF NOT EXISTS addresses (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        user_id    VARCHAR(36) NOT NULL,
        name       VARCHAR(255) NOT NULL,
        phone      VARCHAR(20) NOT NULL,
        pincode    VARCHAR(10) NOT NULL,
        address    TEXT NOT NULL,
        city       VARCHAR(100) NOT NULL,
        type       ENUM('Home', 'Work', 'Other') DEFAULT 'Home',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 7. Wishlist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        user_id    VARCHAR(36) NOT NULL,
        product_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY user_product (user_id, product_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    // 8. Reviews
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        product_id  INT NOT NULL,
        user_id     VARCHAR(36) NOT NULL,
        user_name   VARCHAR(255),
        rating      INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title       VARCHAR(255),
        comment     TEXT,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE
      )
    `);

    console.log('✅ Database tables initialised (users, products, carts, cart_items, orders, order_items, addresses, wishlist, reviews)');
  } catch (error) {
    console.error('❌ Database initialisation failed:', error.message);
    throw error;
  }
};
