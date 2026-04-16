import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Smartphone, Monitor, Home, Zap, ShoppingBag, Dumbbell, Gamepad2, ShoppingBasket, Plane, Shirt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedCategory, filterProducts } from '../redux/productSlice';

const iconMap = {
  Electronics: Monitor,
  Fashion: Shirt,
  Home: Home,
  Appliances: Zap,
  Beauty: ShoppingBag,
  Toys: Gamepad2,
  Sports: Dumbbell,
  Grocery: ShoppingBasket,
  Mobiles: Smartphone
};

const CategoryNav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Real categories from Redux state
  const categoriesList = useSelector(state => state.products.categories) || [];
  const activeCategory = useSelector(state => state.products.selectedCategory);

  const navRef = useRef(null);

  const handleCategoryClick = (categoryName) => {
    if (categoryName === 'All') {
      dispatch(setSelectedCategory(null));
    } else {
      dispatch(setSelectedCategory(categoryName));
    }
    dispatch(filterProducts());
    navigate('/');
  };

  return (
    <nav
      ref={navRef}
      className="bg-white shadow-sm border-b border-gray-200"
      style={{ zIndex: 999, position: 'relative' }}
    >
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center overflow-x-auto scrollbar-hide">
          <div className="relative flex-shrink-0">
             <button
               onClick={() => handleCategoryClick('All')}
               className={`flex flex-col items-center gap-1 px-4 py-3 text-xs font-medium transition-colors whitespace-nowrap group ${
                 !activeCategory
                   ? 'text-blue-600 border-b-2 border-blue-600'
                   : 'text-gray-700 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600'
               }`}
             >
               <ShoppingBag size={20} className="text-gray-600 transition-colors group-hover:text-blue-600" />
               <span className="flex items-center gap-0.5">All</span>
             </button>
          </div>
          {categoriesList.map((cat) => {
            const Icon = iconMap[cat] || ShoppingBag;
            const isActive = activeCategory === cat;
            return (
              <div
                key={cat}
                className="relative flex-shrink-0"
              >
                <button
                  onClick={() => handleCategoryClick(cat)}
                  className={`flex flex-col items-center gap-1 px-4 py-3 text-xs font-medium transition-colors whitespace-nowrap group ${
                    isActive
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-700 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600'
                  }`}
                >
                  <Icon
                    size={20}
                    className={`transition-colors ${
                      isActive ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'
                    }`}
                  />
                  <span className="flex items-center gap-0.5">
                    {cat}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;
