import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BANNERS = [
  {
    id: 1,
    title: "Big Billion Days",
    subtitle: "The Biggest Sale of the Year",
    discount: "Up to 80% Off",
    cta: "Shop Now",
    image: "https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/9384b37a854c5a96.jpg",
    bgGradient: "linear-gradient(135deg, #2874f0, #1a5ec8)",
    textColor: "#ffffff",
    category: "Electronics"
  },
  {
    id: 2,
    title: "Fashion Wardrobe Reset",
    subtitle: "Summer styles just dropped",
    discount: "Min 50% Off on Top Brands",
    cta: "Explore Styles",
    image: "https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/fddbd1bd0f1e8a93.jpg",
    bgGradient: "linear-gradient(135deg, #e80071, #b30057)",
    textColor: "#ffffff",
    category: "Fashion"
  },
  {
    id: 3,
    title: "Home Upgrades",
    subtitle: "Furniture, appliances and more",
    discount: "No Cost EMI Available",
    cta: "Upgrade Home",
    image: "https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/3b129712f6f43702.jpg",
    bgGradient: "linear-gradient(135deg, #0f9d58, #0b7a44)",
    textColor: "#ffffff",
    category: "Home & Kitchen"
  }
];

const HeroBanner = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 400);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % BANNERS.length);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + BANNERS.length) % BANNERS.length);
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const banner = BANNERS[currentSlide];

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: '280px' }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {BANNERS.map((b, index) => (
          <div
            key={b.id}
            className="absolute inset-0 transition-opacity"
            style={{
              opacity: index === currentSlide ? 1 : 0,
              transition: 'opacity 0.4s ease-in-out',
              background: b.bgGradient
            }}
          >
            <div className="max-w-screen-xl mx-auto px-8 h-full flex items-center justify-between">
              {/* Text Content */}
              <div className="flex flex-col items-start max-w-sm">
                <span
                  className="text-sm font-semibold mb-2 px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffe500' }}
                >
                  Limited Time Deal
                </span>
                <h2
                  className="text-4xl font-black mb-2 leading-tight"
                  style={{ color: b.textColor }}
                >
                  {b.title}
                </h2>
                <p className="text-white text-base mb-2 opacity-90">{b.subtitle}</p>
                <p
                  className="text-xl font-bold mb-5"
                  style={{ color: '#ffe500' }}
                >
                  {b.discount}
                </p>
                <button
                  onClick={() => navigate(`/?search=${encodeURIComponent(b.category)}`)}
                  className="px-7 py-2.5 rounded font-bold text-sm transition-transform hover:scale-105 active:scale-95"
                  style={{ backgroundColor: '#FFE500', color: '#2874f0' }}
                >
                  {b.cta}
                </button>
              </div>

              {/* Image */}
              <div className="hidden sm:block w-64 h-56 relative">
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-full h-full object-cover rounded-lg opacity-90"
                  style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                {/* Overlay shimmer */}
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full w-9 h-9 flex items-center justify-center shadow-md transition-all hover:scale-110 z-10"
      >
        <ChevronLeft size={20} className="text-gray-700" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full w-9 h-9 flex items-center justify-center shadow-md transition-all hover:scale-110 z-10"
      >
        <ChevronRight size={20} className="text-gray-700" />
      </button>

      {/* Dot Navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="rounded-full transition-all"
            style={{
              width: index === currentSlide ? '24px' : '8px',
              height: '8px',
              backgroundColor: index === currentSlide ? '#FFE500' : 'rgba(255,255,255,0.6)'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
