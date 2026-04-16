import { pool } from '../config/db.js';
import { ApiError } from '../middleware/errorMiddleware.js';

export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC',
      [productId]
    );

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;

    if (!rating || rating < 1 || rating > 5) {
      throw new ApiError('Please provide a valid rating between 1 and 5', 400);
    }

    const [result] = await pool.query(
      'INSERT INTO reviews (product_id, user_id, user_name, rating, title, comment) VALUES (?, ?, ?, ?, ?, ?)',
      [productId, userId, userName, rating, title, comment]
    );

    const [newReview] = await pool.query('SELECT * FROM reviews WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      data: newReview[0]
    });
  } catch (error) {
    next(error);
  }
};
