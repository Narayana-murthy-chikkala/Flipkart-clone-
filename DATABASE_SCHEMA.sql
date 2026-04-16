-- ================================================================
-- FLIPKART CLONE — COMPLETE DATABASE SCHEMA
-- MySQL 8+ / MariaDB 10.3+
-- Run: mysql -u root -p flipkart_ecommerce < DATABASE_SCHEMA.sql
-- ================================================================

-- CREATE DATABASE IF NOT EXISTS flipkart_ecommerce;
-- USE flipkart_ecommerce;

-- ================================================================
-- USERS
-- Includes pan_card + pan_image for PAN card persistence fix
-- ================================================================
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(255)   NOT NULL,
  email         VARCHAR(255)   NOT NULL UNIQUE,
  password      VARCHAR(255)   NOT NULL,
  phone         VARCHAR(20)    DEFAULT NULL,
  gender        ENUM('Male','Female','Other') DEFAULT 'Male',
  role          ENUM('user','admin') DEFAULT 'user',
  pan_card      VARCHAR(10)    DEFAULT NULL,          -- e.g. ABCDE1234F
  pan_image     VARCHAR(255)   DEFAULT NULL,          -- path: /uploads/pan/filename.jpg
  gift_card_balance DECIMAL(10,2) DEFAULT 0.00,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- PRODUCTS
-- ================================================================
CREATE TABLE IF NOT EXISTS products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255)  NOT NULL,
  description LONGTEXT,
  price       DECIMAL(10,2) NOT NULL,
  category    VARCHAR(100)  NOT NULL,
  stock       INT           DEFAULT 0,
  images      LONGTEXT,                              -- JSON array of image URLs
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_price    (price),
  FULLTEXT KEY ft_search (name, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- CARTS
-- ================================================================
CREATE TABLE IF NOT EXISTS carts (
  id         VARCHAR(36) PRIMARY KEY,               -- UUID
  user_id    INT         DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- CART ITEMS
-- ================================================================
CREATE TABLE IF NOT EXISTS cart_items (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  cart_id    VARCHAR(36) NOT NULL,
  product_id INT         NOT NULL,
  quantity   INT         NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cart_id)    REFERENCES carts(id)    ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_product (cart_id, product_id),
  INDEX idx_cart_id (cart_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- ORDERS
-- user_id added so "my-orders" queries work correctly
-- ================================================================
CREATE TABLE IF NOT EXISTS orders (
  id               VARCHAR(50)    PRIMARY KEY,       -- Custom Order ID
  user_id          INT            NOT NULL,
  total_amount     DECIMAL(12,2)  NOT NULL,
  status           VARCHAR(50)    DEFAULT 'pending', -- pending|confirmed|shipped|delivered|cancelled
  shipping_address LONGTEXT       NOT NULL,          -- JSON object
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id   (user_id),
  INDEX idx_status    (status),
  INDEX idx_created_at(created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- ORDER ITEMS
-- ================================================================
CREATE TABLE IF NOT EXISTS order_items (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  order_id   VARCHAR(50) NOT NULL,
  product_id INT         NOT NULL,
  quantity   INT         NOT NULL,
  price      DECIMAL(10,2) NOT NULL,                 -- Price at time of order
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
  INDEX idx_order_id   (order_id),
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- ADDRESSES
-- Matches what addressController.js actually reads/writes
-- ================================================================
CREATE TABLE IF NOT EXISTS addresses (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT          NOT NULL,
  name       VARCHAR(255) NOT NULL,
  phone      VARCHAR(20)  NOT NULL,
  pincode    VARCHAR(10)  NOT NULL,
  address    TEXT         NOT NULL,
  city       VARCHAR(100) NOT NULL,
  type       ENUM('Home','Work','Other') DEFAULT 'Home',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- WISHLIST
-- ================================================================
CREATE TABLE IF NOT EXISTS wishlists (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product (user_id, product_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- REVIEWS
-- ================================================================
CREATE TABLE IF NOT EXISTS reviews (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT          NOT NULL,
  product_id INT          NOT NULL,
  rating     TINYINT      NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title      VARCHAR(255) DEFAULT NULL,
  body       TEXT         DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY one_review_per_user (user_id, product_id),
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- GIFT CARDS
-- ================================================================
CREATE TABLE IF NOT EXISTS gift_cards (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT            NOT NULL,
  card_number VARCHAR(20)    NOT NULL UNIQUE,
  pin         VARCHAR(10)    NOT NULL,
  amount      DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  is_used     TINYINT(1)     DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- SAVED UPI
-- ================================================================
CREATE TABLE IF NOT EXISTS saved_upi (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT          NOT NULL,
  upi_id     VARCHAR(100) NOT NULL,
  label      VARCHAR(50)  DEFAULT 'Primary',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- SAVED CARDS
-- ================================================================
CREATE TABLE IF NOT EXISTS saved_cards (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT          NOT NULL,
  card_number  VARCHAR(20)  NOT NULL,
  card_name    VARCHAR(100) NOT NULL,
  expiry       VARCHAR(7)   NOT NULL,                -- MM/YYYY
  card_type    VARCHAR(20)  DEFAULT 'Credit',        -- Credit | Debit
  card_network VARCHAR(20)  DEFAULT 'VISA',          -- VISA | Mastercard | Rupay | Amex
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- COUPONS
-- ================================================================
CREATE TABLE IF NOT EXISTS coupons (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  code             VARCHAR(50)  NOT NULL UNIQUE,
  description      TEXT         DEFAULT NULL,
  discount_type    ENUM('Flat','Percentage') NOT NULL DEFAULT 'Flat',
  discount_value   DECIMAL(10,2) NOT NULL DEFAULT 0,
  min_order_value  DECIMAL(10,2) DEFAULT 0,
  max_discount     DECIMAL(10,2) DEFAULT 0,          -- cap for Percentage type
  category         VARCHAR(100)  DEFAULT NULL,        -- Electronics | Fashion | Grocery etc.
  is_active        TINYINT(1)    DEFAULT 1,
  expiry           DATETIME      DEFAULT NULL,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_active (is_active),
  INDEX idx_expiry (expiry)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Seed coupons (INSERT IGNORE so safe to re-run) ──────────────
INSERT IGNORE INTO coupons (code, description, discount_type, discount_value, min_order_value, max_discount, category, is_active, expiry) VALUES
('WELCOME200',  'Get ₹200 off on your first order above ₹1,000.',         'Flat',       200,  1000, 200,  'Electronics', 1, DATE_ADD(NOW(), INTERVAL 30 DAY)),
('FASHION10',   'Flat 10% off on Fashion products. Max discount ₹500.',   'Percentage',  10,   500, 500,  'Fashion',     1, DATE_ADD(NOW(), INTERVAL 15 DAY)),
('GROCER50',    '₹50 off on grocery orders above ₹300.',                   'Flat',        50,   300,  50,  'Grocery',     1, DATE_ADD(NOW(), INTERVAL  7 DAY)),
('TECH15',      '15% off on Electronics. Max discount ₹2,000.',           'Percentage',  15,  2000, 2000, 'Electronics', 1, DATE_ADD(NOW(), INTERVAL 20 DAY)),
('BEAUTY100',   '₹100 off on Beauty orders above ₹600.',                  'Flat',       100,   600, 100,  'Beauty',      1, DATE_ADD(NOW(), INTERVAL 10 DAY)),
('TRIP20',      '20% off on Travel accessories. Max discount ₹300.',      'Percentage',  20,   500, 300,  'Travel',      1, DATE_ADD(NOW(), INTERVAL 25 DAY)),
('OLDOFFER5',   'This offer has expired.',                                  'Percentage',   5,   200, 100,  'Fashion',     0, DATE_SUB(NOW(), INTERVAL  5 DAY));

-- ================================================================
-- MIGRATION — add missing columns to existing tables
-- Run these ALTER statements if your tables already exist
-- (safe to run — uses IF NOT EXISTS / IGNORE patterns)
-- ================================================================

-- Add pan_card & pan_image to users if not already there
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS pan_card          VARCHAR(10)    DEFAULT NULL AFTER role,
  ADD COLUMN IF NOT EXISTS pan_image         VARCHAR(255)   DEFAULT NULL AFTER pan_card,
  ADD COLUMN IF NOT EXISTS gift_card_balance DECIMAL(10,2)  DEFAULT 0.00 AFTER pan_image;

-- Add user_id to orders if not already there
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS user_id INT DEFAULT NULL AFTER id,
  ADD INDEX IF NOT EXISTS idx_user_id (user_id);