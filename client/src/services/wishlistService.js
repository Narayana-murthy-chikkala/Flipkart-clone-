import apiClient from './api';

const wishlistService = {
  getMyWishlist: async () => {
    const response = await apiClient.get('/wishlist');
    return response.data;
  },
  
  addToWishlist: async (productId) => {
    const response = await apiClient.post('/wishlist', { productId });
    return response.data;
  },
  
  removeFromWishlist: async (productId) => {
    const response = await apiClient.delete(`/wishlist/${productId}`);
    return response.data;
  }
};

export default wishlistService;
