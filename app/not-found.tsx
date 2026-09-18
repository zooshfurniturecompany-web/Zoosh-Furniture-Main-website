"use client";

import Link from "next/link";
import { Home, ArrowLeft, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white px-6 py-24">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 border border-neutral-200 shadow-sm">
          <Sparkles className="w-7 h-7" />
        </div>
        
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] font-sans font-semibold text-neutral-400">
            404 — Page Not Found
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 tracking-tight">
            Furniture Piece Not Found
          </h1>
          <p className="text-sm text-neutral-600 font-sans leading-relaxed pt-2">
            The product or page you are looking for might have been moved, updated, or is currently being handcrafted in our workshop.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-neutral-800 transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/collection"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border border-neutral-300 text-neutral-800 text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Explore Collections
          </Link>
        </div>
      </div>
    </div>
  );
}
