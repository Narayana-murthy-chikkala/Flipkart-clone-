import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilters, clearFilters, filterProducts } from '../redux/productSlice';
import { ChevronLeft, X } from 'lucide-react';
import './FilterSidebar.css';

const FilterSidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { products, filters, selectedCategory } = useSelector((state) => state.products);

  const availableBrands = useMemo(() => {
    const brands = new Set();
    // Use all products OR just products in the selected category to derive brands
    const sourceProducts = selectedCategory 
      ? products.filter(p => p.category === selectedCategory)
      : products;

    sourceProducts.forEach(p => {
      if (p.brand) {
        brands.add(p.brand);
      } else if (p.name) {
        const brand = p.name.split(' ')[0];
        if (brand.length > 2) brands.add(brand);
      }
    });
    return Array.from(brands).sort();
  }, [products, selectedCategory]);

  const applyFilter = (update) => {
    dispatch(setFilters(update));
    dispatch(filterProducts());
  };

  const handlePriceChange = (type, value) => {
    applyFilter({ [type]: Number(value) });
  };

  const handleBrandToggle = (brand) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    applyFilter({ brands: newBrands });
  };

  const handleRatingChange = (rating) => {
    applyFilter({ rating: filters.rating === rating ? 0 : rating });
  };

  const handleDiscountChange = (discount) => {
    applyFilter({ minDiscount: filters.minDiscount === discount ? 0 : discount });
  };

  const handleClearAll = () => {
    dispatch(clearFilters());
    dispatch(filterProducts());
  };

  const priceOptions = [0, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000];

  const discountOptions = [
    { value: 10, label: '10% and above' },
    { value: 20, label: '20% and above' },
    { value: 30, label: '30% and above' },
    { value: 40, label: '40% and above' },
    { value: 50, label: '50% and above' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="filter-overlay" onClick={onClose} />}

      <div className={`filter-sidebar ${isOpen ? 'open' : ''}`}>

        {/* Header */}
        <div className="filter-header">
          <h2>Filters</h2>
          <button className="clear-btn" onClick={handleClearAll}>CLEAR ALL</button>
        </div>

        {/* Categories */}
        <div className="filter-section">
          <div className="filter-title">Categories</div>
          <div className="text-sm text-[#2874f0] font-medium cursor-pointer flex items-center gap-1">
            <ChevronLeft size={14} />
            {selectedCategory || 'All Categories'}
          </div>
        </div>

        {/* Price Filter */}
        <div className="filter-section">
          <div className="filter-title">Price</div>
          <div className="price-range-inputs">
            <select
              className="price-select"
              value={filters.minPrice}
              onChange={(e) => handlePriceChange('minPrice', e.target.value)}
            >
              <option value="0">Min</option>
              {priceOptions.filter(p => p < filters.maxPrice).map(p => (
                <option key={`min-${p}`} value={p}>₹{p.toLocaleString('en-IN')}</option>
              ))}
            </select>
            <span className="price-to">to</span>
            <select
              className="price-select"
              value={filters.maxPrice}
              onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
            >
              {priceOptions.filter(p => p > filters.minPrice).map(p => (
                <option key={`max-${p}`} value={p}>
                  ₹{p === 200000 ? '2,00,000+' : p.toLocaleString('en-IN')}
                </option>
              ))}
              <option value="1000000">Max</option>
            </select>
          </div>
        </div>

        {/* Customer Ratings */}
        <div className="filter-section">
          <div className="filter-title">Customer Ratings</div>
          <div className="filter-list">
            {[4, 3, 2, 1].map(r => (
              <label key={r} className="filter-item" onClick={() => handleRatingChange(r)}>
                <input
                  type="checkbox"
                  checked={filters.rating === r}
                  onChange={() => { }}
                />
                <div className="flex items-center gap-2">
                  <span
                    className="flex items-center gap-0.5 text-white text-xs font-semibold px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: r >= 4 ? '#388e3c' : r >= 3 ? '#ff9f00' : '#f44336' }}
                  >
                    {r} ★
                  </span>
                  <span className="text-sm text-[#212121]">& above</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Discount Filter */}
        <div className="filter-section">
          <div className="filter-title">Discount</div>
          <div className="filter-list">
            {discountOptions.map(opt => (
              <label key={opt.value} className="filter-item" onClick={() => handleDiscountChange(opt.value)}>
                <input
                  type="checkbox"
                  checked={filters.minDiscount === opt.value}
                  onChange={() => { }}
                />
                <span className="filter-label">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Brand Filter */}
        <div className="filter-section">
          <div className="filter-title">Brand</div>
          <div className="filter-list">
            {availableBrands.map(brand => (
              <label key={brand} className="filter-item">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                />
                <span className="filter-label">{brand}</span>
              </label>
            ))}
          </div>
        </div>

      </div>
    </>
  );
};

export default FilterSidebar;