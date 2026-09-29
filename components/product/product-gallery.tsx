"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenIdx, setFullscreenIdx] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square w-full bg-neutral-100 flex items-center justify-center text-neutral-400 font-light font-sans text-xs">
        No images available
      </div>
    );
  }

  const handlePrev = () => {
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const openFullscreen = () => {
    setFullscreenIdx(activeIdx);
    setIsFullscreen(true);
  };

  return (
    <div className="w-full space-y-3 select-none">
      {/* Main Viewport (Aspect Square 1:1) */}
      <div className="relative aspect-square w-full bg-neutral-100 overflow-hidden border border-neutral-100 group">
        
        {/* Swipeable / Animated Image Container */}
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x > 40) {
                handlePrev();
              } else if (info.offset.x < -40) {
                handleNext();
              }
            }}
          >
            <Image
              src={images[activeIdx]}
              alt={`Product view ${activeIdx + 1}`}
              fill
              priority={activeIdx === 0}
              unoptimized={images[activeIdx]?.startsWith("data:") || images[activeIdx]?.startsWith("http")}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
              className="object-cover object-center pointer-events-none"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows (visible on hover / desktop & mobile tap) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-800 hover:text-black hover:bg-white transition-all shadow-sm opacity-80 sm:opacity-0 group-hover:opacity-100 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-800 hover:text-black hover:bg-white transition-all shadow-sm opacity-80 sm:opacity-0 group-hover:opacity-100 z-10"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Fullscreen Button */}
        <button
          type="button"
          onClick={openFullscreen}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-700 hover:text-black transition-colors shadow-xs z-10"
          aria-label="View fullscreen image"
        >
          <Maximize2 size={14} />
        </button>

        {/* Mobile Slide Indicator Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-10 sm:hidden">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  activeIdx === idx ? "w-6 bg-black" : "w-1.5 bg-black/30"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop & Tablet Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`relative w-16 sm:w-20 aspect-square flex-shrink-0 bg-neutral-100 overflow-hidden border transition-all ${
                activeIdx === idx ? "border-black shadow-xs ring-1 ring-black" : "border-neutral-200 opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                unoptimized={img.startsWith("data:") || img.startsWith("http")}
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md select-none"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="absolute top-5 right-5 text-white/80 hover:text-white p-3 z-10 bg-white/10 rounded-full hover:bg-white/20"
              aria-label="Close fullscreen"
            >
              <X size={22} />
            </button>

            {/* Left Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFullscreenIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
              }}
              className="absolute left-4 sm:left-8 text-white/70 hover:text-white p-3 bg-white/10 rounded-full z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={26} />
            </button>

            {/* Image Viewport */}
            <div
              className="relative w-full max-w-5xl h-[85vh] flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[fullscreenIdx]}
                alt={`Fullscreen view ${fullscreenIdx + 1}`}
                className="max-w-full max-h-[85vh] object-contain shadow-2xl"
              />
            </div>

            {/* Right Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFullscreenIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
              }}
              className="absolute right-4 sm:right-8 text-white/70 hover:text-white p-3 bg-white/10 rounded-full z-10"
              aria-label="Next image"
            >
              <ChevronRight size={26} />
            </button>

            {/* Counter */}
            <div className="absolute bottom-6 text-white/50 text-xs tracking-widest font-mono">
              {fullscreenIdx + 1} / {images.length}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
