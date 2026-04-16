import { pool } from '../config/db.js';

// ─────────────────────────────────────────────────────────────────
// GIFT CARDS
// ─────────────────────────────────────────────────────────────────
export const getGiftCards = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM gift_cards WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addGiftCard = async (req, res) => {
  const { card_number, pin, amount } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO gift_cards (user_id, card_number, pin, amount) VALUES (?, ?, ?, ?)',
      [req.user.id, card_number, pin, amount || 0]
    );
    const [newCard] = await pool.query('SELECT * FROM gift_cards WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: newCard[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// SAVED UPI
// ─────────────────────────────────────────────────────────────────
export const getSavedUpi = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM saved_upi WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addSavedUpi = async (req, res) => {
  const { upi_id, label } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO saved_upi (user_id, upi_id, label) VALUES (?, ?, ?)',
      [req.user.id, upi_id, label]
    );
    const [newUpi] = await pool.query('SELECT * FROM saved_upi WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: newUpi[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSavedUpi = async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM saved_upi WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    res.json({ success: true, message: 'UPI handle removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// SAVED CARDS
// ─────────────────────────────────────────────────────────────────
export const getSavedCards = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM saved_cards WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addSavedCard = async (req, res) => {
  const { card_number, card_name, expiry, card_type, card_network } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO saved_cards (user_id, card_number, card_name, expiry, card_type, card_network) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, card_number, card_name, expiry, card_type, card_network]
    );
    const [newCard] = await pool.query('SELECT * FROM saved_cards WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: newCard[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSavedCard = async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM saved_cards WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    res.json({ success: true, message: 'Card removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// COUPONS
// Returns DB coupons if the table exists and has rows; otherwise
// falls back to a set of static seed coupons so the UI always works.
// ─────────────────────────────────────────────────────────────────

const STATIC_COUPONS = [
  {
    id: 1,
    code: 'WELCOME200',
    description: 'Get ₹200 off on your first order above ₹1,000.',
    discount_type: 'Flat',
    discount_value: 200,
    min_order_value: 1000,
    max_discount: 200,
    category: 'Electronics',
    is_active: true,
    expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    code: 'FASHION10',
    description: 'Flat 10% off on Fashion products. Max discount ₹500.',
    discount_type: 'Percentage',
    discount_value: 10,
    min_order_value: 500,
    max_discount: 500,
    category: 'Fashion',
    is_active: true,
    expiry: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    code: 'GROCER50',
    description: '₹50 off on grocery orders above ₹300.',
    discount_type: 'Flat',
    discount_value: 50,
    min_order_value: 300,
    max_discount: 50,
    category: 'Grocery',
    is_active: true,
    expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    code: 'TECH15',
    description: '15% off on Electronics. Max discount ₹2,000.',
    discount_type: 'Percentage',
    discount_value: 15,
    min_order_value: 2000,
    max_discount: 2000,
    category: 'Electronics',
    is_active: true,
    expiry: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    code: 'BEAUTY100',
    description: '₹100 off on Beauty & Personal Care orders above ₹600.',
    discount_type: 'Flat',
    discount_value: 100,
    min_order_value: 600,
    max_discount: 100,
    category: 'Beauty',
    is_active: true,
    expiry: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    code: 'TRIP20',
    description: '20% off on Travel accessories. Max discount ₹300.',
    discount_type: 'Percentage',
    discount_value: 20,
    min_order_value: 500,
    max_discount: 300,
    category: 'Travel',
    is_active: true,
    expiry: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 7,
    code: 'OLDOFFER5',
    description: 'This offer has expired.',
    discount_type: 'Percentage',
    discount_value: 5,
    min_order_value: 200,
    max_discount: 100,
    category: 'Fashion',
    is_active: false,
    expiry: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // expired 5 days ago
  },
];

export const getCoupons = async (req, res) => {
  try {
    // Try to query the coupons table
    const [rows] = await pool.query(
      'SELECT * FROM coupons WHERE is_active = TRUE ORDER BY created_at DESC'
    );

    // If table exists but is empty, seed it with static coupons then return them
    if (rows.length === 0) {
      try {
        const insertValues = STATIC_COUPONS.map(c => [
          c.code, c.description, c.discount_type, c.discount_value,
          c.min_order_value, c.max_discount, c.category, c.is_active, c.expiry
        ]);
        await pool.query(
          `INSERT IGNORE INTO coupons
           (code, description, discount_type, discount_value, min_order_value, max_discount, category, is_active, expiry)
           VALUES ?`,
          [insertValues]
        );
        const [seeded] = await pool.query(
          'SELECT * FROM coupons ORDER BY created_at DESC'
        );
        return res.json({ success: true, data: seeded });
      } catch (seedErr) {
        // Seed failed but that's okay — just return static data
        return res.json({ success: true, data: STATIC_COUPONS });
      }
    }

    res.json({ success: true, data: rows });
  } catch (error) {
    // Table doesn't exist yet — return static coupons so UI still works
    console.warn('coupons table not found, returning static data:', error.message);
    res.json({ success: true, data: STATIC_COUPONS });
  }
};