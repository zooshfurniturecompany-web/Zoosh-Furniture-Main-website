"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center space-x-2 text-[10px] tracking-[0.25em] uppercase text-neutral-400 hover:text-black transition-colors py-2 font-sans font-light"
      title="Copy page link to share"
    >
      {copied ? (
        <>
          <Check size={12} className="text-green-600" />
          <span className="text-green-600">Link Copied</span>
        </>
      ) : (
        <>
          <Share2 size={12} />
          <span>Share Piece</span>
        </>
      )}
    </button>
  );
}
