import apiClient from './api';

// Get cart
export const getCart = async (cartId) => {
  try {
    const response = await apiClient.get('/cart', {
      params: { cartId }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

// Add to cart
export const addToCart = async (cartId, productId, quantity) => {
  try {
    const response = await apiClient.post('/cart/add', {
      cartId,
      productId,
      quantity
    });
    return response.data.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

// Update cart item quantity
export const updateCartItem = async (cartId, productId, quantity) => {
  try {
    const response = await apiClient.put('/cart/update', {
      cartId,
      productId,
      quantity
    });
    return response.data.data;
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async (cartId, productId) => {
  try {
    const response = await apiClient.delete(`/cart/remove/${productId}`, {
      params: { cartId }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

// Clear cart
export const clearCart = async (cartId) => {
  try {
    const response = await apiClient.delete('/cart/clear', {
      params: { cartId }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};
