import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalPrice: 0,
  cartId: localStorage.getItem('cartId') || null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Set cart ID
    setCartId: (state, action) => {
      state.cartId = action.payload;
      localStorage.setItem('cartId', action.payload);
    },

    // Set cart items
    setCartItems: (state, action) => {
      state.items = action.payload.items;
      state.totalPrice = action.payload.totalPrice;
    },

    // Add item to cart
    addItem: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find(i => i.product_id === item.product_id);

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    // Update item quantity
    updateItem: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(i => i.product_id === productId);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i.product_id !== productId);
        } else {
          item.quantity = quantity;
        }
      }
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    // Remove item from cart
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.product_id !== action.payload);
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    // Clear cart
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
    }
  }
});

export const { setCartId, setCartItems, addItem, updateItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
