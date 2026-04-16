import * as cartModel from '../models/cartModel.js';
import * as productModel from '../models/productModel.js';
import { ApiError } from '../middleware/errorMiddleware.js';

/**
 * Get or create cart
 * GET /api/cart
 */
export const getCart = async (req, res, next) => {
  try {
    let { cartId } = req.query;

    // Create new cart if not provided
    if (!cartId) {
      const cart = await cartModel.getOrCreateCart();
      cartId = cart.id;
    }

    const items = await cartModel.getCartItems(cartId);

    res.status(200).json({
      success: true,
      data: {
        cartId,
        items,
        totalItems: items.length,
        totalPrice: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add item to cart
 * POST /api/cart/add
 * Body: { cartId, productId, quantity }
 */
export const addToCart = async (req, res, next) => {
  try {
    let { cartId, productId, quantity } = req.body;

    // Validate input
    if (!productId || !quantity) {
      throw new ApiError('Product ID and quantity are required', 400);
    }

    // Verify product exists
    const product = await productModel.getProductById(productId);
    if (!product) {
      throw new ApiError('Product not found', 404);
    }

    // Create cart if not provided
    if (!cartId) {
      const cart = await cartModel.getOrCreateCart();
      cartId = cart.id;
    }

    // Add to cart
    await cartModel.addToCart(cartId, productId, quantity);

    // Get updated cart
    const items = await cartModel.getCartItems(cartId);

    res.status(201).json({
      success: true,
      message: 'Product added to cart',
      data: {
        cartId,
        items,
        totalPrice: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update cart item quantity
 * PUT /api/cart/update
 * Body: { cartId, productId, quantity }
 */
export const updateCartItem = async (req, res, next) => {
  try {
    const { cartId, productId, quantity } = req.body;

    if (!cartId || !productId || quantity === undefined) {
      throw new ApiError('Cart ID, Product ID, and quantity are required', 400);
    }

    await cartModel.updateCartItem(cartId, productId, quantity);

    const items = await cartModel.getCartItems(cartId);

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      data: {
        cartId,
        items,
        totalPrice: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove item from cart
 * DELETE /api/cart/remove/:productId
 * Query: cartId
 */
export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { cartId } = req.query;

    if (!cartId || !productId) {
      throw new ApiError('Cart ID and Product ID are required', 400);
    }

    await cartModel.removeFromCart(cartId, productId);

    const items = await cartModel.getCartItems(cartId);

    res.status(200).json({
      success: true,
      message: 'Product removed from cart',
      data: {
        cartId,
        items,
        totalPrice: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Clear entire cart
 * DELETE /api/cart/clear
 * Query: cartId
 */
export const clearCart = async (req, res, next) => {
  try {
    const { cartId } = req.query;

    if (!cartId) {
      throw new ApiError('Cart ID is required', 400);
    }

    await cartModel.clearCart(cartId);

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: {
        cartId,
        items: [],
        totalPrice: 0
      }
    });
  } catch (error) {
    next(error);
  }
};
