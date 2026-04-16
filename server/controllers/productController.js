import * as productModel from '../models/productModel.js';
import { ApiError } from '../middleware/errorMiddleware.js';

/**
 * Get all products with search, category, sort, and filter support
 * GET /api/products?search=&category=&sort=&minPrice=&maxPrice=&minRating=&minDiscount=
 */
export const getAllProducts = async (req, res, next) => {
  try {
    const {
      search = '',
      category = '',
      sort = 'relevance',
      minPrice = 0,
      maxPrice = 10000000,
      minRating = 0,
      minDiscount = 0,
      page = 1,
      limit = 100,
    } = req.query;

    const products = await productModel.getAllProducts({
      search,
      category,
      sort,
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice),
      page: Number(page),
      limit: Number(limit),
    });

    res.status(200).json({
      success: true,
      data: products,
      meta: {
        total: products.length,
        page: Number(page),
        limit: Number(limit),
        sort,
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get product by ID
 * GET /api/products/:id
 */
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productModel.getProductById(id);

    if (!product) {
      throw new ApiError('Product not found', 404);
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all categories
 * GET /api/products/category/list
 */
export const getCategories = async (req, res, next) => {
  try {
    const categories = await productModel.getCategories();

    res.status(200).json({
      success: true,
      data: categories.map(cat => cat.category)
    });
  } catch (error) {
    next(error);
  }
};