'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '../lib/LanguageContext';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react';

export interface ViewerImage {
  url: string;
  title?: string;
  caption?: string;
}

interface ImageViewerProps {
  isOpen: boolean;
  images: ViewerImage[];
  currentIndex: number;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  isOpen,
  images,
  currentIndex,
  onClose,
  onIndexChange,
}) => {
  const { tr } = useLanguage();
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setZoom(1);
  }, [currentIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && images.length > 1) handleNext();
      if (e.key === 'ArrowLeft' && images.length > 1) handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    // Body scrollni to'xtatish
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (onIndexChange) {
      onIndexChange((currentIndex + 1) % images.length);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (onIndexChange) {
      onIndexChange((currentIndex - 1 + images.length) % images.length);
    }
  };

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((prev) => (prev === 1 ? 1.5 : 1));
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200 select-none"
    >
      {/* Top Bar Controls */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between text-white z-20 bg-gradient-to-b from-black/60 to-transparent"
      >
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md border border-white/15">
            {currentIndex + 1} / {images.length}
          </span>
          {currentImage.title && (
            <h4 className="text-sm font-semibold truncate max-w-xs sm:max-w-md text-white/90">
              {currentImage.title}
            </h4>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom toggle */}
          <button
            onClick={toggleZoom}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white"
            title={tr("Kattalashtirish")}
          >
            {zoom === 1 ? <ZoomIn className="w-5 h-5" /> : <ZoomOut className="w-5 h-5" />}
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/15 hover:bg-red-600 active:scale-95 transition-all text-white"
            title={tr("Yopish (Esc)")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigatsiya chap/o'ng tugmalari */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 active:scale-90 text-white backdrop-blur-md border border-white/15 transition-all z-20"
            aria-label={tr("Oldingi rasm")}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 active:scale-90 text-white backdrop-blur-md border border-white/15 transition-all z-20"
            aria-label={tr("Keyingi rasm")}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Rasm konteyneri */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl max-h-[82vh] p-2 sm:p-4 flex flex-col items-center justify-center"
      >
        <img loading="lazy" decoding="async"
          src={currentImage.url}
          alt={currentImage.title || 'Preview'}
          style={{ transform: `scale(${zoom})` }}
          className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl transition-transform duration-300 cursor-zoom-in"
          onClick={toggleZoom}
        />

        {currentImage.caption && (
          <p className="mt-4 text-xs sm:text-sm text-center text-slate-300 max-w-2xl px-4">
            {currentImage.caption}
          </p>
        )}
      </div>
    </div>
  );
};
