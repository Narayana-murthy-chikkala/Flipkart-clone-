import express from 'express';
import {
  getGiftCards,
  addGiftCard,
  getSavedUpi,
  addSavedUpi,
  deleteSavedUpi,
  getSavedCards,
  addSavedCard,
  deleteSavedCard,
  getCoupons,
} from '../controllers/accountController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── Gift Cards ────────────────────────────────────────────────────────────
// GET  /api/account/gift-cards  — list user's gift cards
// POST /api/account/gift-cards  — add / purchase a gift card
router.route('/gift-cards')
  .get(protect, getGiftCards)
  .post(protect, addGiftCard);

// ─── Saved UPI ─────────────────────────────────────────────────────────────
// GET    /api/account/upi      — list saved UPI handles
// POST   /api/account/upi      — add a new UPI handle
// DELETE /api/account/upi/:id  — remove a UPI handle
router.route('/upi')
  .get(protect, getSavedUpi)
  .post(protect, addSavedUpi);

router.route('/upi/:id')
  .delete(protect, deleteSavedUpi);

// ─── Saved Cards ───────────────────────────────────────────────────────────
// GET    /api/account/cards      — list saved debit/credit cards
// POST   /api/account/cards      — save a new card
// DELETE /api/account/cards/:id  — remove a card
router.route('/cards')
  .get(protect, getSavedCards)
  .post(protect, addSavedCard);

router.route('/cards/:id')
  .delete(protect, deleteSavedCard);

// ─── Coupons (dynamic — DB with static fallback in controller) ─────────────
// GET /api/account/coupons — returns active coupons from DB or static seeds
router.get('/coupons', protect, getCoupons);

export default router;