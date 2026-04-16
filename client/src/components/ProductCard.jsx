import React, { useState } from 'react';
import { Heart, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { formatPrice, truncateText } from '../utils/formatPrice';
import { addToCart } from '../services/cartService';
import { addItem, setCartId } from '../redux/cartSlice';
import wishlistService from '../services/wishlistService';
import { useToast } from './Toast';

const ProductCard = ({ product, compact = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const cart = useSelector(state => state.cart);
  const cartId = cart.cartId;
  const { isAuthenticated } = useSelector(state => state.auth);

  const [inWishlist, setInWishlist] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  /* ── Image helper ── */
  const getFirstImage = () => {
    if (!product.images) return 'https://placehold.co/200x200/f5f5f5/999?text=No+Image';
    try {
      if (typeof product.images === 'string' && product.images.startsWith('[')) {
        return JSON.parse(product.images)[0];
      }
      if (typeof product.images === 'string' && product.images.startsWith('http')) {
        return product.images;
      }
      if (Array.isArray(product.images)) return product.images[0];
    } catch {
      // fall through
    }
    return 'https://placehold.co/200x200/f5f5f5/999?text=No+Image';
  };

  const image = getFirstImage();

  /* ── Computed display values ── */
  const fakeRating = parseFloat((3.8 + (product.id % 12) * 0.1).toFixed(1));
  const fakeReviews = 100 + (product.id % 900);
  const fakeDiscount = 5 + (product.id % 35);
  const fakeMrp = Math.round(product.price * (1 + fakeDiscount / 100));
  const freeDelivery = product.price > 299;
  const isExpress = product.id % 7 === 0; // simulate Flipkart Express tag
  const ratingColor = fakeRating >= 4 ? '#388e3c' : fakeRating >= 3 ? '#ff9f00' : '#f44336';

  const imageHeight = compact ? 140 : 180;

  /* ── Handlers ── */
  const handleCardClick = () => navigate(`/product/${product.id}`);

  const isFashion = product?.category === 'Fashion' || (product?.category && product.category.toLowerCase().includes('clothing'));

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    // Enforce size selection for fashion items
    if (isFashion) {
      toast.info('Please select a size to continue.');
      navigate(`/product/${product.id}`);
      return;
    }

    if (isAdding) return;
    setIsAdding(true);
    try {
      let currentCartId = cartId;
      const response = await addToCart(currentCartId, product.id, 1);
      if (!currentCartId && response.cartId) {
        currentCartId = response.cartId;
        dispatch(setCartId(currentCartId));
      }
      // Provide a default size if none exists so the Cart handles it cleanly
      dispatch(addItem({ ...product, product_id: product.id, quantity: 1, size: null }));
      toast.cart(`${product.name.substring(0, 35)}... added to cart!`, { title: 'Added to Cart' });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Could not add to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info('Please login to add items to your wishlist.');
      navigate('/login');
      return;
    }
    try {
      if (inWishlist) {
        await wishlistService.removeFromWishlist(product.id);
        setInWishlist(false);
        toast.info('Removed from wishlist');
      } else {
        await wishlistService.addToWishlist(product.id);
        setInWishlist(true);
        toast.success('Added to Wishlist!');
      }
    } catch (error) {
      console.error('Wishlist error:', error);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded cursor-pointer group flex flex-col relative overflow-hidden h-full"
      style={{
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.16)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Wishlist button */}
      <button
        onClick={handleWishlist}
        className="absolute top-2 right-2 z-10 w-7 h-7 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-md transition-opacity hover:scale-110"
        title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          size={14}
          fill={inWishlist ? '#ff6161' : 'none'}
          color={inWishlist ? '#ff6161' : '#888'}
        />
      </button>

      {/* Discount badge */}
      {fakeDiscount >= 20 && (
        <div className="absolute top-2 left-2 z-10">
          <span
            className="text-white text-[10px] font-bold px-1.5 py-0.5 rounded"
            style={{ backgroundColor: '#388e3c' }}
          >
            {fakeDiscount}% OFF
          </span>
        </div>
      )}

      {/* Stock badges */}
      {product.stock <= 5 && product.stock > 0 && (
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
            Only {product.stock} left
          </span>
        </div>
      )}
      {product.stock === 0 && (
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
            Out of Stock
          </span>
        </div>
      )}

      {/* Product image */}
      <div
        className="flex items-center justify-center bg-white overflow-hidden relative"
        style={{ height: `${imageHeight}px`, padding: '10px' }}
      >
        <img
          src={image}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://placehold.co/200x200/f5f5f5/999?text=No+Image';
          }}
        />
      </div>

      {/* Product info */}
      <div className="p-2.5 flex flex-col flex-1">

        {/* Name */}
        <div
          className="text-[13px] text-[#212121] font-normal leading-snug mb-1"
          style={{
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.name}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-auto mb-1.5">
          <div
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] text-white font-semibold"
            style={{ backgroundColor: ratingColor }}
          >
            {fakeRating}
            <Star size={9} fill="white" color="white" />
          </div>
          <span className="text-[11px] text-gray-400">({fakeReviews.toLocaleString()})</span>
        </div>

        {/* Price row */}
        <div className="flex flex-wrap items-baseline gap-1 mt-0.5">
          <span className="text-[15px] font-bold text-[#212121]">
            {formatPrice(product.price)}
          </span>
          <span className="text-[11px] text-gray-400 line-through">
            {formatPrice(fakeMrp)}
          </span>
          <span className="text-[11px] font-semibold text-[#388e3c]">
            {fakeDiscount}% off
          </span>
        </div>

        {/* Delivery info */}
        <div className="flex items-center gap-2 mt-1">
          {isExpress && (
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#2874f0]">
              <Zap size={9} fill="#2874f0" /> Express
            </span>
          )}
          {freeDelivery && (
            <span className="text-[11px] font-medium text-[#388e3c]">Free delivery</span>
          )}
        </div>
      </div>

      {/* Add to Cart - hover reveal */}
      {product.stock > 0 && (
        <div className="px-2.5 pb-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {isFashion ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toast.info('Please select a size to continue.');
                navigate(`/product/${product.id}`);
              }}
              className="w-full py-1.5 rounded text-[13px] font-semibold transition-all shadow-sm active:scale-95"
              style={{ backgroundColor: '#fff', color: '#2874f0', border: '1px solid #2874f0' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f0f5ff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; }}
            >
              Select Size
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full py-1.5 rounded text-[13px] font-semibold transition-all disabled:opacity-50 active:scale-95"
              style={{ backgroundColor: isAdding ? '#e8900a' : '#ff9f00', color: 'white' }}
              onMouseEnter={(e) => { if (!isAdding) e.currentTarget.style.backgroundColor = '#e8900a'; }}
              onMouseLeave={(e) => { if (!isAdding) e.currentTarget.style.backgroundColor = '#ff9f00'; }}
            >
              {isAdding ? 'Adding…' : 'Add to Cart'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCard;