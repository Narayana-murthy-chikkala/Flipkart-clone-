import express from 'express';
import * as cartController from '../controllers/cartController.js';

const router = express.Router();

// Get cart
router.get('/', cartController.getCart);

// Add to cart
router.post('/add', cartController.addToCart);

// Update cart item quantity
router.put('/update', cartController.updateCartItem);

// Remove item from cart
router.delete('/remove/:productId', cartController.removeFromCart);

// Clear entire cart
router.delete('/clear', cartController.clearCart);

export default router;
