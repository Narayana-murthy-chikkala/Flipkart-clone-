import { pool } from '../config/db.js';

export const User = {
  findByEmail: async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  findById: async (id) => {
    // ✅ FIX: Added pan_image field — required by updateProfile controller
    const [rows] = await pool.query(
      'SELECT id, name, email, role, phone, gender, pan_card, pan_image, gift_card_balance, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  create: async (userData) => {
    const { id, name, email, password, role } = userData;
    await pool.query(
      'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [id, name, email, password, role || 'user']
    );
    return await User.findById(id);
  },

  update: async (id, userData) => {
    const { name, phone, gender, pan_card, gift_card_balance, pan_image } = userData;

    const fields = [];
    const values = [];

    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (phone !== undefined) { fields.push('phone = ?'); values.push(phone); }
    if (gender !== undefined) { fields.push('gender = ?'); values.push(gender); }
    if (pan_card !== undefined) { fields.push('pan_card = ?'); values.push(pan_card); }
    if (gift_card_balance !== undefined) { fields.push('gift_card_balance = ?'); values.push(gift_card_balance); }
    // ✅ FIX: pan_image was missing from the update fields
    if (pan_image !== undefined) { fields.push('pan_image = ?'); values.push(pan_image); }

    if (fields.length === 0) return await User.findById(id);

    values.push(id);
    await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return await User.findById(id);
  }
};