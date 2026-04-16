import { pool } from '../config/db.js';

const SORT_MAP = {
  price_asc: 'ORDER BY price ASC',
  price_desc: 'ORDER BY price DESC',
  newest: 'ORDER BY created_at DESC',
  popularity: 'ORDER BY id DESC', // replace with sales_count if available
  rating: 'ORDER BY rating DESC',
  relevance: '',
};

/**
 * Get all products with optional search, category, sort, and price filters
 */
export const getAllProducts = async ({
  search = '',
  category = '',
  sort = 'relevance',
  minPrice = 0,
  maxPrice = 10000000,
  minRating = 0,
  minDiscount = 0,
  page = 1,
  limit = 100,
} = {}) => {
  try {
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ? OR category LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (category && category !== 'For You') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (minPrice > 0) {
      query += ' AND price >= ?';
      params.push(minPrice);
    }

    if (maxPrice < 10000000) {
      query += ' AND price <= ?';
      params.push(maxPrice);
    }

    if (minRating > 0) {
      query += ' AND rating >= ?';
      params.push(minRating);
    }

    if (minDiscount > 0) {
      query += ' AND discount >= ?';
      params.push(minDiscount);
    }

    // Sort
    const orderClause = SORT_MAP[sort] || '';
    if (orderClause) {
      query += ` ${orderClause}`;
    }

    // Pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [products] = await pool.query(query, params);
    return products;
  } catch (error) {
    throw error;
  }
};

/**
 * Get product by ID
 */
export const getProductById = async (id) => {
  try {
    const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    return products[0] || null;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all distinct categories
 */
export const getCategories = async () => {
  try {
    const [categories] = await pool.query(
      'SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != "" ORDER BY category ASC'
    );
    return categories;
  } catch (error) {
    throw error;
  }
};