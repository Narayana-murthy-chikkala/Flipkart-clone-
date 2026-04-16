import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Share2, Star, ChevronDown, Check, Zap } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';
import { getProductById } from '../services/productService';
import reviewService from '../services/reviewService';
import { addItem, setCartId } from '../redux/cartSlice';
import ProductCard from '../components/ProductCard';
import { addToCart as addToCartService } from '../services/cartService';
import { useToast } from '../components/Toast';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const allProducts = useSelector(state => state.products.products);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeImg, setActiveImg] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const { isAuthenticated, user: authUser } = useSelector(state => state.auth);
  const toast = useToast();

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const res = await reviewService.getReviews(id);
      if (res.success) setReviews(res.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Please login to post a review.');
      return;
    }
    try {
      setIsSubmittingReview(true);
      const res = await reviewService.addReview(id, newReview);
      if (res.success) {
        setReviews([res.data, ...reviews]);
        setNewReview({ rating: 5, title: '', comment: '' });
        toast.success('Review posted successfully!', { title: 'Review Submitted' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await getProductById(id);
      setProduct(data);

      // Set initial image
      if (data && data.images) {
        const imgs = parseImages(data.images);
        if (imgs.length > 0) setActiveImg(imgs[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseImages = (imgData) => {
    if (!imgData) return [];
    try {
      if (typeof imgData === 'string' && imgData.startsWith('[')) {
        return JSON.parse(imgData);
      }
      if (typeof imgData === 'string' && imgData.startsWith('http')) {
        return [imgData];
      }
      if (Array.isArray(imgData)) {
        return imgData;
      }
    } catch (error) {
      console.error('Error parsing images:', error);
    }
    return [];
  };

  const images = product ? parseImages(product.images) : [];
  const inStock = product ? product.stock > 0 : false;
  const isFashion = product?.category === 'Fashion' || product?.category?.toLowerCase().includes('clothing');

  const handleAddToCart = async () => {
    if (isFashion && !selectedSize) {
      toast.info('Please select a size before adding to cart.');
      return;
    }
    try {
      setAddingToCart(true);
      let cartId = cart.cartId;

      const response = await addToCartService(cartId, id, quantity);
      if (!cartId && response.cartId) {
        cartId = response.cartId;
        dispatch(setCartId(cartId));
      }

      dispatch(addItem({
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        size: selectedSize,
        images: product.images
      }));

      toast.cart(`Added ${quantity > 1 ? `(${quantity}) ` : ''}to cart!`, { title: 'Added to Cart' });
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart. Please try again.');
      return false;
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (isFashion && !selectedSize) {
      toast.info('Please select a size before proceeding.');
      return;
    }
    const added = await handleAddToCart();
    if (added !== false) navigate('/cart');
  };

  let parsedHighlights = [];
  try {
    if (product?.highlights) {
      parsedHighlights = typeof product.highlights === 'string' ? JSON.parse(product.highlights) : product.highlights;
    }
  } catch(e) {}

  let parsedSeller = { name: "RetailNet", rating: "4.8", tenure: "8 years" };
  try {
    if (product?.seller_info) {
      parsedSeller = typeof product.seller_info === 'string' ? JSON.parse(product.seller_info) : product.seller_info;
    }
  } catch(e) {}

  let parsedSpecs = {};
  try {
    if (product?.specifications) {
      parsedSpecs = typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications;
    }
  } catch(e) {}

  if (loading) return (
    <div className="fk-loading-container">
      <div className="fk-spinner"></div>
      <span>Loading premium content...</span>
    </div>
  );

  if (!product) return <div className="fk-error-container">Product not found.</div>;

  // Aesthetic mocks
  const fakeRating = (3.8 + (product.id % 12) * 0.1).toFixed(1);
  const fakeReviews = 100 + (product.id % 900);
  const fakeDiscount = 5 + (product.id % 45);
  const fakeMrp = Math.round(product.price * (1 + fakeDiscount / 100));
  const bankOfferSavings = Math.round(product.price * 0.05);

  return (
    <div className="fk-detail-wrapper">
      <div className="fk-detail-container">

        {/* Left Column - Image Grid */}
        <div className="fk-detail-left">
          <div className="fk-sticky-images">
            <div className="fk-images-layout">
              {/* Thumbnails if multiple */}
              {images.length > 1 && (
                <div className="fk-thumbnails">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className={`fk-thumb ${activeImg === img ? 'active' : ''}`}
                      onMouseEnter={() => setActiveImg(img)}
                    >
                      <img src={img} alt="" />
                    </div>
                  ))}
                </div>
              )}

              {/* Main View */}
              <div className="fk-main-viewer">
                <img src={activeImg || images[0]} alt={product.name} />
                <div className="fk-viewer-actions">
                  <button className="fk-action-icon"><Heart size={20} /></button>
                  <button className="fk-action-icon"><Share2 size={20} /></button>
                </div>
              </div>
            </div>
            <div className="bg-[#2874f0] text-white p-3 rounded-lg mb-4 flex items-center justify-between cursor-pointer w-[95%] mx-auto hover:bg-[#1c5fcc] shadow-md">
              <div className="flex items-center gap-2">
                <div className="bg-white text-[#2874f0] text-[10px] font-black italic px-1 py-0.5 rounded-sm">WOW<br/>DEAL</div>
                <span className="font-semibold text-sm">Apply offers for maximum savings</span>
              </div>
              <ChevronDown size={20} className="rotate-180" />
            </div>

            <div className="fk-main-actions">
              <button
                className="fk-btn-cart-premium"
                onClick={handleAddToCart}
                disabled={!inStock || addingToCart}
              >
                Add to cart
              </button>
              <button
                className={`fk-btn-buy-premium ${!inStock ? 'notify' : ''}`}
                onClick={inStock ? handleBuyNow : () => toast.success("We'll notify you when this item is back in stock!", { title: 'Notify Me' })}
                disabled={addingToCart}
              >
                {inStock ? `Buy at ₹${parseFloat(product.price).toLocaleString('en-IN')}` : 'Notify Me'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="fk-detail-right">
          <div className="fk-breadcrumbs-modern">
            <Link to="/">Home</Link>
            <ChevronDown size={12} className="rotate-[-90deg]" />
            <Link to="/">{product.category}</Link>
            <ChevronDown size={12} className="rotate-[-90deg]" />
            <span>{product.name}</span>
          </div>

          <div className="fk-product-header">
            <span className="fk-brand-link">Visit the brand store</span>
            <h1 className="fk-product-title">{product.name}</h1>

            <div className="fk-rating-summary">
              <div className="fk-stars">
                {fakeRating} <Star size={12} fill="white" color="white" />
              </div>
              <span className="fk-count">{fakeReviews.toLocaleString()} Ratings & Reviews</span>
              <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="assured" className="fk-assured" />
            </div>
          </div>

          {/* Pricing Section */}
          <div className="fk-price-section">
            <div className="fk-hot-deal">Hot Deal</div>
            <div className="fk-price-main">
              <span className="fk-price-discount">
                <span className="arrow">⬇</span> {fakeDiscount}%
              </span>
              <span className="fk-price-mrp">{formatPrice(fakeMrp)}</span>
              <span className="fk-price-final">{formatPrice(product.price)}</span>
            </div>
            <p className="fk-tax-info">inclusive of all taxes</p>
          </div>

          {/* Size Section (Fashion Only) */}
          {isFashion && (
            <div className="fk-size-section">
              <div className="fk-size-header">
                <h3>Select Size</h3>
                <span className="fk-size-chart">Size Chart</span>
              </div>
              <div className="fk-size-options">
                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <button
                    key={size}
                    className={`fk-size-box ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* New Offer Card Design */}
          <div className="fk-offers-card">
            <div className="fk-offer-header">
              <Zap size={16} fill="white" /> Apply offers for maximum savings
              <ChevronDown size={18} />
            </div>
            <div className="fk-offer-content">
              <div className="fk-buy-now-box">
                Buy at <span className="highlight">{formatPrice(product.price - bankOfferSavings)}</span>
              </div>

              <div className="fk-bank-offers-title">Bank offers</div>
              <div className="fk-bank-grid">
                {[
                  { label: '₹50 off', sub: 'BHIM UPI', icon: 'https://v3.flipkart.com/img/upi-icon.png' },
                  { label: '₹30 off', sub: 'Flipkart Axis', icon: 'https://v3.flipkart.com/img/axis-icon.png' },
                  { label: '₹30 off', sub: 'Flipkart Axis', icon: 'https://v3.flipkart.com/img/axis-icon.png' },
                  { label: '₹50 off', sub: 'Paytm Wallet', icon: 'https://v3.flipkart.com/img/paytm-icon.png' }
                ].map((offer, i) => (
                  <div key={i} className="fk-bank-item">
                    <div className="fk-bank-info">
                      <span className="val">{offer.label}</span>
                      <span className="sub">{offer.sub}</span>
                    </div>
                    <button className="fk-apply-btn">Apply</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Highlights & Services */}
          <div className="fk-features">
            <div className="fk-feature-row">
              <div className="fk-f-label">Delivery</div>
              <div className="fk-f-value">
                <span className="bold">Delivery by Tomorrow, 11 PM</span> | <span className="free">Free</span> <span className="strike">₹40</span>
              </div>
            </div>

            <div className="fk-feature-row">
              <div className="fk-f-label">Highlights</div>
              <div className="fk-f-value">
                <ul className="fk-bullet-list">
                  {parsedHighlights.length > 0 ? parsedHighlights.map((hl, i) => (
                    <li key={i}>{hl}</li>
                  )) : (
                    <>
                      <li>{product.description}</li>
                      <li>Category: {product.category}</li>
                      <li>Availability: {inStock ? 'In Stock' : 'Out of Stock'}</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {Object.keys(parsedSpecs).length > 0 && (
               <div className="fk-feature-row mt-4">
                 <div className="fk-f-label">Specifications</div>
                 <div className="fk-f-value">
                    <table className="text-sm text-gray-800 w-full">
                       <tbody>
                          {Object.entries(parsedSpecs).map(([k, v]) => (
                             <tr key={k}>
                                <td className="text-gray-500 py-1 w-1/3">{k}</td>
                                <td className="py-1">{v}</td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
               </div>
            )}

            <div className="fk-feature-row mt-4 mb-4">
              <div className="fk-f-label">Seller</div>
              <div className="fk-f-value">
                <span className="seller-name text-[#2874f0] font-medium cursor-pointer">{parsedSeller.name}</span> <span className="seller-rating bg-[#2874f0] text-white px-1.5 py-0.5 rounded ml-2 text-xs">{parsedSeller.rating} ★</span>
                <span className="text-xs text-gray-500 ml-2">• {parsedSeller.tenure} with Flipkart</span>
                <p className="mt-1 text-xs text-[#2874f0] cursor-pointer font-medium mt-2">See other sellers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings & Reviews Section */}
      <div className="max-w-screen-xl mx-auto px-4 mt-8 pb-12">
        <div className="bg-white rounded-sm border border-gray-200 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-10 border-b pb-4">
             <h2 className="text-2xl font-semibold text-[#212121]">Ratings & Reviews</h2>
             {isAuthenticated && (
                <button className="bg-white text-[#2874f0] border border-gray-300 px-6 py-2 shadow-sm font-medium rounded-sm hover:bg-gray-50 uppercase text-sm">Rate Product</button>
             )}
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
             {/* Left Stats */}
             <div className="w-full lg:w-1/3">
                <div className="flex items-center gap-6 mb-8">
                   <div className="text-4xl font-medium flex items-center gap-1">
                      {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '4.2'} <Star size={24} fill="#000" />
                   </div>
                   <div className="text-gray-500 font-medium">
                      <div className="text-lg">{reviews.length.toLocaleString()} Ratings &</div>
                      <div>{reviews.length.toLocaleString()} Reviews</div>
                   </div>
                </div>

                {/* Rating bars */}
                {[5, 4, 3, 2, 1].map(num => {
                   const count = reviews.filter(r => r.rating === num).length;
                   const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                   return (
                      <div key={num} className="flex items-center gap-3 mb-2 text-sm font-medium text-gray-600">
                         <span className="w-4 whitespace-nowrap">{num} ★</span>
                         <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-green-600" style={{ width: `${percentage}%` }}></div>
                         </div>
                         <span className="text-gray-400 text-xs w-8 text-right">{count.toLocaleString()}</span>
                      </div>
                   );
                })}
             </div>

             {/* Right Reviews List / Submit Form */}
             <div className="flex-1">
                {isAuthenticated && (
                   <form onSubmit={handleReviewSubmit} className="bg-[#f5faff] border border-[#e0e0e0] p-6 mb-10 rounded-sm">
                      <h3 className="font-semibold mb-4 text-[#212121]">Write a Review</h3>
                      <div className="flex gap-2 mb-4">
                         {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                               key={star} 
                               size={28} 
                               className="cursor-pointer transition-colors"
                               onClick={() => setNewReview({ ...newReview, rating: star })}
                               fill={newReview.rating >= star ? '#388e3c' : 'none'}
                               stroke={newReview.rating >= star ? '#388e3c' : '#878787'}
                            />
                         ))}
                      </div>
                      <input 
                         type="text" 
                         placeholder="Review title (e.g. Excellent material)" 
                         className="w-full p-3 border border-gray-300 mb-4 rounded-sm outline-none focus:border-[#2874f0]" 
                         value={newReview.title}
                         onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                         required
                      />
                      <textarea 
                         placeholder="Detailed review (Optional)" 
                         className="w-full p-3 border border-gray-300 mb-4 h-28 rounded-sm outline-none focus:border-[#2874f0] resize-none"
                         value={newReview.comment}
                         onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                         required
                      ></textarea>
                      <button 
                         type="submit" 
                         disabled={isSubmittingReview}
                         className="bg-[#fb641b] text-white px-8 py-3 rounded-sm font-semibold uppercase shadow-md active:scale-95 transition-all"
                      >
                         {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                   </form>
                )}

                <div className="space-y-8">
                   {reviews.length > 0 ? reviews.map((review, i) => (
                      <div key={i} className="border-b border-gray-100 pb-8">
                         <div className="flex items-center gap-3 mb-2">
                            <span className="bg-green-600 text-white text-[10px] font-bold px-1.5 py-[1px] rounded flex items-center gap-0.5">
                               {review.rating} <Star size={8} fill="white" />
                            </span>
                            <span className="font-semibold text-[#212121]">{review.title}</span>
                         </div>
                         <p className="text-[#212121] text-sm leading-relaxed mb-4">{review.comment}</p>
                         <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                            <span className="text-[#878787]">{review.user_name || 'Flipkart Customer'}</span>
                            <span className="text-[#388e3c] flex items-center gap-0.5">
                               <Check size={12} strokeWidth={3} /> Certified Buyer
                            </span>
                            <span>• {new Date(review.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                         </div>
                      </div>
                   )) : (
                      <div className="text-center py-10">
                         <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/empty-reviews-ratings_8db1cc.png" alt="No reviews" className="w-48 mx-auto opacity-50 mb-4" />
                         <p className="text-gray-500 font-medium">No reviews yet. Be the first to review this product!</p>
                      </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      </div>

       {/* Similar/Recommended Products Section */}
       {product && allProducts && allProducts.length > 0 && (
         <div className="max-w-screen-xl mx-auto mt-6 bg-white p-4 shadow-sm border border-gray-100 mb-10 pb-8">
           <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
             <h2 className="text-xl font-bold text-[#212121]">Similar Products</h2>
           </div>
           <div className="flex overflow-x-auto gap-4 hide-scrollbar pb-4 pt-2">
             {allProducts
               .filter(p => p.category === product.category && String(p.id) !== String(product.id))
               .slice(0, 6)
               .map((related) => (
                 <div key={related.id} className="min-w-[230px] w-[230px] flex-shrink-0">
                   <ProductCard product={related} />
                 </div>
               ))}
             {allProducts.filter(p => p.category === product.category && String(p.id) !== String(product.id)).length === 0 && (
               <p className="text-gray-500 text-sm italic">No similar products found in this category.</p>
             )}
           </div>
         </div>
       )}

    </div>
  );
};

export default ProductDetail;
