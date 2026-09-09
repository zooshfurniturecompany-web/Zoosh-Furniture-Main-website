"use client";

import { MessageCircle, Phone } from "lucide-react";
import { getGeneralWhatsAppLink } from "@/hooks/use-products";

export default function FloatingContact() {
  const whatsappUrl = getGeneralWhatsAppLink();
  const phoneNumber = "tel:+919567193992";

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-3">
      {/* WhatsApp Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </a>

      {/* Call Floating Button */}
      <a
        href={phoneNumber}
        aria-label="Call ZOOSH"
        className="w-12 h-12 rounded-full bg-[#F59E0B] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300"
      >
        <Phone size={20} className="fill-white" />
      </a>
    </div>
  );
}
