import apiClient from './api';

const reviewService = {
  getReviews: async (productId) => {
    const response = await apiClient.get(`/reviews/${productId}`);
    return response.data;
  },
  addReview: async (productId, reviewData) => {
    const response = await apiClient.post(`/reviews/${productId}`, reviewData);
    return response.data;
  }
};

export default reviewService;
