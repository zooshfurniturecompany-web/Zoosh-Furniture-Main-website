"use client";

import Image from "next/image";
import { X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product, getWhatsAppLink } from "@/hooks/use-products";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  if (!product) return null;

  const whatsappUrl = getWhatsAppLink(product.name, product.sku);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/55 backdrop-blur-md"
        />

        {/* Modal content box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-4xl bg-white shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-black hover:text-neutral-500 transition-colors z-20 bg-white/80 backdrop-blur-sm p-1.5 rounded-full"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Left: Product Image */}
          <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto md:h-[550px] bg-neutral-100">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              unoptimized={product.images[0]?.startsWith("data:") || product.images[0]?.startsWith("http")}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Right: Product details */}
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-between overflow-y-auto max-h-[45vh] md:max-h-[550px]">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-sans block mb-1">
                  {product.category}
                </span>
                <h2 className="font-serif text-2xl md:text-3xl text-neutral-900 leading-tight">
                  {product.name}
                </h2>
                <p className="text-[10px] tracking-wider text-neutral-400 font-sans mt-1">
                  SKU: {product.sku}
                </p>
                {product.price && product.price > 0 && (
                  <div className="pt-2">
                    <span className="font-serif text-2xl md:text-3xl font-bold text-neutral-950 block">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[9px] text-neutral-400 font-sans block mt-0.5">
                      Excl. GST & Taxes | Made to Order
                    </span>
                  </div>
                )}
              </div>

              <p className="text-neutral-500 text-xs md:text-sm font-sans font-light leading-relaxed">
                {product.description}
              </p>

              {/* Specifications snippet */}
              <div className="border-t border-b border-neutral-100 py-4 space-y-2.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span className="font-sans font-medium text-neutral-400">Dimensions</span>
                  <span className="font-sans font-light">{product.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans font-medium text-neutral-400">Material</span>
                  <span className="font-sans font-light">{product.material}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans font-medium text-neutral-400">Finish</span>
                  <span className="font-sans font-light">{product.finish}</span>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-6">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-3 bg-black text-white hover:bg-neutral-900 text-xs tracking-[0.2em] uppercase py-4 transition-colors font-light shadow-sm"
              >
                <Send size={14} className="animate-pulse" />
                <span>Enquire on WhatsApp</span>
              </a>
              <p className="text-center text-[10px] text-neutral-400 mt-3 font-light">
                Secure enquiry load-balanced via WhatsApp support
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
