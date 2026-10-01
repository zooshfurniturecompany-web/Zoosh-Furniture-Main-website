"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, Send, ShoppingBag } from "lucide-react";
import { useCart } from "./cart-context";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, totalCount } = useCart();

  const freeShippingThreshold = 50000;
  const progress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  // Generate customized WhatsApp Order message
  const whatsappItemsText = items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name} (SKU: ${item.product.sku}) - Qty: ${item.quantity} - ₹${((item.product.price || 40000) * item.quantity).toLocaleString("en-IN")}`
    )
    .join("\n");

  const whatsappCheckoutMsg = `Hello ZOOSH,

I would like to place an order for the items in my shopping bag:

${whatsappItemsText}

Subtotal: ₹${subtotal.toLocaleString("en-IN")}

Please confirm delivery timeline and payment details.

Thank you.`;

  const dynamicWhatsAppUrl = `https://wa.me/919567193992?text=${encodeURIComponent(whatsappCheckoutMsg)}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="font-serif text-base sm:text-lg font-normal text-neutral-900 uppercase tracking-wider">
                  Shopping Bag
                </h3>
                <span className="text-xs font-mono text-neutral-400">({totalCount})</span>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="w-10 h-10 -mr-2 flex items-center justify-center text-neutral-500 hover:text-black transition-colors rounded-full active:bg-neutral-100"
                aria-label="Close bag"
              >
                <X size={18} />
              </button>
            </div>

            {/* Free Shipping Progress Bar */}
            <div className="px-4 sm:px-5 py-2.5 bg-neutral-50 border-b border-neutral-100 text-xs font-sans text-neutral-600">
              <p className="mb-1 font-light text-[11px] sm:text-xs">
                {subtotal >= freeShippingThreshold ? (
                  <span className="text-emerald-700 font-medium">✓ You qualify for Free PAN India Shipping</span>
                ) : (
                  <span>Add <strong>₹{(freeShippingThreshold - subtotal).toLocaleString("en-IN")}</strong> more for Free Shipping</span>
                )}
              </p>
              <div className="w-full bg-neutral-200 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-black h-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {items.length > 0 ? (
                items.map((item) => {
                  const itemPrice = item.product.price || 40000;
                  const itemTotal = itemPrice * item.quantity;
                  const itemImg = item.product.images[0] || "/images/products/sf001-1.jpg";

                  return (
                    <div key={item.product.id} className="flex gap-3.5 pb-4 border-b border-neutral-100 items-start">
                      {/* Image Thumbnail */}
                      <div className="w-20 h-20 aspect-square bg-neutral-100 flex-shrink-0 overflow-hidden relative border border-neutral-100">
                        <Image
                          src={itemImg}
                          alt={item.product.name}
                          fill
                          unoptimized={itemImg.startsWith("data:") || itemImg.startsWith("http")}
                          className="object-cover"
                        />
                      </div>

                      {/* Info & Stepper */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-sans text-xs sm:text-sm font-medium text-neutral-900 line-clamp-1 pr-2">
                            <Link href={`/products/${item.product.slug}`} onClick={closeCart}>
                              {item.product.name}
                            </Link>
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeItem(item.product.id)}
                            className="text-neutral-400 hover:text-red-600 p-0.5"
                            aria-label="Remove item"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <p className="text-[9px] sm:text-[10px] text-neutral-400 font-sans tracking-wide uppercase truncate">
                          {item.selectedWood || item.product.material}
                        </p>

                        <div className="pt-2 flex items-center justify-between">
                          {/* Touch Quantity Stepper */}
                          <div className="inline-flex items-center border border-neutral-200">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-black active:bg-neutral-100"
                              aria-label="Decrease"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="w-7 text-center text-xs font-mono select-none">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-black active:bg-neutral-100"
                              aria-label="Increase"
                            >
                              <Plus size={11} />
                            </button>
                          </div>

                          {/* Item Price */}
                          <span className="text-xs sm:text-sm font-bold text-neutral-950 font-sans tabular-nums">
                            ₹{itemTotal.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-16 text-center space-y-3">
                  <ShoppingBag size={36} className="mx-auto text-neutral-300 stroke-[1.2]" />
                  <p className="font-sans text-xs text-neutral-400 font-light">Your shopping bag is currently empty.</p>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="inline-block text-[11px] font-sans tracking-widest uppercase font-semibold border-b border-black pb-0.5"
                  >
                    Browse Collections
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Sticky Action Block */}
            {items.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-neutral-100 bg-white space-y-3.5 shadow-lg">
                <div className="flex items-center justify-between font-sans text-sm">
                  <span className="text-neutral-500 font-light uppercase tracking-wider text-xs">Estimated Total</span>
                  <span className="font-bold text-neutral-950 text-base sm:text-lg tabular-nums">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 font-sans font-light">
                  Tax included • Free PAN India Shipping
                </p>

                <div className="space-y-2">
                  <a
                    href={dynamicWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-black hover:bg-neutral-900 active:scale-[0.99] text-white text-xs font-sans tracking-[0.2em] uppercase py-3.5 sm:py-4 font-medium transition-colors shadow-xs"
                  >
                    <Send size={13} />
                    <span>Confirm Order on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={closeCart}
                    className="w-full text-center text-[10px] font-sans uppercase tracking-widest text-neutral-500 hover:text-black py-1"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
