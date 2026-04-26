import { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { processImgUrl } from '../../Utils/helper';

interface IMyGalleryProps {
  show: boolean;
  setShow: () => void;
  slides: string[];
}

const MyGallery = ({ show, setShow, slides }: IMyGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoSlide, setAutoSlide] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  // Auto-slide interval
  useEffect(() => {
    if (!autoSlide) return;
    const interval = setInterval(goToNext, 4000);
    return () => clearInterval(interval);
  }, [autoSlide, goToNext]);

  // Keyboard navigation
  useEffect(() => {
    if (!show) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'Escape') setShow();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [show, goToNext, goToPrevious, setShow]);

  // Lock body scroll
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/95"
      onClick={(e) => { if (e.target === e.currentTarget) setShow(); }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 shrink-0">
        <span className="text-white/60 text-sm font-medium">
          {currentIndex + 1} / {slides.length}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoSlide((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white text-xs font-medium"
          >
            {autoSlide ? (
              <><Pause className="w-3.5 h-3.5" /> Pause</>
            ) : (
              <><Play className="w-3.5 h-3.5" /> Autoplay</>
            )}
          </button>
          <button
            onClick={setShow}
            aria-label="Close gallery"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main image */}
      <div className="flex-1 flex items-center justify-center relative px-4 min-h-0">
        <button
          onClick={goToPrevious}
          aria-label="Previous image"
          className="absolute left-4 md:left-8 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 transition-colors text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <img
          key={currentIndex}
          src={processImgUrl(slides[currentIndex])}
          alt={`Product image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain rounded-lg select-none"
          style={{ maxHeight: 'calc(100vh - 220px)' }}
        />

        <button
          onClick={goToNext}
          aria-label="Next image"
          className="absolute right-4 md:right-8 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 transition-colors text-white"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="shrink-0 px-4 py-4">
        <div className="flex flex-row gap-2 overflow-x-auto justify-center pb-1 scrollbar-hide">
          {slides.map((slide, index) => (
            <button
              key={`${slide}${index}`}
              onClick={() => setCurrentIndex(index)}
              className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentIndex
                  ? 'border-orange-500 scale-105'
                  : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <img
                src={processImgUrl(slide)}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'w-5 h-1.5 bg-orange-500'
                  : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyGallery;