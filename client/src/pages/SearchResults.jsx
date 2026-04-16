import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Filter, ChevronRight } from 'lucide-react';
import {
    setProducts, setCategories, setSearchQuery, setSelectedCategory,
    filterProducts, setLoading, clearFilters
} from '../redux/productSlice';
import { getProducts, getCategories } from '../services/productService';
import FilterSidebar from '../components/FilterSidebar';
import SortBar from '../components/SortBar';
import TopFilters from '../components/TopFilters';
import ProductCard from '../components/ProductCard';

/* ─── Skeleton card ───────────────────────────────────────────────── */
const SkeletonCard = () => (
    <div className="bg-white rounded p-3 animate-pulse" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
        <div className="bg-gray-200 rounded h-44 mb-3" />
        <div className="bg-gray-200 rounded h-3 mb-2" />
        <div className="bg-gray-200 rounded h-3 w-3/4 mb-3" />
        <div className="bg-gray-200 rounded h-4 w-1/2" />
    </div>
);

/* ─── No results illustration ─────────────────────────────────────── */
const NoResults = ({ query, onClear }) => (
    <div className="flex flex-col items-center justify-center py-20 px-4">
        <img
            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/error-no-search-results_2353c5.png"
            alt="No results"
            className="w-48 mb-6 opacity-60"
            onError={(e) => { e.target.style.display = 'none'; }}
        />
        <h3 className="text-xl font-semibold text-[#212121] mb-2">
            Sorry, no results for "{query}"
        </h3>
        <p className="text-sm text-gray-500 mb-6 text-center">
            Check the spelling or try a different search term
        </p>
        <button
            onClick={onClear}
            className="bg-[#2874f0] text-white font-semibold px-8 py-2.5 rounded text-sm hover:bg-[#1a5ec8] transition-colors"
        >
            Clear Filters
        </button>
    </div>
);

/* ─── Main component ──────────────────────────────────────────────── */
const SearchResults = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { filteredProducts, loading, searchQuery, selectedCategory, filters } = useSelector(
        state => state.products
    );

    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    /* ── Sync URL params ── */
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const urlSearch = params.get('q') || params.get('search') || '';
        const urlCategory = params.get('category') || '';

        if (urlSearch) dispatch(setSearchQuery(urlSearch));
        if (urlCategory) dispatch(setSelectedCategory(urlCategory));
        dispatch(filterProducts());
    }, [location.search, dispatch]);

    /* ── Fetch data on mount ── */
    useEffect(() => {
        const fetchAll = async () => {
            try {
                dispatch(setLoading(true));
                
                // Get URL params for targeted fetch
                const params = new URLSearchParams(location.search);
                const urlSearch = params.get('q') || params.get('search') || '';
                const urlCategory = params.get('category') || '';

                const [productData, categoryData] = await Promise.all([
                    getProducts(urlSearch, urlCategory), // Use params here!
                    getCategories(),
                ]);
                
                dispatch(setProducts(productData));
                dispatch(setCategories(categoryData));

                // Sync Redux state
                if (urlSearch) dispatch(setSearchQuery(urlSearch));
                if (urlCategory) dispatch(setSelectedCategory(urlCategory));
                dispatch(filterProducts());
            } catch (err) {
                console.error('SearchResults fetch error:', err);
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchAll();
    }, [location.search]); // Update when URL changes

    const handleClearAll = () => {
        dispatch(clearFilters());
        dispatch(filterProducts());
        navigate('/');
    };

    const activeFiltersCount = [
        filters.rating > 0,
        filters.minDiscount > 0,
        filters.brands.length > 0,
        filters.minPrice > 0 || filters.maxPrice < 200000,
    ].filter(Boolean).length;

    /* ── Breadcrumb label ── */
    const breadcrumbLabel = searchQuery
        ? `Search results for "${searchQuery}"`
        : selectedCategory
            ? selectedCategory
            : 'All Products';

    return (
        <div style={{ backgroundColor: '#f1f3f6', minHeight: '100vh', paddingBottom: '40px' }}>
            <div className="max-w-screen-xl mx-auto px-4 pt-3">

                {/* ── Breadcrumb ── */}
                <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                    <button onClick={() => navigate('/')} className="hover:text-[#2874f0] transition-colors">
                        Home
                    </button>
                    <ChevronRight size={12} />
                    {selectedCategory && (
                        <>
                            <button
                                onClick={() => navigate(`/search?category=${selectedCategory}`)}
                                className="hover:text-[#2874f0] transition-colors"
                            >
                                {selectedCategory}
                            </button>
                            <ChevronRight size={12} />
                        </>
                    )}
                    {searchQuery && (
                        <span className="text-[#212121] font-medium truncate max-w-[300px]">
                            "{searchQuery}"
                        </span>
                    )}
                </nav>

                <div className="flex gap-3 items-start">

                    {/* ── Left Sidebar ── */}
                    <div className="hidden md:block w-[260px] flex-shrink-0 sticky top-[152px]">
                        <FilterSidebar isOpen={false} onClose={() => { }} />
                    </div>

                    {/* ── Mobile Sidebar drawer ── */}
                    <div className="md:hidden">
                        <FilterSidebar
                            isOpen={isMobileFilterOpen}
                            onClose={() => setIsMobileFilterOpen(false)}
                        />
                    </div>

                    {/* ── Right Column ── */}
                    <div className="flex-1 min-w-0">

                        {/* Card wrapper (Removed overflow-hidden to allow dropdowns to show) */}
                        <div className="bg-white rounded-sm shadow-sm" style={{ minHeight: '80vh' }}>

                            {/* Sort Bar */}
                            <SortBar />

                            {/* Top Filters Bar */}
                            <TopFilters onOpenMobileFilter={() => setIsMobileFilterOpen(true)} />

                            {/* Results header */}
                            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-base font-semibold text-[#212121]">
                                        {breadcrumbLabel}
                                    </h1>
                                    {!loading && (
                                        <span className="text-xs text-gray-400">
                                            ({filteredProducts.length.toLocaleString()} products found)
                                        </span>
                                    )}
                                </div>
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={handleClearAll}
                                        className="text-xs text-[#2874f0] font-semibold hover:underline hidden sm:block"
                                    >
                                        Clear All Filters
                                    </button>
                                )}
                            </div>

                            {/* Active filter pills */}
                            {activeFiltersCount > 0 && (
                                <div className="px-4 py-2 flex flex-wrap gap-1.5 border-b border-gray-100">
                                    {filters.rating > 0 && (
                                        <FilterPill
                                            label={`${filters.rating}★ & above`}
                                            onRemove={() => { dispatch(setFilters({ rating: 0 })); dispatch(filterProducts()); }}
                                        />
                                    )}
                                    {filters.minDiscount > 0 && (
                                        <FilterPill
                                            label={`${filters.minDiscount}% or more off`}
                                            onRemove={() => { dispatch(setFilters({ minDiscount: 0 })); dispatch(filterProducts()); }}
                                        />
                                    )}
                                    {filters.brands.map(brand => (
                                        <FilterPill
                                            key={brand}
                                            label={brand}
                                            onRemove={() => {
                                                dispatch(setFilters({ brands: filters.brands.filter(b => b !== brand) }));
                                                dispatch(filterProducts());
                                            }}
                                        />
                                    ))}
                                    {(filters.minPrice > 0 || filters.maxPrice < 200000) && (
                                        <FilterPill
                                            label={`₹${filters.minPrice.toLocaleString('en-IN')} – ₹${filters.maxPrice.toLocaleString('en-IN')}`}
                                            onRemove={() => { dispatch(setFilters({ minPrice: 0, maxPrice: 200000 })); dispatch(filterProducts()); }}
                                        />
                                    )}
                                </div>
                            )}

                            {/* Product Grid */}
                            <div className="p-3">
                                {loading ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                                        {Array.from({ length: 20 }).map((_, i) => <SkeletonCard key={i} />)}
                                    </div>
                                ) : filteredProducts.length === 0 ? (
                                    <NoResults query={searchQuery || selectedCategory || 'items'} onClear={handleClearAll} />
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                                        {filteredProducts.map(product => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── Filter pill ─────────────────────────────────────────────────── */
const FilterPill = ({ label, onRemove }) => (
    <span className="flex items-center gap-1.5 bg-[#e8f0fe] text-[#2874f0] text-xs font-medium px-2.5 py-1 rounded-full">
        {label}
        <button
            onClick={onRemove}
            className="hover:bg-[#c5d8ff] rounded-full p-0.5 transition-colors"
        >
            <svg width="9" height="9" viewBox="0 0 12 12" fill="currentColor">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        </button>
    </span>
);

export default SearchResults;