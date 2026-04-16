import express from 'express';
import jwt from 'jsonwebtoken';
import { createOrder, getOrder, getUserOrders, getAllOrders } from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Optional auth middleware.
 * If a valid Bearer token is present, populates req.user (so user_id gets saved on orders).
 * If no token or invalid token, silently continues as guest — does NOT block the request.
 * This is used on public routes where logged-in users should still be identified.
 */
const optionalProtect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // populates req.user.id for orderController
        } catch (err) {
            // Invalid or expired token — treat as guest, do not block
        }
    }
    next();
};

// Public routes — optionalProtect ensures user_id is saved if user is logged in
router.post('/', optionalProtect, createOrder);

// ⚠️ /my-orders MUST be before /:id — otherwise Express matches "my-orders" as :id param
router.get('/my-orders', protect, getUserOrders);

// Public single order lookup (guest-friendly)
router.get('/:id', getOrder);

// Admin only
router.get('/', protect, adminOnly, getAllOrders);

export default router;