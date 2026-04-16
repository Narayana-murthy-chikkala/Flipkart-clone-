import apiClient from './api';

// Get all products with search and category filter
export const getProducts = async (search = '', category = '') => {
  try {
    const response = await apiClient.get('/products', {
      params: { search, category }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get product details by ID
export const getProductById = async (id) => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Get all categories
export const getCategories = async () => {
  try {
    const response = await apiClient.get('/products/category/list');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
