import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, Smartphone, Monitor, Home as HomeIcon,
  Zap, Shirt, Dumbbell, Gamepad2, ShoppingBasket, Plane, ShoppingBag
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  setProducts, setCategories, setSearchQuery, setSelectedCategory,
  filterProducts, setLoading, clearFilters
} from '../redux/productSlice';
import { getProducts, getCategories } from '../services/productService';
import ProductCard from '../components/ProductCard';

/* ─── Countdown timer ─────────────────────────────────────────────── */
const CountdownTimer = ({ targetHours = 8 }) => {
  const [time, setTime] = useState({ h: targetHours, m: 23, s: 47 });
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const pad = (n) => String(n).padStart(2, '0');
  return (
    <div className="flex items-center gap-1">
      {[pad(time.h), pad(time.m), pad(time.s)].map((val, i) => (
        <React.Fragment key={i}>
          <span className="bg-gray-900 text-white text-sm font-bold px-2 py-0.5 rounded min-w-[34px] text-center">
            {val}
          </span>
          {i < 2 && <span className="text-gray-700 font-bold text-sm">:</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

/* ─── Horizontally scrollable product row ─────────────────────────── */
const ProductRow = ({ products, title, subtitle, ctaLabel, ctaColor = '#2874f0', onCtaClick }) => {
  const rowRef = useRef(null);
  const scroll = (dir) => rowRef.current?.scrollBy({ left: dir * 230, behavior: 'smooth' });

  return (
    <div className="bg-white rounded-sm shadow-sm overflow-hidden">
      {/* Section header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-50">
        <div>
          <h2 className="text-[20px] font-bold text-[#212121]">{title}</h2>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {ctaLabel && (
          <button
            onClick={onCtaClick}
            className="text-xs font-semibold px-5 py-2.5 rounded-sm text-white transition-colors"
            style={{ backgroundColor: ctaColor }}
            onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(0.9)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = 'brightness(1)'; }}
          >
            {ctaLabel}
          </button>
        )}
      </div>

      {/* Scrollable row */}
      <div className="relative group/row px-2 py-3">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-gray-50"
        >
          <ChevronLeft size={18} className="text-gray-700" />
        </button>

        <div
          ref={rowRef}
          className="flex gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.length === 0 ? (
            <div className="py-10 text-gray-400 text-sm text-center w-full">No products</div>
          ) : (
            products.map(product => (
              <div key={product.id} style={{ minWidth: '196px', maxWidth: '196px' }}>
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => scroll(1)}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-gray-50"
        >
          <ChevronRight size={18} className="text-gray-700" />
        </button>
      </div>
    </div>
  );
};

/* ─── Category shortcut icons ─────────────────────────────────────── */
const homepageCategories = [
  { name: 'Mobiles', icon: Smartphone, color: '#2874f0' },
  { name: 'Electronics', icon: Monitor, color: '#0f9d58' },
  { name: 'Fashion', icon: Shirt, color: '#8e24aa' },
  { name: 'Home', icon: HomeIcon, color: '#e80071' },
  { name: 'Appliances', icon: Zap, color: '#ff9f00' },
  { name: 'Sports', icon: Dumbbell, color: '#00acc1' },
  { name: 'Toys', icon: Gamepad2, color: '#e53935' },
  { name: 'Grocery', icon: ShoppingBasket, color: '#7cb342' },
  { name: 'Beauty', icon: ShoppingBag, color: '#d81b60' },
  { name: 'Travel', icon: Plane, color: '#3949ab' },
];

/* ─── Home page ───────────────────────────────────────────────────── */
const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { products, loading } = useSelector(state => state.products);

  useEffect(() => {
    // If URL has search/category params, redirect to /search page
    const params = new URLSearchParams(location.search);
    const urlSearch = params.get('search') || params.get('q');
    const urlCategory = params.get('category');
    if (urlSearch) {
      navigate(`/search?q=${encodeURIComponent(urlSearch)}`, { replace: true });
      return;
    }
    if (urlCategory) {
      navigate(`/search?category=${encodeURIComponent(urlCategory)}`, { replace: true });
      return;
    }
  }, [location.search]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        dispatch(setLoading(true));
        const [productData, categoryData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        dispatch(setProducts(productData));
        dispatch(setCategories(categoryData));
        dispatch(clearFilters());
        dispatch(filterProducts());
      } catch (err) {
        console.error('Home fetch error:', err);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchAll();
  }, []);

  const goToSearch = (query, isCategory = false) => {
    if (isCategory) {
      dispatch(setSelectedCategory(query));
      navigate(`/search?category=${encodeURIComponent(query)}`);
    } else {
      dispatch(setSearchQuery(query));
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
    dispatch(filterProducts());
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 px-3 py-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="bg-gray-100 rounded animate-pulse h-56" />
      ))}
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f1f3f6', minHeight: '100vh', paddingBottom: '48px', paddingTop: '8px' }}>
      <div className="max-w-screen-xl mx-auto px-4 space-y-3">

        {/* ── Hero banners ── */}
        <div className="flex gap-2 w-full" style={{ height: '220px' }}>
          {[
            'https://i.pinimg.com/1200x/72/51/2a/72512a12feeaf47440c310dff022ac85.jpg',
            'https://i.pinimg.com/736x/ac/ad/6f/acad6f44af0b6ffc505ffcaa49353a7c.jpg',
            'https://i.pinimg.com/1200x/55/82/60/5582603576bf2823ea1540b7e0b54980.jpg',
          ].map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Banner ${i + 1}`}
              referrerPolicy="no-referrer"
              className="flex-1 rounded-sm object-cover cursor-pointer hover:opacity-95 transition-opacity"
              style={{ minWidth: 0 }}
            />
          ))}
        </div>

        {/* ── Category shortcuts ── */}
        <div className="bg-white rounded-sm shadow-sm p-4">
          <div className="flex items-center justify-around flex-wrap gap-y-3">
            {homepageCategories.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => goToSearch(cat.name, true)}
                  className="flex flex-col items-center gap-1.5 group px-3"
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${cat.color}15` }}
                  >
                    <Icon size={26} color={cat.color} />
                  </div>
                  <span className="text-[12px] font-medium text-[#212121] group-hover:text-[#2874f0] transition-colors whitespace-nowrap">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Big Sale Banner ── */}
        <div className="bg-white rounded-sm shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-4">
              <h2 className="text-[20px] font-bold text-[#212121]">
                Deal of the Day
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                <span>Ends in</span>
                <CountdownTimer targetHours={8} />
              </div>
            </div>
            <button
              onClick={() => goToSearch('deals')}
              className="text-xs font-semibold px-5 py-2.5 rounded-sm text-white bg-[#2874f0] hover:bg-[#1a5ec8] transition-colors"
            >
              VIEW ALL
            </button>
          </div>
          {loading ? <LoadingSkeleton /> : (
            <div
              className="flex gap-0 overflow-x-auto"
              style={{ scrollbarWidth: 'none' }}
            >
              {products.slice(0, 8).map(product => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-[200px] border-r border-gray-100 last:border-0"
                >
                  <ProductCard product={product} compact />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Promo banners ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            'https://i.pinimg.com/1200x/bf/d7/fb/bfd7fb3d443e57f80b2ecb49744db331.jpg',
            'https://i.pinimg.com/736x/9a/c1/6f/9ac16f5504a3efc292d5487c6461941b.jpg',
            'https://i.pinimg.com/1200x/02/95/f6/0295f60217be1c9c97d7d3300910ef54.jpg',
          ].map((src, i) => (
            <div key={i} className="h-48 rounded-sm overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow">
              <img src={src} alt={`Promo ${i + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* ── Top Offers ── */}
        {loading ? null : (
          <ProductRow
            products={products.slice(8, 20)}
            title="Top Offers"
            subtitle="Best deals handpicked for you"
            ctaLabel="VIEW ALL"
            onCtaClick={() => goToSearch('top offers')}
          />
        )}

        {/* ── Still looking? (browsing history-style) ── */}
        {products.length > 0 && (
          <div className="bg-[#f0f5ff] rounded-sm overflow-hidden pb-3 shadow-sm">
            <div className="px-5 py-4 flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-[#212121]">
                Hey, still looking for these?
              </h2>
              <button
                onClick={() => goToSearch('all')}
                className="text-xs text-[#2874f0] font-semibold hover:underline"
              >
                See All
              </button>
            </div>
            <div
              className="flex gap-2 px-3 overflow-x-auto"
              style={{ scrollbarWidth: 'none' }}
            >
              {products.slice(0, 7).map(product => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-[150px] bg-white rounded-md shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-transparent hover:border-[#2874f0] cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="h-[140px] flex items-center justify-center p-3 bg-white">
                    <img
                      src={
                        product.images && product.images.length > 0
                          ? (Array.isArray(product.images) ? product.images[0] : product.images)
                          : 'https://placehold.co/200x200?text=Product'
                      }
                      alt={product.name}
                      className="max-h-full max-w-full object-contain hover:scale-105 transition-transform"
                      onError={(e) => { e.target.src = 'https://placehold.co/200x200?text=Product'; }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Recommended grid ── */}
        {!loading && products.length > 0 && (
          <div className="bg-white rounded-sm shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-50">
              <h2 className="text-[20px] font-bold text-[#212121]">Recommended Items</h2>
              <button
                onClick={() => goToSearch('recommended')}
                className="text-xs font-semibold px-5 py-2.5 rounded-sm text-white bg-[#2874f0] hover:bg-[#1a5ec8] transition-colors"
              >
                VIEW ALL
              </button>
            </div>
            <div className="p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
              {products.slice(20, 44).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* ── Footer CTA banner ── */}
        <div className="w-full rounded-sm bg-[#2874f0] flex items-center justify-between px-8 py-5 text-white shadow-sm">
          <div className="flex items-center gap-5">
            <span className="text-4xl">🚀</span>
            <div>
              <div className="text-lg font-bold">Fastest Delivery in Town!</div>
              <div className="text-xs opacity-80 mt-0.5">
                Get your products delivered within 24 hours.
              </div>
            </div>
          </div>
          <button
            onClick={() => goToSearch('express delivery')}
            className="bg-white text-[#2874f0] font-bold px-7 py-2.5 rounded-sm shadow-md hover:bg-gray-50 transition-colors text-sm uppercase"
          >
            Shop Now
          </button>
        </div>

      </div>
    </div>
  );
};

export default Home;