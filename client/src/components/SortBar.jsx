import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSortBy, filterProducts } from '../redux/productSlice';

const SORT_OPTIONS = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'popularity', label: 'Popularity' },
    { value: 'price_asc', label: 'Price — Low to High' },
    { value: 'price_desc', label: 'Price — High to Low' },
    { value: 'rating', label: 'Rating' },
    { value: 'newest', label: 'Newest First' },
    { value: 'discount', label: 'Discount' },
];

const SortBar = () => {
    const dispatch = useDispatch();
    const sortBy = useSelector(state => state.products.sortBy);
    const count = useSelector(state => state.products.filteredProducts.length);

    const handleSort = (value) => {
        dispatch(setSortBy(value));
        dispatch(filterProducts());
    };

    return (
        <div className="bg-white border-b border-gray-100 flex items-center overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            <span className="text-[13px] font-semibold text-gray-600 px-4 py-3.5 shrink-0 border-r border-gray-100 whitespace-nowrap">
                Sort By
            </span>
            <div className="flex items-center overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                {SORT_OPTIONS.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => handleSort(opt.value)}
                        className={`relative text-[13px] px-4 py-3.5 whitespace-nowrap transition-colors shrink-0 ${sortBy === opt.value
                                ? 'text-[#2874f0] font-semibold'
                                : 'text-[#212121] hover:text-[#2874f0]'
                            }`}
                    >
                        {opt.label}
                        {sortBy === opt.value && (
                            <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2874f0] rounded-t-sm" />
                        )}
                    </button>
                ))}
            </div>
            {count > 0 && (
                <span className="ml-auto shrink-0 text-xs text-gray-400 px-4 whitespace-nowrap hidden sm:block">
                    {count.toLocaleString()} results
                </span>
            )}
        </div>
    );
};

export default SortBar;