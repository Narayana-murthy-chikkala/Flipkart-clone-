import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import { updateItem, removeItem } from '../redux/cartSlice';
import { updateCartItem, removeFromCart } from '../services/cartService';
import wishlistService from '../services/wishlistService';
import { useToast } from '../components/Toast';
import './Cart.css';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const cart = useSelector(state => state.cart);
  const { isAuthenticated } = useSelector(state => state.auth);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > 10) {
      toast.info('Maximum quantity per item is 10.');
      return;
    }
    try {
      if (cart.cartId) {
        await updateCartItem(cart.cartId, productId, newQuantity);
      }
      dispatch(updateItem({ productId, quantity: newQuantity }));
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Could not update quantity.');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      if (cart.cartId) {
        await removeFromCart(cart.cartId, productId);
      }
      dispatch(removeItem(productId));
      toast.info('Item removed from cart.');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Could not remove item.');
    }
  };

  const handleSaveForLater = async (productId) => {
    if (!isAuthenticated) {
      toast.info('Please login to save items for later.');
      navigate('/login');
      return;
    }
    try {
      await wishlistService.addToWishlist(productId);
      await handleRemoveItem(productId);
      toast.success('Moved to Wishlist!', { title: 'Saved for Later' });
    } catch (error) {
      console.error('Error saving for later:', error);
      toast.error('Could not save item.');
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="fk-cart-page empty">
        <div className="fk-empty-cart-card">
          <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/mywishlist-empty_39f7a5.png" alt="Empty Cart" referrerPolicy="no-referrer" />
          <div className="empty-title">Your cart is empty!</div>
          <div className="empty-subtitle">Add items to it now.</div>
          {!isAuthenticated ? (
            <button onClick={() => navigate('/login')} className="fk-login-btn-cart">Login</button>
          ) : (
            <button onClick={() => navigate('/')} className="fk-login-btn-cart">Shop Now</button>
          )}
        </div>
      </div>
    );
  }

  // Price calculations
  const totalMRP = cart.items.reduce((acc, item) => acc + (item.price * 1.25 * item.quantity), 0);
  const totalDiscount = totalMRP - cart.totalPrice;
  const deliveryCharge = cart.totalPrice > 500 ? 0 : 40;
  const finalAmount = cart.totalPrice + deliveryCharge;

  return (
    <div className="fk-cart-page">
      <div className="fk-cart-container">

        {/* Left Column - Items */}
        <div className="fk-cart-items-column">
          <div className="fk-cart-header-row">
            <div className="fk-cart-delivery-header">
              <span className="fk-cart-title-main">My Cart</span>
              <span className="fk-cart-item-count">({cart.items.length} Item{cart.items.length > 1 ? 's' : ''})</span>
            </div>
            <div className="fk-cart-delivery-info">
              <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/tick_5c3ae1.png" alt="tick" className="deliver-tick" />
              Delivery by Tomorrow
            </div>
          </div>

          <div className="fk-items-wrapper">
            {cart.items.map(item => {
              const getImage = () => {
                if (!item.images) return 'https://placehold.co/150x150?text=Product';
                try {
                  if (typeof item.images === 'string' && item.images.startsWith('[')) return JSON.parse(item.images)[0];
                  if (typeof item.images === 'string' && item.images.startsWith('http')) return item.images;
                  if (Array.isArray(item.images)) return item.images[0];
                } catch (error) { console.error(error); }
                return 'https://placehold.co/150x150?text=Product';
              };
              const image = getImage();
              const fakeDiscount = 5 + (item.product_id % 35);
              const itemMrp = Math.round(item.price * 1.25);

              return (
                <div key={item.product_id} className="fk-cart-item-card">
                  <div className="item-main-flex">
                    <div className="item-left-side">
                      <img src={image} alt={item.name} className="item-img" onClick={() => navigate(`/product/${item.product_id}`)} style={{ cursor: 'pointer' }} />
                      <div className="qty-controls">
                        <button onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)} className="qty-btn" disabled={item.quantity <= 1}>−</button>
                        <input type="text" value={item.quantity} readOnly className="qty-val" />
                        <button onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)} className="qty-btn" disabled={item.quantity >= 10}>+</button>
                      </div>
                    </div>

                    <div className="item-right-side">
                      <div className="item-name" onClick={() => navigate(`/product/${item.product_id}`)} style={{ cursor: 'pointer' }}>{item.name}</div>
                      {item.size && <div className="item-size-tag">Size: {item.size}</div>}
                      <div className="item-seller">
                        Seller: RetailNet
                        <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="Assured" className="fa-img" />
                      </div>
                      <div className="item-price-row">
                        <span className="price">{formatPrice(item.price)}</span>
                        <span className="strike">{formatPrice(itemMrp)}</span>
                        <span className="discount">{fakeDiscount}% off</span>
                      </div>
                      <div className="delivery-text">
                        Delivery by {new Date(Date.now() + 86400000).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} | <span className="free">Free</span>
                      </div>
                    </div>
                  </div>

                  <div className="item-actions-row">
                    <button onClick={() => handleSaveForLater(item.product_id)} className="action-btn">SAVE FOR LATER</button>
                    <button onClick={() => handleRemoveItem(item.product_id)} className="action-btn remove-btn">REMOVE</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Place Order Sticky Footer */}
          <div className="fk-place-order-row">
            <button onClick={() => navigate('/checkout')} className="fk-place-order-btn">PLACE ORDER</button>
          </div>
        </div>

        {/* Right Column - Price Details */}
        <div className="fk-price-details-column">
          <div className="price-details-card">
            <div className="price-header">PRICE DETAILS</div>

            <div className="price-row">
              <span>Price ({cart.items.length} item{cart.items.length > 1 ? 's' : ''})</span>
              <span>{formatPrice(totalMRP)}</span>
            </div>
            <div className="price-row">
              <span>Discount</span>
              <span className="green">− {formatPrice(totalDiscount)}</span>
            </div>
            <div className="price-row">
              <span>Delivery Charges</span>
              {deliveryCharge === 0 ? (
                <span><span className="strike-dull">₹40</span>&nbsp;<span className="green">Free</span></span>
              ) : (
                <span>₹{deliveryCharge}</span>
              )}
            </div>

            <div className="price-total-row">
              <span>Total Amount</span>
              <span>{formatPrice(finalAmount)}</span>
            </div>

            {totalDiscount > 0 && (
              <div className="price-savings-row">
                You will save {formatPrice(totalDiscount)} on this order
              </div>
            )}
          </div>

          <div className="secure-badge">
            <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/shield_b33c4c.svg" alt="Secure" />
            <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;
