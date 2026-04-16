import apiClient from './api';

/**
 * accountService.js
 * Covers: Gift Cards, Saved UPI, Saved Cards, Coupons, Profile/PAN update
 * Matches all endpoints in accountRoutes.js + accountController.js
 */
const accountService = {
  // ─── Gift Cards ────────────────────────────────────────────────
  /** GET /api/account/gift-cards */
  getGiftCards: async () => {
    const response = await apiClient.get('/account/gift-cards');
    return response.data;
  },
  /** POST /api/account/gift-cards — { card_number, pin, amount } */
  addGiftCard: async (data) => {
    const response = await apiClient.post('/account/gift-cards', data);
    return response.data;
  },

  // ─── Saved UPI ─────────────────────────────────────────────────
  /** GET /api/account/upi */
  getSavedUpi: async () => {
    const response = await apiClient.get('/account/upi');
    return response.data;
  },
  /** POST /api/account/upi — { upi_id, label } */
  addSavedUpi: async (data) => {
    const response = await apiClient.post('/account/upi', data);
    return response.data;
  },
  /** DELETE /api/account/upi/:id */
  deleteSavedUpi: async (id) => {
    const response = await apiClient.delete(`/account/upi/${id}`);
    return response.data;
  },

  // ─── Saved Cards ───────────────────────────────────────────────
  /** GET /api/account/cards */
  getSavedCards: async () => {
    const response = await apiClient.get('/account/cards');
    return response.data;
  },
  /** POST /api/account/cards — { card_number, card_name, expiry, card_type, card_network } */
  addSavedCard: async (data) => {
    const response = await apiClient.post('/account/cards', data);
    return response.data;
  },
  /** DELETE /api/account/cards/:id */
  deleteSavedCard: async (id) => {
    const response = await apiClient.delete(`/account/cards/${id}`);
    return response.data;
  },

  // ─── Coupons (dynamic — DB with static fallback) ───────────────
  /**
   * GET /api/account/coupons
   * Returns DB rows when available; accountController falls back to
   * STATIC_COUPONS so the UI always works even before the coupons
   * table is seeded.
   */
  getCoupons: async () => {
    const response = await apiClient.get('/account/coupons');
    return response.data;
  },

  // ─── Profile / PAN Update ─────────────────────────────────────
  /**
   * PUT /api/auth/profile
   * Sends multipart/form-data so that pan_image (file) and pan_card
   * (text) can be submitted together.
   * After a successful save the caller should dispatch(getMe()) so
   * Redux state — and the PAN preview — reflects the persisted path.
   */
  updateProfileWithPan: async (formData) => {
    const response = await apiClient.put('/auth/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export default accountService;