"use client";

import Image from "next/image";
import { useState, useRef, MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenIdx, setFullscreenIdx] = useState(0);

  const openFullscreen = () => {
    setFullscreenIdx(activeIdx);
    setIsFullscreen(true);
  };

  const handlePrevFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFullscreenIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFullscreenIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[4/5] w-full bg-neutral-100 flex items-center justify-center text-neutral-400 font-light font-sans text-xs">
        No images available
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
        {/* Thumbnails list */}
        {images.length > 1 && (
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-x-visible no-scrollbar max-h-[500px] md:w-20 w-full">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`relative w-16 md:w-20 aspect-square flex-shrink-0 bg-neutral-50 overflow-hidden border transition-all duration-300 ${
                  activeIdx === idx ? "border-black shadow-sm" : "border-neutral-200 hover:border-neutral-400"
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail view ${idx + 1}`}
                  fill
                  unoptimized={img.startsWith("data:") || img.startsWith("http")}
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main active image viewport (1:1 square ratio) */}
        <div
          className="relative flex-grow aspect-square bg-neutral-50 overflow-hidden border border-neutral-100 group"
        >
          <Image
            src={images[activeIdx]}
            alt="Active product view"
            fill
            priority
            unoptimized={images[activeIdx]?.startsWith("data:") || images[activeIdx]?.startsWith("http")}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            className="object-cover"
          />

          {/* Fullscreen Trigger Overlay */}
          <button
            onClick={openFullscreen}
            className="absolute top-4 right-4 bg-white/80 hover:bg-black hover:text-white backdrop-blur-sm p-2.5 transition-all duration-300 text-neutral-600 shadow-sm opacity-0 group-hover:opacity-100"
            aria-label="View Fullscreen"
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md select-none"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Close button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 z-10 bg-white/10 rounded-full hover:bg-white/20"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Left arrow */}
            <button
              onClick={handlePrevFullscreen}
              className="absolute left-6 text-white/50 hover:text-white transition-colors p-3 bg-white/5 rounded-full hover:bg-white/10 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Active image view */}
            <div
              className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[fullscreenIdx]}
                alt={`Fullscreen product view ${fullscreenIdx + 1}`}
                className="max-w-full max-h-[80vh] object-contain shadow-2xl transition-all duration-500"
              />
            </div>

            {/* Right arrow */}
            <button
              onClick={handleNextFullscreen}
              className="absolute right-6 text-white/50 hover:text-white transition-colors p-3 bg-white/5 rounded-full hover:bg-white/10 z-10"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>

            {/* Index indicator */}
            <div className="absolute bottom-6 text-white/40 text-[10px] tracking-[0.2em] uppercase font-sans">
              {fullscreenIdx + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
