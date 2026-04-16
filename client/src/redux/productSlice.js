import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  filteredProducts: [],
  searchQuery: '',
  selectedCategory: null,
  categories: [],
  sortBy: 'relevance',
  filters: {
    minPrice: 0,
    maxPrice: 200000,
    brands: [],
    rating: 0,
    minDiscount: 0,
  },
  loading: false,
  error: null
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setProducts: (state, action) => {
      state.products = action.payload;
      state.filteredProducts = action.payload;
    },

    setCategories: (state, action) => {
      state.categories = action.payload;
    },

    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },

    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },

    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.searchQuery = '';
      state.selectedCategory = null;
      state.sortBy = 'relevance';
    },

    filterProducts: (state) => {
      let filtered = [...state.products];

      // 1. Category Filter
      if (state.selectedCategory) {
        filtered = filtered.filter(p => 
          p.category && p.category.toLowerCase() === state.selectedCategory.toLowerCase()
        );
      }

      // 2. Search Query Filter
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(query) ||
          (p.description && p.description.toLowerCase().includes(query)) ||
          (p.category && p.category.toLowerCase().includes(query))
        );
      }

      // 3. Price Filter
      filtered = filtered.filter(p =>
        p.price >= state.filters.minPrice && p.price <= state.filters.maxPrice
      );

      // 4. Brand Filter
      if (state.filters.brands.length > 0) {
        filtered = filtered.filter(p => {
          const nameLower = p.name.toLowerCase();
          return state.filters.brands.some(brand => nameLower.includes(brand.toLowerCase()));
        });
      }

      // 5. Rating Filter
      if (state.filters.rating > 0) {
        filtered = filtered.filter(p => (p.rating || 0) >= state.filters.rating);
      }

      // 6. Discount Filter
      if (state.filters.minDiscount > 0) {
        filtered = filtered.filter(p => (p.discount || 0) >= state.filters.minDiscount);
      }

      // 7. Sort
      switch (state.sortBy) {
        case 'price_asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          filtered.sort((a, b) => b.id - a.id);
          break;
        case 'rating':
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'popularity':
          filtered.sort((a, b) => b.id - a.id); // Placeholder for real popularity
          break;
        case 'discount':
          filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
          break;
        default:
          // relevance — keep original order
          break;
      }

      state.filteredProducts = filtered;
    },

    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const {
  setLoading,
  setProducts,
  setCategories,
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
  setFilters,
  clearFilters,
  filterProducts,
  setError
} = productSlice.actions;

export default productSlice.reducer;