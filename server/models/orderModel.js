import { pool } from '../config/db.js';

// Create new order
export const createOrder = async (orderData) => {
  const { orderId, userId, cartId, items, totalAmount, shippingAddress, paymentMethod, paymentStatus } = orderData;
  
  try {
    // Insert order
    await pool.query(
      `INSERT INTO orders (id, user_id, total_amount, status, shipping_address, payment_method, payment_status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [orderId, userId, totalAmount, 'pending', JSON.stringify(shippingAddress), paymentMethod || 'Card', paymentStatus || 'paid']
    );

    // Insert order items
    for (const item of items) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    // Clear the cart
    await pool.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);

    return { orderId, totalAmount, status: 'pending' };
  } catch (error) {
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE id = ?',
      [orderId]
    );

    if (orders.length === 0) return null;

    const order = orders[0];

    // Get order items
    const [items] = await pool.query(
      `SELECT oi.*, p.name, p.images 
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    order.items = items.map(item => ({
      ...item,
      images: typeof item.images === 'string' ? JSON.parse(item.images) : item.images
    }));
    // mysql2 auto-parses JSON columns; only parse if still a raw string
    if (typeof order.shipping_address === 'string') {
      order.shipping_address = JSON.parse(order.shipping_address);
    }

    return order;
  } catch (error) {
    throw error;
  }
};

// Get all orders (admin)
export const getAllOrders = async () => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    return orders;
  } catch (error) {
    throw error;
  }
};

// Get orders by User ID
export const getOrdersByUserId = async (userId) => {
  try {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    if (orders.length === 0) return [];

    // Fetch items for these orders
    const orderIds = orders.map(o => o.id);
    const [items] = await pool.query(
      `SELECT oi.*, p.name, p.images 
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id IN (?)`,
      [orderIds]
    );

    // Group items by order_id
    const itemsByOrderId = {};
    items.forEach(item => {
      if (!itemsByOrderId[item.order_id]) itemsByOrderId[item.order_id] = [];
      itemsByOrderId[item.order_id].push({
        ...item,
        images: typeof item.images === 'string' ? JSON.parse(item.images) : item.images
      });
    });

    return orders.map(order => ({
      ...order,
      shipping_address: typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : order.shipping_address,
      items: itemsByOrderId[order.id] || []
    }));
  } catch (error) {
    throw error;
  }
};

