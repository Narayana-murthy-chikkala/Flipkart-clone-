import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import './SearchBar.css';

const SearchBar = ({ onSearch, categories, selectedCategory, onCategoryChange }) => {
  const [query, setQuery] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="filter-bar">
      <div className="filter-inner">

        {/* Inline search input */}
        <form className="filter-search" onSubmit={handleSubmit}>
          <FiSearch size={15} className="fsearch-icon" />
          <input
            type="text"
            placeholder="Search products…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="filter-input"
          />
          {query && (
            <button type="button" className="fclear-btn" onClick={handleClear}>
              <FiX size={14} />
            </button>
          )}
          <button type="submit" className="fsubmit-btn">Search</button>
        </form>

        {/* Divider */}
        {categories.length > 0 && <span className="filter-divider" />}

        {/* Category chips */}
        {categories.length > 0 && (
          <div className="chip-row">
            <button
              className={`chip ${selectedCategory === null ? 'active' : ''}`}
              onClick={() => onCategoryChange(null)}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => onCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;