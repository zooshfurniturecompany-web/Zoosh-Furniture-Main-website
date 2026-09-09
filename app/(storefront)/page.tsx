"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Star, 
  PenTool, 
  Layers, 
  Sparkles, 
  Send,
  Award,
  Shield,
  Hammer,
  Activity,
  Compass,
  FileText
} from "lucide-react";
import Button from "@/components/ui/button";
import ProductCard from "@/components/product/product-card";
import QuickViewModal from "@/components/product/quick-view-modal";
import { getAllProducts, getCategories, Product, getGeneralWhatsAppLink } from "@/hooks/use-products";

// Static primary category spaces
const spaces = [
  { 
    name: "Living Space", 
    slug: "living", 
    image: "/images/catalog/page_14_img_00.webp",
    desc: "Custom sofas, accent lounge chairs, and side tables engineered for modern apartments." 
  },
  { 
    name: "Dining & Seating", 
    slug: "dining", 
    image: "/images/catalog/page_21_img_00.webp", 
    desc: "Solid wood tables, cane back chairs, and coordinated benches manufactured to order."
  },
  { 
    name: "Bedroom Retreat", 
    slug: "bedroom", 
    image: "/images/catalog/page_22_img_00.webp",
    desc: "Platform bed cots, bedside tables, and handcrafted loose bedroom benches." 
  },
  { 
    name: "Entryway & Benches", 
    slug: "entryway", 
    image: "/images/catalog/page_27_img_00.webp",
    desc: "Minimal consoles, organic mirror units, and sturdy cane-woven entryway benches." 
  }
];

const features = [
  {
    icon: <Sparkles size={20} className="stroke-[1.2]" />,
    title: "Made-to-Order & Custom Sizes",
    description: "Every furniture unit is manufactured to your exact requirements and custom dimensions—we do not mass produce.",
  },
  {
    icon: <PenTool size={20} className="stroke-[1.2]" />,
    title: "Solid Wood & Rattan Cane",
    description: "Expert construction utilizing premium solid Teak, Ash, and Mahogany wood, combined with hand-woven natural rattan cane.",
  },
  {
    icon: <Layers size={20} className="stroke-[1.2]" />,
    title: "Factory-Direct & Detail Focus",
    description: "Handmade directly in our Pattambi workshop. Expert joineries, meticulous finishing, and zero retail middleman markups.",
  },
  {
    icon: <Star size={20} className="stroke-[1.2]" />,
    title: "Complete Home Solutions",
    description: "A dedicated partner for complete custom residential furniture projects, from living rooms to bespoke wardrobes.",
  },
];

const instagramFeed = [
  "/images/catalog/page_12_img_02.webp",
  "/images/catalog/page_13_img_00.webp",
  "/images/catalog/page_27_img_00.webp",
  "/images/catalog/page_30_img_00.webp",
];

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const allProducts = getAllProducts();
  const categories = ["All", ...getCategories()];
  const [activeTab, setActiveTab] = useState("All");

  const filteredProducts = allProducts.filter(
    (product) => activeTab === "All" || product.category === activeTab
  );

  const customEnquiryLink = getGeneralWhatsAppLink("custom");

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" },
  } as const;

  const stagger = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.15 } },
    viewport: { once: true },
  } as const;

  return (
    <div className="overflow-hidden bg-white">
      {/* SECTION 01 — HERO */}
      <section 
        className="relative min-h-[calc(100svh-50px)] md:min-h-[calc(100vh-84px)] h-auto py-12 md:py-16 w-full flex items-center justify-start bg-neutral-900 overflow-hidden select-none"
      >
        <div className="absolute inset-0 bg-neutral-950">
          <Image
            src="/images/hero-bg.jpg"
            alt="ZOOSH bespoke living room furniture"
            fill
            priority
            unoptimized
            quality={100}
            sizes="100vw"
            style={{ objectPosition: "center bottom" }}
            className="object-cover object-bottom"
          />
          {/* Subtle localized gradient protecting text on the left while keeping the photo crisp & vivid */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full flex items-center justify-start pointer-events-none">
          <div 
            className="max-w-[620px] w-full text-left flex flex-col items-start cursor-default pointer-events-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="mb-3"
            >
              <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-300 font-sans font-light [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]">
                Bespoke Wood Craftsmanship
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="font-serif text-[clamp(28px,4.5vw,64px)] font-light tracking-wide leading-[1.12] text-white mb-4 [text-shadow:0_1.5px_3px_rgba(0,0,0,0.35)]"
            >
              Every Home Deserves Furniture Built Specifically For It.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="text-xs sm:text-sm md:text-base text-neutral-200 font-sans font-light tracking-wide mb-8 leading-relaxed [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]"
            >
              Premium custom furniture manufactured using solid Teak, Ash, and Mahogany wood, natural cane, and carefully selected materials for modern homes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto"
            >
              <Button 
                variant="white" 
                href="/contact" 
                className="min-w-[170px]"
              >
                Start Your Project
              </Button>
              <Button 
                variant="secondary" 
                href="/collection" 
                className="min-w-[170px] border-white text-white hover:bg-white hover:text-black"
              >
                Explore Collections
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Scroll Helper */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1 text-white/30 animate-bounce">
          <span className="text-[7px] tracking-[0.3em] uppercase font-light">Scroll</span>
        </div>
      </section>

      {/* SECTION 02 — SHOP BY SPACE (CATEGORY DISCOVERY) */}
      <section className="py-16 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-medium block">
              Bespoke Spaces
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-neutral-900">
              Shop by Space
            </h2>
            <p className="text-neutral-500 text-xs md:text-sm font-sans font-light">
              Explore room configurations and custom furniture layouts engineered for contemporary homes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {spaces.map((space, idx) => (
              <motion.div
                key={space.slug}
                {...fadeInUp}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group flex flex-col justify-between"
              >
                <Link href={`/${space.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-neutral-50 border border-neutral-100 mb-4">
                  <Image
                    src={space.image}
                    alt={space.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 20vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <h3 className="font-serif text-base md:text-lg text-white tracking-wide leading-tight">
                      {space.name}
                    </h3>
                  </div>
                </Link>
                <div className="space-y-2 px-1">
                  <p className="text-neutral-500 text-[11px] font-sans font-light leading-relaxed min-h-[50px] line-clamp-3">
                    {space.desc}
                  </p>
                  <Link 
                    href={`/${space.slug}`}
                    className="inline-flex items-center text-[10px] tracking-wider uppercase text-black font-medium group-hover:underline"
                  >
                    <span>Explore Space</span>
                    <ArrowRight size={10} className="ml-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 03 — BRAND INTRODUCTION */}
      <section className="py-16 bg-brand-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <motion.div {...fadeInUp} className="lg:col-span-5 space-y-4">
              <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-medium block">
                Brand Profile
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-neutral-900 leading-tight">
                Shaped by time,<br />guided by passion.
              </h2>
            </motion.div>
            <motion.div 
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-7 space-y-6 text-neutral-600 font-sans text-sm font-light leading-relaxed max-w-2xl"
            >
              <p>
                Established in 2021, ZOOSH was founded with determination, starting from humble resources but guided by a clear focus on raw material quality, comfort, and custom design. By managing the entire workflow—from selecting timbers at licensed yards to custom jointing and final delivery—we have grown into a skilled team operating our own dedicated manufacturing facility.
              </p>
              <p>
                We do not sell pre-fabricated ready stock or operate traditional showrooms. Instead, our team designs and manufactures custom furniture tailored to the specific spatial layouts, dimensions, and styling preferences of each individual client, creating timeless wooden elements built to last.
              </p>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center text-xs tracking-[0.2em] uppercase text-black font-light border-b border-black pb-1 hover:pl-1 transition-all"
                >
                  <span>Discover Our Journey</span>
                  <ArrowRight size={12} className="ml-2" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 04 — MATERIALS STORY */}
      <section className="py-16 bg-brand-grey border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-medium block">
              Material Story
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-neutral-900">
              Premium Solid Materials
            </h2>
            <p className="text-neutral-500 text-xs md:text-sm font-sans font-light">
              Every ZOOSH piece begins with carefully selected solid timber and natural components.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Teak Wood",
                image: "/images/catalog/page_05_img_00.webp",
                desc: "Sourced through licensed yards in Kerala, Teak is chosen for its dense structural fibers, durability, and natural resistance, providing a rich golden grain finish."
              },
              {
                title: "Ash Wood",
                image: "/images/catalog/page_11_img_00.webp",
                desc: "Imported solid Ash wood is highly valued for its striking, open-pore cathedral grain patterns and flexible strength, ideal for curved backs and modern dining furniture."
              },
              {
                title: "Mahogany Wood",
                image: "/images/catalog/page_12_img_02.webp",
                desc: "Mahogany offers a rich, fine-textured grain with reddish-brown warmth, bringing a balanced, stable frame structure to custom TV units and storage sideboards."
              }
            ].map((mat, idx) => (
              <motion.div
                key={idx}
                {...fadeInUp}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="flex flex-col space-y-4 bg-white border border-neutral-100 p-6 shadow-sm"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                  <Image
                    src={mat.image}
                    alt={mat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover hover:scale-102 transition-transform duration-700"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-lg text-neutral-950 font-medium">{mat.title}</h3>
                  <p className="text-neutral-500 text-xs leading-relaxed font-sans font-light">
                    {mat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 05 — MADE TO ORDER (DESIGN PROCESS) */}
      <section className="py-16 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-medium block">
              Bespoke Process
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-neutral-900">
              Designed Around Your Space.
            </h2>
            <p className="text-neutral-500 text-xs md:text-sm font-sans font-light">
              We manufacture furniture against confirmed order requirements, collaboratively styling each piece.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 relative">
            {[
              { num: "01", title: "Share Requirements", desc: "Send photos, design sketches, or base dimensions of your rooms." },
              { num: "02", title: "Consultation & Metrics", desc: "We review proportions, scale, and layout details for optimal fit." },
              { num: "03", title: "Material Selection", desc: "Select solid Teak, Ash, or Mahogany, natural rattan cane, and custom fabrics." },
              { num: "04", title: "Custom Manufacturing", desc: "Experienced carpenters construct the frames using strong joinery methods." },
              { num: "05", title: "Quality Inspection", desc: "We check the stability, hand-sanded finish, and upholstery lines." },
              { num: "06", title: "Delivery & Installation", desc: "Shipped directly from our Pattambi factory to your home with on-site assembly." }
            ].map((step, idx) => (
              <div 
                key={idx} 
                className="border border-neutral-100 p-6 space-y-4 bg-neutral-50/20 shadow-sm flex flex-col justify-between"
              >
                <span className="font-serif text-2xl text-neutral-300 font-light block">{step.num}</span>
                <h3 className="font-serif text-sm text-neutral-950 font-medium leading-tight">{step.title}</h3>
                <p className="text-neutral-500 text-[11px] leading-relaxed font-sans font-light">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 06 — OUR FACTORY (MADE IN OUR FACTORY) */}
      <section className="py-16 bg-brand-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
            <motion.div {...fadeInUp} className="lg:col-span-5 space-y-6">
              <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-medium block">
                Manufacturing
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-neutral-900 leading-tight">
                Made in our factory.
              </h2>
              <p className="text-neutral-500 text-xs md:text-sm font-sans font-light leading-relaxed">
                From selected timber planks to structural frames and upholstery, our team manages the production lifecycle directly. By operating our factory in Pattambi, we avoid sourcing from resellers, ensuring skilled joinery and sanding details.
              </p>
              <p className="text-neutral-500 text-xs md:text-sm font-sans font-light leading-relaxed">
                Our workshop employs experienced carpenters who have worked extensively in solid wood craft, ensuring that every curve and seam meets structural guidelines.
              </p>
              <div className="pt-2">
                <Button variant="secondary" href="/custom">
                  View Design Process
                </Button>
              </div>
            </motion.div>

            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-7 grid grid-cols-12 gap-4"
            >
              <div className="col-span-8 relative aspect-[4/3] bg-neutral-200 overflow-hidden shadow-sm">
                <Image
                  src="/images/catalog/page_10_img_00.webp"
                  alt="Carpenters assembling a dining table in ZOOSH factory"
                  fill
                  sizes="40vw"
                  className="object-cover"
                />
              </div>
              <div className="col-span-4 flex flex-col gap-4">
                <div className="relative aspect-square bg-neutral-200 overflow-hidden shadow-sm">
                  <Image
                    src="/images/catalog/page_02_img_01.webp"
                    alt="ZOOSH timber treatment kiln"
                    fill
                    sizes="20vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[3/4] bg-neutral-200 overflow-hidden shadow-sm">
                  <Image
                    src="/images/catalog/page_06_img_01.webp"
                    alt="Master carpenter working on wood joint"
                    fill
                    sizes="20vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 07 — DYNAMIC COLLECTION GRID (SIGNATURE CATALOG) */}
      <section className="py-16 bg-brand-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-neutral-100 pb-4 gap-4">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-medium block mb-2">
                Signature Catalog
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-light tracking-wide text-neutral-900">
                Customizable Designs
              </h3>
            </div>
            
            <div className="flex items-center overflow-x-auto no-scrollbar py-2 -mx-6 px-6 md:mx-0 md:px-0 space-x-2 scroll-smooth">
              {categories.map((category) => {
                const isActive = activeTab === category;
                return (
                  <button
                    key={category}
                    onClick={() => setActiveTab(category)}
                    className={`text-[9px] tracking-widest uppercase py-2 px-4 transition-all duration-300 whitespace-nowrap font-light border ${
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

          <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProductCard
                    product={product}
                    onQuickView={(p) => setSelectedProduct(p)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* SECTION 08 — COMPLETE HOME SOLUTIONS */}
      <section className="py-16 bg-brand-grey border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-medium block">
              Complete Furnishing
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-neutral-900 leading-tight">
              One Home. Multiple Spaces.<br />One Furniture Partner.
            </h2>
            <p className="text-neutral-500 font-sans text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-2xl mx-auto">
              We act as a complete partner for residential interior projects, fabricating coordinated solid wood frames, rattan accent cabinets, platforms, swings, and customized soft seatings to create a unified design language across your entire home.
            </p>
            <div className="pt-4 flex justify-center">
              <Button variant="primary" href="/contact">
                Plan Your Home Project
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 09 — PROJECTS (REAL INSTALLED HOMES) */}
      <section className="py-16 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-medium block">
              Completed Works
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-neutral-900">
              Selected Real Projects
            </h2>
            <p className="text-neutral-500 text-xs md:text-sm font-sans font-light">
              A showcase of completed custom furniture installations in private residences and cafes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Ajmal Residence",
                image: "/images/catalog/page_14_img_00.webp",
                category: "Residential Living Room Space"
              },
              {
                title: "Rajesh Menon Residence",
                image: "/images/catalog/page_32_img_00.webp",
                category: "Teak Dining Chair Setup"
              },
              {
                title: "Akhil Residence",
                image: "/images/catalog/page_29_img_00.webp",
                category: "Custom Armchair Installation"
              },
              {
                title: "Sufaina Residence",
                image: "/images/catalog/page_44_img_00.webp",
                category: "Solid Wood Dining Suite"
              },
              {
                title: "Sanjeevan Residence",
                image: "/images/catalog/page_35_img_00.webp",
                category: "Cane Back Lounge Chair"
              },
              {
                title: "Brown Barrel Cafe",
                image: "/images/catalog/page_51_img_01.webp",
                category: "Commercial Cafe Project"
              }
            ].map((project, idx) => (
              <motion.div
                key={idx}
                {...fadeInUp}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group flex flex-col space-y-4"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-50 border border-neutral-100">
                  <Image
                    src={project.image}
                    alt={`${project.title} - ${project.category}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-102"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 font-sans font-medium block">
                    {project.category}
                  </span>
                  <h3 className="font-serif text-lg text-neutral-950 font-light group-hover:text-neutral-500 transition-colors">
                    {project.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10 — FINAL CTA */}
      <section className="relative py-20 md:py-28 flex items-center justify-center bg-neutral-900">
        <div className="absolute inset-0">
          <Image
            src="/images/catalog/page_10_img_00.webp"
            alt="ZOOSH workshop custom manufacturing background"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-black/65" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center text-white space-y-6">
          <motion.span {...fadeInUp} className="text-[10px] tracking-[0.4em] uppercase text-neutral-300 font-sans block">
            Collaborate With Us
          </motion.span>
          <motion.h2
            {...fadeInUp}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl font-light tracking-wide max-w-3xl mx-auto leading-tight"
          >
            Have a space in mind?
          </motion.h2>
          <motion.p
            {...fadeInUp}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-neutral-300 font-sans text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-xl mx-auto"
          >
            Tell us what you're looking for. We will guide you through dimensions, timber selection, and finishes to build furniture made specifically for your space.
          </motion.p>
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-6"
          >
            <Button variant="white" href="/contact" className="min-w-[200px]">
              Start Your Project
            </Button>
            <a
              href={customEnquiryLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-3 border border-white text-white text-xs tracking-[0.2em] uppercase py-4 px-8 hover:bg-white hover:text-black transition-colors font-light min-w-[200px]"
            >
              <Send size={12} />
              <span>WhatsApp Us</span>
            </a>
          </motion.div>
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
