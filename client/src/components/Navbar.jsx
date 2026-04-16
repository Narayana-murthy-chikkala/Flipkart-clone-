import React, { useState, useRef, useEffect } from 'react';
import {
  Search, ShoppingCart, ChevronDown, Heart, Bell, Menu, X,
  LogOut, LayoutDashboard, Zap, Plane, ShoppingBag, MapPin,
  Coins, User
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { setSearchQuery, setSelectedCategory, filterProducts, clearFilters } from '../redux/productSlice';
import addressService from '../services/addressService';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';
  const dispatch = useDispatch();

  const cart = useSelector(state => state.cart);
  const cartCount = cart.items?.length || 0;
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { searchQuery: globalSearchQuery, selectedCategory: activeCategory } = useSelector(state => state.products);

  const [searchQuery, setLocalSearchQuery] = useState(globalSearchQuery || '');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [addresses, setAddresses] = useState([]);

  const searchRef = useRef(null);
  const moreBtnRef = useRef(null);
  const accountBtnRef = useRef(null);

  // Keep local input synced with redux
  useEffect(() => {
    setLocalSearchQuery(globalSearchQuery || '');
  }, [globalSearchQuery]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (moreBtnRef.current && !moreBtnRef.current.contains(e.target)) setShowMoreMenu(false);
      if (accountBtnRef.current && !accountBtnRef.current.contains(e.target)) setShowAccountMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Fetch addresses when logged in
  useEffect(() => {
    if (isAuthenticated) {
      const fetchAddresses = async () => {
        try {
          const res = await addressService.getMyAddresses();
          if (res.success) setAddresses(res.data);
        } catch (err) {
          console.error("Error fetching addresses for navbar:", err);
        }
      };
      fetchAddresses();
    } else {
      setAddresses([]);
    }
  }, [isAuthenticated]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      dispatch(setSearchQuery(q));
      dispatch(filterProducts());
      navigate(`/search?q=${encodeURIComponent(q)}`);
    } else {
      dispatch(clearFilters());
      navigate('/');
    }
    setIsMobileMenuOpen(false);
  };

  const handleCategoryClick = (categoryName) => {
    dispatch(setSelectedCategory(categoryName));
    dispatch(filterProducts());
    navigate(`/search?category=${encodeURIComponent(categoryName)}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowAccountMenu(false);
    navigate('/');
  };

  const openLogin = () => {
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    dispatch(clearFilters());
    setLocalSearchQuery('');
    navigate('/');
  };

  const categories = [
    { name: 'For You', icon: 'https://static.vecteezy.com/system/resources/thumbnails/053/207/857/small/a-yellow-shopping-bag-icon-on-a-white-button-png.png' },
    { name: 'Grocery', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/29327f40e9c4d26b.png' },
    { name: 'Fashion', icon: 'https://rukminim1.flixcart.com/fk-p-flap/128/128/image/f15c02bfeb02d15d.png' },
    { name: 'Mobiles', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png' },
    { name: 'Beauty', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png' },
    { name: 'Electronics', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/69c6589653afdb9a.png' },
    { name: 'Home', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg' },
    { name: 'Appliances', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png' },
    { name: 'Travel', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/71050627a56b4693.png' },
    { name: 'Furniture', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/29327f40e9c4d26b.png' },
  ];

  return (
    <div className={`flex flex-col border-b sticky top-0 z-[1000] shadow-sm transform transition-all duration-300 ${isSearchPage ? 'bg-[#2874f0] border-blue-600' : 'bg-white border-gray-200'}`}>

      {/* ── Tier 1: Top Utility Bar ── */}
      {!isSearchPage && (
        <div className="bg-white border-b border-gray-100 hidden md:block transition-colors duration-300">
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

          {/* Logo & Pills */}
          <div className="flex items-center gap-4">
            <a
              href="/"
              onClick={handleLogoClick}
              className={`flex items-center justify-center transition-colors rounded px-3 py-1.5 cursor-pointer shrink-0 ${isSearchPage ? 'bg-white' : 'bg-[#ffe11b] hover:bg-[#ffda00]'}`}
            >
              <span className="text-[#2874f0] font-bold text-lg italic tracking-tighter flex items-center gap-1">
                <svg width="18" height="18" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.32 8L16 1.706h-3.411H9.866l-1.077 4.148h-1.57L5.753 1.706H2.342L1.48 4.887H0l1.192 4.673h2.158l-.666 2.502h2.518l.666-2.502h1.57l-.666 2.502h2.518l.666-2.502h2.905l.394-1.558h-2.905l.363-1.37h3.313q.151-.557.241-1.132v-.004H14.32z" fill={isSearchPage ? "#2874f0" : "#2874f0"} />
                </svg>
                Flipkart
              </span>
            </a>

            {/* Quick Pills */}
            <div className="flex items-center gap-2">
              {[
                { name: '11 Minutes', icon: <div className="bg-[#9c27b0] text-white text-[10px] font-bold px-1 rounded-sm leading-none flex items-center h-4">11</div> },
                { name: 'Travel', icon: <Plane size={16} className="text-[#ff5722]" /> },
                { name: 'Grocery', icon: <ShoppingBag size={16} className="text-[#4caf50]" /> }
              ].map(pill => (
                <button
                  key={pill.name}
                  onClick={() => handleCategoryClick(pill.name === 'Grocery' ? 'Grocery' : pill.name)}
                  className={`flex items-center gap-2 px-4 py-2 transition-colors rounded-3xl text-sm font-medium ${isSearchPage 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-[#f0f2f5] hover:bg-[#e4e6e9] text-[#212121]'}`}
                >
                  {pill.icon}
                  {pill.name}
                </button>
              ))}
            </div>
          </div>

          {/* Address & Coins */}
          <div className="flex items-center gap-6">
            <div
              onClick={() => navigate(isAuthenticated ? '/dashboard?tab=addresses' : '/login')}
              className={`flex items-center gap-1.5 text-[13px] cursor-pointer group transition-colors ${isSearchPage ? 'text-blue-100 hover:text-white' : 'text-gray-700 hover:text-[#2874f0]'}`}
            >
              <MapPin size={16} className={`${isSearchPage ? 'text-white' : 'text-gray-900 group-hover:text-[#2874f0]'}`} />
              <div className="flex flex-col">
                <span className={`font-bold flex items-center gap-1 leading-tight ${isSearchPage ? 'text-white' : ''}`}>
                  {isAuthenticated ? 'HOME' : 'Guest'}
                </span>
                <span className={`font-normal truncate max-w-[200px] text-[11px] leading-tight ${isSearchPage ? 'text-blue-100' : 'text-gray-500'}`}>
                  {!isAuthenticated
                    ? "Select delivery location"
                    : (addresses.length > 0 ? `${addresses[0].address}, ${addresses[0].city}` : "Set delivery address")
                  }
                </span>
              </div>
              <ChevronDown size={14} className={`${isSearchPage ? 'text-blue-100' : 'text-gray-400'} group-hover:text-white transition-colors`} />
            </div>

            <div className="flex items-center gap-1.5 bg-[#fff9e6] px-3 py-1.5 rounded-full border border-[#ffe11b]/30 cursor-pointer hover:bg-[#fff5cc] transition-colors">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isSearchPage ? 'bg-white' : 'bg-[#ffe11b]'}`}>
                <Zap size={12} className={isSearchPage ? 'text-[#2874f0]' : 'text-white'} fill="currentColor" />
              </div>
              <span className={`text-xs font-bold ${isSearchPage ? 'text-white' : 'text-gray-800'}`}>0</span>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* ── Tier 2: Search & Actions ── */}
      <div className="h-16 flex items-center justify-between max-w-screen-xl mx-auto w-full px-4 gap-6">
        
        {/* Search page Logo */}
        {isSearchPage && (
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex flex-col items-start cursor-pointer hover:opacity-90 transition-opacity shrink-0"
          >
            <span className="text-white font-bold text-xl italic tracking-tighter leading-none">
              Flipkart
            </span>
            <span className="text-white text-[10px] italic font-medium flex items-center gap-0.5">
              Explore <span className="text-[#ffe11b] font-bold">Plus</span>
              <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/plus_aef861.png" className="w-2.5 h-2.5" />
            </span>
          </a>
        )}

        {/* Search bar */}
        <div ref={searchRef} className="flex-1 max-w-3xl">
          <form
            onSubmit={handleSearch}
            className={`flex items-center rounded-sm overflow-hidden h-9 w-full transition-all duration-200 ${isSearchPage ? 'bg-white shadow-sm' : (isFocused ? 'bg-white border-[#2874f0]' : 'bg-[#f0f5ff] border-gray-200')} ${!isSearchPage ? 'rounded-full border' : ''}`}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search for Products, Brands and More"
              className="flex-1 text-[14px] text-[#212121] outline-none w-full placeholder:text-gray-500 bg-transparent px-4"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setLocalSearchQuery(''); dispatch(clearFilters()); navigate('/'); }}
                className="px-2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
            <button
              type="submit"
              className={`px-4 transition-colors ${isSearchPage ? 'text-[#2874f0]' : (isFocused ? 'text-[#2874f0]' : 'text-gray-400')}`}
            >
              <Search size={20} />
            </button>
          </form>
        </div>

        {/* Action icons */}
        <div className="hidden md:flex items-center gap-8 shrink-0">
          {isAuthenticated ? (
            <div ref={accountBtnRef} className="relative">
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="flex items-center gap-2 group py-2"
              >
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center shrink-0 overflow-hidden bg-gray-50">
                  <User size={18} className="text-gray-500" strokeWidth={1.5} />
                </div>
                <span className={`text-[15px] font-medium transition-colors ${isSearchPage ? 'text-white group-hover:text-blue-100' : 'text-gray-800 group-hover:text-[#2874f0]'}`}>
                  {user?.name || 'Profile'}
                </span>
                <ChevronDown size={14} className={`${isSearchPage ? 'text-white' : 'text-gray-400'} transition-transform duration-200 ${showAccountMenu ? 'rotate-180' : ''}`} />
              </button>

              {showAccountMenu && (
                <div className="absolute top-[calc(100%+8px)] right-0 bg-white rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.15)] z-[1001] min-w-[240px] border border-gray-100 overflow-hidden">
                  <div className="px-5 py-4 bg-[#f0f5ff] border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Welcome,</p>
                      <p className="text-sm font-bold text-[#212121] truncate">{user?.name}</p>
                    </div>
                  </div>
                  {[
                    { label: 'My Profile', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
                    { label: 'Orders', icon: <ShoppingCart size={18} />, path: '/dashboard?tab=orders' },
                    { label: 'Wishlist', icon: <Heart size={18} />, path: '/dashboard?tab=wishlist' },
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={() => { setShowAccountMenu(false); navigate(item.path); }}
                      className="flex items-center gap-4 w-full px-5 py-3.5 text-sm text-[#212121] hover:bg-gray-50 border-b border-gray-50"
                    >
                      <span className="text-gray-400">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 w-full px-5 py-3.5 text-sm text-[#e23744] font-medium hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openLogin}
              className="flex items-center gap-2 group py-2"
            >
              <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center shrink-0 overflow-hidden bg-gray-50">
                <User size={18} className="text-gray-500" strokeWidth={1.5} />
              </div>
              <span className="text-[15px] font-medium text-gray-800 group-hover:text-[#2874f0] transition-colors">
                Login
              </span>
            </button>
          )}

          {/* Become a Seller (Search mode) */}
          {isSearchPage && (
            <a href="#" className="hidden lg:block text-white text-[15px] font-medium hover:text-blue-100 transition-colors">
              Become a Seller
            </a>
          )}

          {/* More dropdown */}
          <div ref={moreBtnRef} className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={`flex items-center gap-1.5 text-[15px] font-medium transition-colors py-2 ${isSearchPage ? 'text-white hover:text-blue-100' : 'text-gray-800 hover:text-[#2874f0]'}`}
            >
              More
              <ChevronDown size={14} className={`${isSearchPage ? 'text-white' : 'text-gray-400'} transition-transform duration-200 ${showMoreMenu ? 'rotate-180' : ''}`} />
            </button>
            {showMoreMenu && (
              <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-white rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.15)] z-[1001] min-w-[200px] border border-gray-100 overflow-hidden">
                {['Notification Preferences', 'Sell on Flipkart', 'Gift Cards', 'Help Center'].map(item => (
                  <button
                    key={item}
                    onClick={() => setShowMoreMenu(false)}
                    className="block w-full text-left px-5 py-3.5 text-sm text-[#212121] hover:bg-gray-50 border-b border-gray-50 last:border-0"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart */}
          <button
            onClick={() => navigate('/cart')}
            className={`flex items-center gap-3 text-[15px] font-medium transition-colors ${isSearchPage ? 'text-white hover:text-blue-100' : 'text-gray-800 hover:text-[#2874f0]'}`}
          >
            <div className="relative">
              <ShoppingCart size={22} strokeWidth={1.5} className={isSearchPage ? 'text-white' : ''} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#ff6161] text-white text-[10px] rounded-full w-[17px] h-[17px] flex items-center justify-center font-bold border-2 border-white">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </div>
            Cart
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-[#212121] p-1"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* ── Tier 3: Category Nav (desktop) ── */}
      <div className={`hidden md:block bg-white border-t border-gray-50 overflow-x-auto transition-all duration-300 ${isSearchPage ? 'shadow-md' : ''}`} style={{ scrollbarWidth: 'none' }}>
        <div className={`flex items-center justify-center max-w-screen-xl mx-auto w-full px-4 gap-6 transition-all duration-300 ${isSearchPage ? 'h-12' : 'h-24'}`}>
          {categories.map(cat => {
            const isActive = activeCategory === cat.name;
            return (
              <div
                key={cat.name}
                className="flex flex-col items-center justify-center cursor-pointer group px-3 shrink-0 relative h-full transition-colors"
                onClick={() => handleCategoryClick(cat.name)}
              >
                {!isSearchPage && (
                  <div className={`w-[56px] h-[56px] flex items-center justify-center mb-1 transition-all duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    <div className={`absolute inset-x-2 inset-y-4 rounded-full transition-all duration-300 ${isActive ? 'bg-[#f0f5ff] opacity-100' : 'bg-transparent group-hover:bg-gray-50 opacity-0 group-hover:opacity-100'}`} />
                    <img src={cat.icon} alt={cat.name} className="relative z-10 object-contain w-full h-full p-1" />
                  </div>
                )}
                <span className={`text-[13px] font-medium transition-colors whitespace-nowrap z-10 ${isSearchPage ? '' : 'mb-2'} ${isActive ? 'text-[#2874f0]' : 'text-gray-700 group-hover:text-[#2874f0]'}`}>
                  {cat.name}
                </span>

                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2874f0] rounded-t-lg shadow-[0_-2px_6px_rgba(40,116,240,0.3)] anim-slide-in" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mobile menu drawer ── */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-[2000] overflow-y-auto">
          <div className="flex flex-col gap-0 divide-y divide-gray-100">

            {isAuthenticated ? (
              <div className="bg-[#f0f5ff] px-5 py-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#2874f0] rounded-full flex items-center justify-center text-white font-bold text-xl uppercase">
                  {user?.name?.[0]}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Welcome,</p>
                  <p className="font-bold text-[#212121]">{user?.name}</p>
                </div>
              </div>
            ) : (
              <div className="px-5 py-4">
                <button
                  onClick={openLogin}
                  className="w-full bg-[#2874f0] text-white font-bold py-3 rounded shadow"
                >
                  Login / Sign Up
                </button>
              </div>
            )}

            {[
              { label: 'Home', path: '/' },
              { label: 'My Profile', path: '/dashboard' },
              { label: 'Orders', path: '/dashboard?tab=orders' },
              { label: 'Wishlist', path: '/dashboard?tab=wishlist' },
              { label: 'My Cart', path: '/cart' },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }}
                className="px-5 py-4 text-[#212121] font-medium text-left hover:bg-gray-50"
              >
                {item.label}
              </button>
            ))}

            {isAuthenticated && (
              <button
                onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                className="px-5 py-4 text-[#e23744] font-bold text-left"
              >
                Logout
              </button>
            )}

            {/* Mobile category chips */}
            <div className="px-5 py-4">
              <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Categories</p>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.name}
                    onClick={() => { handleCategoryClick(cat.name); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-1.5 bg-[#f0f5ff] text-[#212121] text-xs font-medium px-3 py-1.5 rounded-full hover:bg-[#e8f0fe] transition-colors"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;