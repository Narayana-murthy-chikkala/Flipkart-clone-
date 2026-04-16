import express from 'express';
import * as productController from '../controllers/productController.js';

const router = express.Router();

// Get all products (with search and category filter)
router.get('/', productController.getAllProducts);

// Get product by ID
router.get('/:id', productController.getProductById);

// Get all categories
router.get('/category/list', productController.getCategories);

export default router;
