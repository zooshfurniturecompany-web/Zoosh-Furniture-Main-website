"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Send,
  Truck,
  ShieldCheck,
  Ruler,
  Layers
} from "lucide-react";
import ProductCard from "@/components/product/product-card";
import QuickViewModal from "@/components/product/quick-view-modal";
import CategoryCardSlider from "@/components/home/category-card-slider";
import { useProducts, getCategories, Product, getGeneralWhatsAppLink } from "@/hooks/use-products";

const valueProps = [
  {
    icon: <Truck size={22} className="stroke-[1.3] text-neutral-900" />,
    title: "White-Glove Insured Delivery",
    desc: "Direct door-to-door transit from our Pattambi factory to homes across all Indian states.",
  },
  {
    icon: <Layers size={22} className="stroke-[1.3] text-neutral-900" />,
    title: "100% Solid Hardwoods",
    desc: "Seasoned Kerala Teak, imported Ash, and rich Mahogany with zero particle boards.",
  },
  {
    icon: <Ruler size={22} className="stroke-[1.3] text-neutral-900" />,
    title: "Bespoke Custom Sizing",
    desc: "Every single unit is fabricated to order matching your room blueprints and exact dimensions.",
  },
  {
    icon: <ShieldCheck size={22} className="stroke-[1.3] text-neutral-900" />,
    title: "5-Year Structural Frame Warranty",
    desc: "Engineered with reinforced mortise-and-tenon structural joints built to last generations.",
  },
];

const completedProjects = [
  {
    title: "Ajmal Residence",
    image: "/images/catalog/page_14_img_00.webp",
    category: "Residential Living Space"
  },
  {
    title: "Rajesh Menon Residence",
    image: "/images/catalog/page_32_img_00.webp",
    category: "Solid Teak Dining Suite"
  },
  {
    title: "Akhil Residence",
    image: "/images/catalog/page_29_img_00.webp",
    category: "Sculptural Lounge Suite"
  },
  {
    title: "Sufaina Residence",
    image: "/images/catalog/page_44_img_00.webp",
    category: "Dining & Monolithic Benches"
  },
  {
    title: "Sanjeevan Residence",
    image: "/images/catalog/page_35_img_00.webp",
    category: "Cane Back Bedroom Sanctuary"
  },
  {
    title: "Brown Barrel Cafe",
    image: "/images/catalog/page_51_img_01.webp",
    category: "Hospitality Bespoke Fitout"
  }
];

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const allProducts = useProducts();
  const categories = ["All", ...getCategories()];
  const [activeTab, setActiveTab] = useState("All");

  const filteredProducts = allProducts.filter(
    (product) => activeTab === "All" || product.category === activeTab
  );

  const customEnquiryLink = getGeneralWhatsAppLink("custom");

  return (
    <div className="overflow-hidden bg-white">
      
      {/* 01. HERO BANNER (Mobile-First Minimal Architecture) */}
      <section 
        className="relative min-h-[75vh] sm:min-h-[85vh] md:min-h-[calc(100vh-102px)] w-full flex items-center justify-start bg-neutral-950 overflow-hidden select-none py-12 sm:py-20"
      >
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="ZOOSH handcrafted solid wood furniture"
            fill
            priority
            unoptimized
            quality={100}
            sizes="100vw"
            style={{ objectPosition: "center 65%" }}
            className="object-cover"
          />
          {/* Subtle cinematic gradient preserving legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full flex items-center justify-start">
          <div className="max-w-[620px] w-full text-left flex flex-col items-start">
            
            <div className="mb-3 sm:mb-4">
              <span className="text-[9px] sm:text-[10.5px] tracking-[0.3em] uppercase text-neutral-300 font-sans font-medium px-2.5 py-1 bg-white/10 backdrop-blur-xs border border-white/20">
                Bespoke Hardwood Architecture
              </span>
            </div>

            <h1 className="font-serif text-[clamp(28px,6.5vw,60px)] font-light tracking-wide leading-[1.1] text-white mb-4 sm:mb-5">
              Every Home Deserves Furniture Built Specifically For It.
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-neutral-200 font-sans font-light tracking-wide mb-6 sm:mb-8 leading-relaxed max-w-lg">
              Crafted in solid Teak, Ash & Mahogany woods, woven cane, and tailored fabrics. Zero ready-made stock—custom manufactured in our Kerala workshop.
            </p>

            {/* Mobile Action Buttons (Full width on small screens) */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link 
                href="/collection" 
                className="inline-flex items-center justify-center bg-white text-black hover:bg-neutral-100 text-xs tracking-[0.2em] uppercase py-3.5 sm:py-4 px-6 sm:px-8 font-medium transition-all min-w-[160px] text-center active:scale-[0.99]"
              >
                Explore Catalog
              </Link>
              <Link 
                href="/custom" 
                className="inline-flex items-center justify-center border border-white text-white hover:bg-white hover:text-black text-xs tracking-[0.2em] uppercase py-3.5 sm:py-4 px-6 sm:px-8 font-medium transition-all min-w-[160px] text-center active:scale-[0.99]"
              >
                Custom Blueprint
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 02. CATEGORY CARD SLIDER (Shop By Space) */}
      <CategoryCardSlider />

      {/* 03. SIGNATURE COLLECTION (Clean 2-Column Mobile Grid) */}
      <section className="py-12 sm:py-20 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-10 pb-3 border-b border-neutral-100 gap-3">
            <div>
              <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-semibold block mb-1">
                Curated Designs
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light tracking-wide text-neutral-900">
                Signature Collection
              </h2>
            </div>
            
            {/* Category Filter Pills (Horizontal Touch Scroll) */}
            <div className="flex items-center overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0 space-x-1.5 scroll-smooth">
              {categories.map((category) => {
                const isActive = activeTab === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveTab(category)}
                    className={`text-[9px] sm:text-[10px] tracking-wider uppercase py-2 px-3 sm:px-4 transition-all whitespace-nowrap font-medium border ${
                      isActive
                        ? "bg-black text-white border-black"
                        : "bg-transparent text-neutral-500 border-neutral-200 hover:text-black hover:border-black"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2-Column Grid on Mobile, 3-Column on Desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6 md:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>

          {/* View All Link */}
          <div className="pt-8 sm:pt-12 text-center">
            <Link
              href="/collection"
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-semibold text-black border-b border-black pb-1 hover:opacity-70 transition-opacity"
            >
              <span>View Full Catalog &rarr;</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 04. EDITORIAL STORY: THE ARTISANAL WORKSHOP */}
      <section className="py-12 sm:py-20 bg-neutral-50/60 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* Left Story Text */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-semibold block">
                Factory Direct Craftsmanship
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-light tracking-wide text-neutral-900 leading-tight">
                Shaped by time,<br className="hidden sm:inline" /> engineered for life.
              </h2>
              <p className="text-neutral-600 font-sans text-xs sm:text-sm font-light leading-relaxed">
                Founded in Kerala, ZOOSH operates a dedicated manufacturing facility in Pattambi. By managing every stage in-house—from selecting raw Teak logs at licensed timber yards to hand-jointing frames and tailoring custom cushions—we ensure uncompromising quality with zero retail middleman markup.
              </p>
              <p className="text-neutral-600 font-sans text-xs sm:text-sm font-light leading-relaxed">
                We believe that furniture should adapt to the architecture of your home, not the other way around. Every piece is fabricated to order with your choice of solid hardwood, dimensions, and fabric textures.
              </p>
              
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center text-xs tracking-[0.2em] uppercase text-black font-semibold border-b border-black pb-1 hover:pr-2 transition-all"
                >
                  <span>Our Heritage & Workshop</span>
                  <ArrowRight size={12} className="ml-2" />
                </Link>
              </div>
            </div>

            {/* Right Collage Imagery */}
            <div className="lg:col-span-6 grid grid-cols-12 gap-3 sm:gap-4">
              <div className="col-span-8 relative aspect-[4/5] bg-neutral-200 overflow-hidden shadow-xs">
                <Image
                  src="/images/catalog/page_10_img_00.webp"
                  alt="ZOOSH master carpenters crafting dining table"
                  fill
                  sizes="(max-width: 1024px) 65vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="col-span-4 flex flex-col gap-3 sm:gap-4">
                <div className="relative aspect-square bg-neutral-200 overflow-hidden shadow-xs">
                  <Image
                    src="/images/catalog/page_06_img_01.webp"
                    alt="Precision mortise and tenon wood joinery"
                    fill
                    sizes="(max-width: 1024px) 30vw, 20vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[3/4] bg-neutral-200 overflow-hidden shadow-xs">
                  <Image
                    src="/images/catalog/page_02_img_01.webp"
                    alt="Timber seasoning and finishing"
                    fill
                    sizes="(max-width: 1024px) 30vw, 20vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 05. MULTI-COLUMN VALUE PROPOSITIONS */}
      <section className="py-12 sm:py-20 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {valueProps.map((prop, idx) => (
              <div
                key={idx}
                className="flex flex-col items-start space-y-2.5 p-5 sm:p-6 border border-neutral-100 bg-neutral-50/40 hover:border-neutral-200 transition-colors"
              >
                <div className="p-2.5 bg-white border border-neutral-100 rounded-xs mb-1 shadow-xs">
                  {prop.icon}
                </div>
                <h3 className="font-serif text-sm sm:text-base text-neutral-950 font-medium tracking-wide">
                  {prop.title}
                </h3>
                <p className="text-neutral-500 font-sans text-xs font-light leading-relaxed">
                  {prop.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06. SELECTED COMPLETED PROJECTS */}
      <section className="py-12 sm:py-20 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-1.5">
            <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-semibold block">
              Architectural Installations
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light tracking-wide text-neutral-900">
              Completed Spaces
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm font-sans font-light">
              A curated gallery of bespoke furniture installations handcrafted for residences across India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {completedProjects.map((project, idx) => (
              <div key={idx} className="group flex flex-col space-y-2.5">
                <div className="relative aspect-square overflow-hidden bg-neutral-50 border border-neutral-100">
                  <Image
                    src={project.image}
                    alt={`${project.title} - ${project.category}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors duration-500" />
                </div>
                <div className="space-y-0.5 px-0.5">
                  <span className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 font-sans font-medium block">
                    {project.category}
                  </span>
                  <h3 className="font-serif text-sm sm:text-base text-neutral-950 font-medium group-hover:text-neutral-600 transition-colors">
                    {project.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 text-center">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-semibold text-black border-b border-black pb-1 hover:opacity-70 transition-opacity"
            >
              <span>Explore All Completed Projects &rarr;</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 07. ARCHITECTURAL COMMISSION CTA */}
      <section className="relative py-16 sm:py-24 flex items-center justify-center bg-neutral-950 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/catalog/page_10_img_00.webp"
            alt="ZOOSH workshop custom manufacturing"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 md:px-12 text-center text-white space-y-4 sm:space-y-6">
          <span className="text-[9px] sm:text-[10px] tracking-[0.35em] uppercase text-neutral-300 font-sans font-semibold block">
            Custom Commissions
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-light tracking-wide max-w-2xl mx-auto leading-tight">
            Have a blueprint or bespoke design in mind?
          </h2>
          <p className="text-neutral-300 font-sans text-xs sm:text-sm font-light leading-relaxed max-w-lg mx-auto">
            Share your room dimensions, floor plans, or sketches. Our master craftsmen will engineer solid wood furniture tailored specifically for your space.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
            <Link
              href="/custom"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-black hover:bg-neutral-100 text-xs tracking-[0.2em] uppercase py-3.5 sm:py-4 px-8 font-medium transition-all min-w-[180px]"
            >
              Custom Blueprint
            </Link>
            <a
              href={customEnquiryLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white text-white text-xs tracking-[0.2em] uppercase py-3.5 sm:py-4 px-8 hover:bg-white hover:text-black transition-colors font-medium min-w-[180px]"
            >
              <Send size={13} />
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </div>
      </section>

      {/* Quick View Modal Overlay */}
      <QuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
