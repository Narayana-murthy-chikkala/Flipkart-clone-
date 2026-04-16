import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './Carousel.css';

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="carousel placeholder">No images available</div>;
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="carousel">
      <div className="carousel-container">
        <img
          src={images[currentIndex]}
          alt="Product"
          className="carousel-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
          }}
        />
        
        {images.length > 1 && (
          <>
            <button
              className="carousel-btn prev-btn"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              className="carousel-btn next-btn"
              onClick={goToNext}
              aria-label="Next image"
            >
              <FiChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Image indicators */}
      {images.length > 1 && (
        <div className="carousel-indicators">
          {images.map((_, index) => (
            <div
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
