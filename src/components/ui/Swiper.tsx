'use client';

import React, { useState } from 'react';

interface SwiperProps {
  children: React.ReactNode;
  slides?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  className?: string;
}

export const Swiper: React.FC<SwiperProps> = ({
  children,
  slides = 1,
  autoplay = false,
  autoplayDelay = 5000,
  loop = false,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const childrenArray = React.Children.toArray(children);
  const totalSlides = childrenArray.length;

  React.useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev + 1 >= totalSlides) {
          return loop ? 0 : prev;
        }
        return prev + 1;
      });
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, totalSlides, loop]);

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, totalSlides - 1)));
  };

  const nextSlide = () => {
    if (currentIndex + 1 < totalSlides) {
      setCurrentIndex(currentIndex + 1);
    } else if (loop) {
      setCurrentIndex(0);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (loop) {
      setCurrentIndex(totalSlides - 1);
    }
  };

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <div className="flex h-full">
        {childrenArray.map((child, index) => (
          <div
            key={index}
            className={`w-full flex-shrink-0 transition-transform duration-500 ease-out`}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-r-lg transition-colors"
        aria-label="Previous slide"
      >
        ◀
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-l-lg transition-colors"
        aria-label="Next slide"
      >
        ▶
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {childrenArray.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-white w-6' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
