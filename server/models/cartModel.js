import { pool } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

// Initialize or get cart (using session storage approach)
export const getOrCreateCart = async (cartId) => {
  try {
    // Check if cart exists
    const [carts] = await pool.query(
      'SELECT * FROM carts WHERE id = ?',
      [cartId]
    );

    if (carts.length > 0) {
      return carts[0];
    }

    // Create new cart
    const newCartId = uuidv4();
    await pool.query('INSERT INTO carts (id) VALUES (?)', [newCartId]);
    return { id: newCartId, created_at: new Date() };
  } catch (error) {
    throw error;
  }
};

// Add item to cart
export const addToCart = async (cartId, productId, quantity) => {
  try {
    // Check if item already exists in cart
    const [existingItems] = await pool.query(
      'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );

    if (existingItems.length > 0) {
      // Update quantity
      await pool.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?',
        [quantity, cartId, productId]
      );
    } else {
      // Insert new item
      await pool.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
        [cartId, productId, quantity]
      );
    }

    return true;
  } catch (error) {
    throw error;
  }
};

// Get cart items
export const getCartItems = async (cartId) => {
  try {
    const [items] = await pool.query(
      `SELECT ci.*, p.name, p.price, p.images 
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = ?`,
      [cartId]
    );
    // mysql2 auto-parses JSON columns; only parse images if still a raw string
    return items.map(item => ({
      ...item,
      images: typeof item.images === 'string' ? JSON.parse(item.images) : item.images
    }));
  } catch (error) {
    throw error;
  }
};

// Update cart item quantity
export const updateCartItem = async (cartId, productId, quantity) => {
  try {
    if (quantity <= 0) {
      // Delete item if quantity is 0 or negative
      await pool.query(
        'DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?',
        [cartId, productId]
      );
    } else {
      await pool.query(
        'UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?',
        [quantity, cartId, productId]
      );
    }
    return true;
  } catch (error) {
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async (cartId, productId) => {
  try {
    await pool.query(
      'DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );
    return true;
  } catch (error) {
    throw error;
  }
};

// Clear entire cart
export const clearCart = async (cartId) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
    return true;
  } catch (error) {
    throw error;
  }
};
