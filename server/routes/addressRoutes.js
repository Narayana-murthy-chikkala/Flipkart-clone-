import express from 'express';
import {
  getMyAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/addressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── Address collection ────────────────────────────────────────────────────
// GET  /api/addresses  — list all addresses for the logged-in user
// POST /api/addresses  — create a new address
router.route('/')
  .get(protect, getMyAddresses)
  .post(protect, addAddress);

// ─── Single address ────────────────────────────────────────────────────────
// PUT    /api/addresses/:id  — update (ownership verified in controller)
// DELETE /api/addresses/:id  — delete (ownership verified in controller)
router.route('/:id')
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

export default router;