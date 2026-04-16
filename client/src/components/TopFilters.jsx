import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, setSortBy, filterProducts, clearFilters, setSelectedCategory } from '../redux/productSlice';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';

/* ─── Shared dropdown wrapper ─────────────────────────────────────── */
const Dropdown = ({ label, active, children, onClear }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="relative shrink-0" ref={ref}>
            <button
                onClick={() => setOpen(o => !o)}
                className={`flex items-center gap-1.5 border rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors whitespace-nowrap ${active
                        ? 'border-[#2874f0] bg-[#e8f0fe] text-[#2874f0]'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400 bg-white'
                    }`}
            >
                {label}
            </button>

            {open && (
                <div className="absolute top-[calc(100%+6px)] left-0 bg-white rounded shadow-[0_4px_20px_rgba(0,0,0,0.15)] z-[500] min-w-[200px] border border-gray-100 overflow-hidden">
                    {children}
                </div>
            )}
        </div>
    );
};

/* ─── TopFilters component ────────────────────────────────────────── */
const TopFilters = ({ onOpenMobileFilter }) => {
    const dispatch = useDispatch();
    const { products, filters, sortBy, selectedCategory } = useSelector(state => state.products);
    const count = useSelector(state => state.products.filteredProducts.length);

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

    const RATING_OPTIONS = [
        { value: 4, label: '4★ & above' },
        { value: 3, label: '3★ & above' },
        { value: 2, label: '2★ & above' },
    ];

    const DISCOUNT_OPTIONS = [
        { value: 10, label: '10% or more' },
        { value: 20, label: '20% or more' },
        { value: 30, label: '30% or more' },
        { value: 40, label: '40% or more' },
    ];

    const PRICE_OPTIONS = [
        { min: 0, max: 500, label: 'Under ₹500' },
        { min: 500, max: 1000, label: '₹500 – ₹1,000' },
        { min: 1000, max: 5000, label: '₹1,000 – ₹5,000' },
        { min: 5000, max: 10000, label: '₹5,000 – ₹10,000' },
        { min: 10000, max: 200000, label: 'Above ₹10,000' },
    ];

    const activeFilterCount = [
        filters.rating > 0,
        filters.minDiscount > 0,
        filters.brands.length > 0,
        filters.minPrice > 0 || filters.maxPrice < 200000,
    ].filter(Boolean).length;

    const handleBrandToggle = (brand) => {
        const newBrands = filters.brands.includes(brand)
            ? filters.brands.filter(b => b !== brand)
            : [...filters.brands, brand];
        applyFilter({ brands: newBrands });
    };

    const handleClearAll = () => {
        dispatch(clearFilters());
        dispatch(filterProducts());
    };

    return (
        <div className="bg-white border-b border-gray-100 px-4 py-2.5 flex items-center gap-2 sticky top-0 z-[100] overflow-visible">
            {/* Filters icon label (Matches screenshot) */}
            <div className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-1.5 text-[13px] font-medium text-gray-700 bg-white shrink-0">
                <span>Filters</span>
            </div>

            {/* Category dropdown */}
            <Dropdown
                label={selectedCategory || 'Category'}
                active={!!selectedCategory}
                onClear={() => { dispatch(setSelectedCategory('')); dispatch(filterProducts()); }}
            >
                {['Grocery', 'Fashion', 'Mobiles', 'Beauty', 'Electronics', 'Home', 'Appliances', 'Travel', 'Furniture'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => {
                            dispatch(setSelectedCategory(selectedCategory === cat ? '' : cat));
                            dispatch(filterProducts());
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedCategory === cat
                            ? 'bg-[#e8f0fe] text-[#2874f0] font-medium'
                            : 'hover:bg-gray-50 text-[#212121]'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </Dropdown>

            {/* Rating dropdown */}
            <Dropdown
                label={filters.rating > 0 ? `${filters.rating}★ & above` : 'Customer Rating'}
                active={filters.rating > 0}
                onClear={() => applyFilter({ rating: 0 })}
            >
                {RATING_OPTIONS.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => applyFilter({ rating: filters.rating === opt.value ? 0 : opt.value })}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${filters.rating === opt.value
                                ? 'bg-[#e8f0fe] text-[#2874f0] font-medium'
                                : 'hover:bg-gray-50 text-[#212121]'
                            }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </Dropdown>

            {/* Discount dropdown */}
            <Dropdown
                label={filters.minDiscount > 0 ? `${filters.minDiscount}% or more` : 'Discount'}
                active={filters.minDiscount > 0}
                onClear={() => applyFilter({ minDiscount: 0 })}
            >
                {DISCOUNT_OPTIONS.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => applyFilter({ minDiscount: filters.minDiscount === opt.value ? 0 : opt.value })}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${filters.minDiscount === opt.value
                                ? 'bg-[#e8f0fe] text-[#2874f0] font-medium'
                                : 'hover:bg-gray-50 text-[#212121]'
                            }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </Dropdown>

            {/* Price Range dropdown */}
            <Dropdown
                label={
                    filters.minPrice > 0 || filters.maxPrice < 200000
                        ? `₹${filters.minPrice} – ₹${filters.maxPrice === 200000 ? '200000+' : filters.maxPrice}`
                        : 'Price Range'
                }
                active={filters.minPrice > 0 || filters.maxPrice < 200000}
                onClear={() => applyFilter({ minPrice: 0, maxPrice: 200000 })}
            >
                {PRICE_OPTIONS.map((opt, i) => {
                    const isActive = filters.minPrice === opt.min && filters.maxPrice === opt.max;
                    return (
                        <button
                            key={i}
                            onClick={() => applyFilter({
                                minPrice: isActive ? 0 : opt.min,
                                maxPrice: isActive ? 200000 : opt.max,
                            })}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${isActive
                                    ? 'bg-[#e8f0fe] text-[#2874f0] font-medium'
                                    : 'hover:bg-gray-50 text-[#212121]'
                                }`}
                        >
                            {opt.label}
                        </button>
                    );
                })}
            </Dropdown>

            {/* Brand dropdown */}
            <Dropdown
                label={
                    filters.brands.length > 0
                        ? filters.brands.length === 1 ? filters.brands[0] : `${filters.brands.length} Brands`
                        : 'Brand'
                }
                active={filters.brands.length > 0}
                onClear={() => applyFilter({ brands: [] })}
            >
                <div className="max-h-52 overflow-y-auto">
                    {availableBrands.map(brand => (
                        <label
                            key={brand}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <input
                                type="checkbox"
                                checked={filters.brands.includes(brand)}
                                onChange={() => handleBrandToggle(brand)}
                                className="accent-[#2874f0] w-3.5 h-3.5"
                            />
                            <span className="text-[#212121]">{brand}</span>
                        </label>
                    ))}
                </div>
            </Dropdown>

            {/* Clear all (only visible when filters active) */}
            {activeFilterCount > 0 && (
                <button
                    onClick={handleClearAll}
                    className="shrink-0 text-[13px] text-[#2874f0] font-semibold hover:underline ml-1 whitespace-nowrap"
                >
                    Clear All
                </button>
            )}
        </div>
    );
};

export default TopFilters;