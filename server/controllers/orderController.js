import * as orderModel from '../models/orderModel.js';
import * as cartModel from '../models/cartModel.js';
import { generateOrderId } from '../utils/generateOrderId.js';
import { ApiError } from '../middleware/errorMiddleware.js';
import { sendEmail } from '../utils/sendEmail.js';

/**
 * Create new order from cart
 * POST /api/orders
 * Body: { cartId, shippingAddress, email, phone }
 */
export const createOrder = async (req, res, next) => {
  try {
    const { cartId, shippingAddress, email, phone, paymentMethod, paymentStatus } = req.body;
    const userId = req.user?.id;

    // Validate input
    if (!cartId || !shippingAddress) {
      throw new ApiError('Cart ID and shipping address are required', 400);
    }

    if (!shippingAddress.firstName || !shippingAddress.lastName ||
      !shippingAddress.address || !shippingAddress.city ||
      !shippingAddress.state || !shippingAddress.zipCode) {
      throw new ApiError('Complete shipping address is required', 400);
    }

    // Get cart items
    const cartItems = await cartModel.getCartItems(cartId);

    if (cartItems.length === 0) {
      throw new ApiError('Cart is empty', 400);
    }

    // Calculate total
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Generate order ID
    const orderId = generateOrderId();

    // Create order
    const order = await orderModel.createOrder({
      orderId,
      userId,
      cartId,
      items: cartItems,
      totalAmount,
      shippingAddress: { ...shippingAddress, email, phone },
      paymentMethod,
      paymentStatus
    });

    // Send email notification dynamically via Ethereal or actual SMTP
    if (email) {
      sendEmail({
        email,
        subject: `Order Confirmation - ${orderId}`,
        text: `Your order ${orderId} has been successfully placed on our Flipkart Clone. Total amount: ₹${totalAmount}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <div style="background-color: #2874f0; padding: 15px; color: white;">
              <h1 style="margin: 0; font-size: 24px;">Order Status: Confirmed</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
              <h2>Thank you for shopping with us!</h2>
              <p>Your order <strong>${orderId}</strong> has been successfully placed.</p>
              <h3 style="color: #2874f0;">Order Details</h3>
              <p><strong>Total Amount:</strong> ₹${parseFloat(totalAmount).toLocaleString('en-IN')}</p>
              <p><strong>Payment Method:</strong> ${paymentMethod || 'COD'}</p>
              <p><strong>Shipping To:</strong> ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.zipCode}</p>
              <br/>
              <p>We will notify you once your order ships.</p>
            </div>
          </div>
        `
      }).catch(err => console.log('Email Notification Error:', err.message));
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get order by ID
 * GET /api/orders/:id
 * Public route — guests can view their own order right after placing it.
 * If a logged-in user is present, admins can view any order;
 * regular users can only view orders that belong to them.
 */
export const getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await orderModel.getOrderById(id);

    if (!order) {
      throw new ApiError('Order not found', 404);
    }

    // If a logged-in user is making the request, enforce ownership for non-admins.
    // Guest orders (order.user_id === null) are always accessible by order ID.
    if (req.user) {
      if (req.user.role !== 'admin' && order.user_id !== null && order.user_id !== req.user.id) {
        throw new ApiError('Access denied', 403);
      }
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user orders
 * GET /api/orders/my-orders
 */
export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await orderModel.getOrdersByUserId(req.user.id);

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all orders (admin only)
 * GET /api/orders
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderModel.getAllOrders();

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};