import apiClient from './api';

// Create order
export const createOrder = async (cartId, shippingAddress, email, phone, paymentMethod, paymentStatus) => {
  try {
    const response = await apiClient.post('/orders', {
      cartId,
      shippingAddress,
      email,
      phone,
      paymentMethod,
      paymentStatus
    });
    return response.data.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};
