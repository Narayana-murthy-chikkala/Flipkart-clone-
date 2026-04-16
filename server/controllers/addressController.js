import { pool } from '../config/db.js';

/**
 * addressController.js
 * Full CRUD for user shipping addresses.
 * Every write operation verifies ownership (user_id === req.user.id)
 * before proceeding so users can never modify each other's addresses.
 */

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/addresses
// Returns all addresses for the currently authenticated user, newest first.
// ─────────────────────────────────────────────────────────────────────────────
export const getMyAddresses = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM addresses WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('[addressController] getMyAddresses:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/addresses
// Creates a new address row linked to req.user.id.
// ─────────────────────────────────────────────────────────────────────────────
export const addAddress = async (req, res) => {
  const { name, phone, pincode, address, city, type } = req.body;

  // Basic validation
  if (!name || !phone || !pincode || !address || !city) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO addresses (user_id, name, phone, pincode, address, city, type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, name, phone, pincode, address, city, type || 'Home']
    );

    const [newAddress] = await pool.query(
      'SELECT * FROM addresses WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({ success: true, data: newAddress[0] });
  } catch (error) {
    console.error('[addressController] addAddress:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/addresses/:id
// Partial update — only the fields provided in the body are changed.
// Verifies ownership before writing.
// ─────────────────────────────────────────────────────────────────────────────
export const updateAddress = async (req, res) => {
  const { name, phone, pincode, address, city, type } = req.body;

  try {
    // Fetch existing row (also serves as an ownership proof)
    const [existing] = await pool.query(
      'SELECT * FROM addresses WHERE id = ?',
      [req.params.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Address not found.' });
    }

    if (existing[0].user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    const current = existing[0];

    await pool.query(
      `UPDATE addresses
          SET name    = ?,
              phone   = ?,
              pincode = ?,
              address = ?,
              city    = ?,
              type    = ?
        WHERE id = ?`,
      [
        name || current.name,
        phone || current.phone,
        pincode || current.pincode,
        address || current.address,
        city || current.city,
        type || current.type,
        req.params.id,
      ]
    );

    const [updated] = await pool.query(
      'SELECT * FROM addresses WHERE id = ?',
      [req.params.id]
    );

    res.json({ success: true, data: updated[0] });
  } catch (error) {
    console.error('[addressController] updateAddress:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/addresses/:id
// Hard-deletes an address row.
// Verifies ownership before deletion.
// ─────────────────────────────────────────────────────────────────────────────
export const deleteAddress = async (req, res) => {
  try {
    const [address] = await pool.query(
      'SELECT * FROM addresses WHERE id = ?',
      [req.params.id]
    );

    if (address.length === 0) {
      return res.status(404).json({ success: false, message: 'Address not found.' });
    }

    if (address[0].user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    await pool.query('DELETE FROM addresses WHERE id = ?', [req.params.id]);

    res.json({ success: true, message: 'Address removed successfully.' });
  } catch (error) {
    console.error('[addressController] deleteAddress:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};