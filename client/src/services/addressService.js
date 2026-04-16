import apiClient from './api';

/**
 * addressService.js
 * Full CRUD for user addresses — used by SavedAddressesTab in Dashboard.jsx
 * All responses follow the { success, data } shape from addressController.js
 */
const addressService = {
  /** GET /api/addresses — fetch all saved addresses for the logged-in user */
  getMyAddresses: async () => {
    const response = await apiClient.get('/addresses');
    return response.data;
  },

  /** POST /api/addresses — create a new address */
  addAddress: async (addressData) => {
    const response = await apiClient.post('/addresses', addressData);
    return response.data;
  },

  /** PUT /api/addresses/:id — update an existing address */
  updateAddress: async (id, addressData) => {
    const response = await apiClient.put(`/addresses/${id}`, addressData);
    return response.data;
  },

  /** DELETE /api/addresses/:id — remove an address */
  deleteAddress: async (id) => {
    const response = await apiClient.delete(`/addresses/${id}`);
    return response.data;
  },
};

export default addressService;