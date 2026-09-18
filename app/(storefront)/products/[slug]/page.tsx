import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import {
  Send,
  ChevronRight,
  CornerDownLeft,
  Award,
  Shield,
  Sparkles,
  Hammer,
  Check,
  Compass,
  FileText,
  Activity,
  Layers,
  Heart
} from "lucide-react";
import ProductGallery from "@/components/product/product-gallery";
import ProductCard from "@/components/product/product-card";
import ShareButton from "@/components/product/share-button";
import VariantSelector from "@/components/product/variant-selector";
import RecentlyViewed from "@/components/product/recently-viewed";
import CustomSizeForm from "@/components/product/custom-size-form";
import ProductPricingBreakdown from "@/components/product/product-pricing-breakdown";
import { getProductBySlug, getAllProducts, getWhatsAppLink, getRoomAndSubcategory, transformAdminProductToProduct, Product } from "@/lib/products-utils";
import { adminDb } from "@/lib/admin-db";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function resolveProduct(rawSlug: string): Promise<Product | undefined> {
  if (!rawSlug) return undefined;
  
  // 1. Try local transformed product
  const local = getProductBySlug(rawSlug);
  if (local) return local;

  // 2. Try fetching from Supabase/adminDb directly
  try {
    const fromDb = await adminDb.getProductById(rawSlug);
    if (fromDb && fromDb.status === "published") {
      return transformAdminProductToProduct(fromDb);
    }
  } catch (e) {}

  // 3. Try matching by SKU directly across all products
  const all = getAllProducts();
  const bySku = all.find(p => p.sku.toLowerCase() === rawSlug.toLowerCase() || p.id.toLowerCase() === rawSlug.toLowerCase());
  if (bySku) return bySku;

  return undefined;
}

// Generate collections links for cross-navigation
function getRelatedCollections(category: string) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("sofa")) {
    return [
      { name: "Coffee Tables", href: "/collection?category=Living" },
      { name: "TV Units", href: "/collection?category=Living" },
      { name: "Accent Chairs", href: "/collection?category=Chairs" },
      { name: "Side Tables", href: "/collection?category=Living" },
    ];
  }
  if (cat.includes("bed") || cat.includes("bedroom")) {
    return [
      { name: "Nightstands", href: "/collection?category=Bedroom" },
      { name: "Wardrobes", href: "/collection?category=Bedroom" },
      { name: "Dressers", href: "/collection?category=Bedroom" },
      { name: "Benches", href: "/collection?category=Benches" },
    ];
  }
  return [
    { name: "Dining Chairs", href: "/collection?category=Chairs" },
    { name: "Dining Tables", href: "/collection?category=Dining" },
    { name: "Benches", href: "/collection?category=Benches" },
    { name: "Sideboards", href: "/collection?category=Living" },
  ];
}

// Dynamic SEO metadata generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await resolveProduct(resolvedParams.slug);

  if (!product) {
    return {
      title: "Product | ZOOSH Premium Custom Furniture",
      description: "Handcrafted bespoke solid wood furniture by ZOOSH Kerala.",
    };
  }

  const primaryImage = product.images && product.images.length > 0 ? product.images[0] : "/images/products/sf001-1.jpg";

  return {
    title: `${product.name} | ZOOSH Premium Modern Furniture`,
    description: product.description || "ZOOSH Custom Solid Wood Furniture Kerala",
    openGraph: {
      title: `${product.name} | ZOOSH`,
      description: product.description || "ZOOSH Custom Solid Wood Furniture Kerala",
      images: [{ url: primaryImage }],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const product = await resolveProduct(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const allProducts = getAllProducts();
  
  // Custom WhatsApp message format requested by the user
  const phoneNumber = "919567193992";
  const whatsappMessage = `Hello ZOOSH,

I'm interested in:

Product:
${product.name} (SKU: ${product.sku})

Could you please share:
• Price
• Available finishes
• Delivery time
• Material options

Thank you.`;
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  // Recommendations: Rank similar products based on category and material matching, capped at 4 items
  const recommendations = allProducts
    .filter((p) => p.id !== product.id)
    .map((p) => {
      let score = 0;
      if (p.category === product.category) score += 3;
      if (p.material === product.material) score += 2;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((x) => x.p);

  const relatedCollectionsList = getRelatedCollections(product.category);

  // Schema.org structured data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "sku": product.sku,
    "category": product.category,
    "material": product.material,
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "price": "Price on Request",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "FurnitureStore",
        "name": "ZOOSH Furniture Company",
      },
    },
  };

  const roomLabels: Record<string, string> = {
    living: "Living",
    dining: "Dining",
    bedroom: "Bedroom",
    entryway: "Entryway"
  };

  const subcategoryLabels: Record<string, string> = {
    sofas: "Sofas",
    "lounge-chairs": "Lounge Chairs",
    "arm-chairs": "Arm Chairs",
    "centre-tables": "Centre Tables",
    "side-tables": "Side Tables",
    "console-tables": "Console Tables",
    "dining-tables": "Dining Tables",
    "dining-chairs": "Dining Chairs",
    "dining-benches": "Dining Benches",
    "bar-stools": "Bar Stools",
    "bed-cots": "Bed Cots",
    "bedside-tables": "Bedside Tables",
    "bedroom-chairs": "Bedroom Chairs",
    "mirror-units": "Mirror Units",
    benches: "Benches"
  };

  const mapped = getRoomAndSubcategory(product.category);
  const roomName = roomLabels[mapped.room] || mapped.room;
  const subcategoryName = subcategoryLabels[mapped.subcategory] || mapped.subcategory;

  return (
    <div className="pt-8 pb-16 bg-white min-h-screen">
      {/* Schema markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-[10px] tracking-widest uppercase text-neutral-400 mb-6 font-sans font-medium">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight size={10} />
          <Link href={`/${mapped.room}`} className="hover:text-black transition-colors">
            {roomName}
          </Link>
          <ChevronRight size={10} />
          <Link href={`/${mapped.room}/${mapped.subcategory}`} className="hover:text-black transition-colors">
            {subcategoryName}
          </Link>
          <ChevronRight size={10} />
          <span className="text-neutral-800 truncate max-w-[150px] sm:max-w-none">
            {product.name}
          </span>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Interactive Product Gallery */}
          <div className="lg:col-span-7 w-full">
            <ProductGallery images={product.images} />
          </div>

          {/* Right Column: Sticky Product Navigation & Details */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 bg-white border border-neutral-50 p-6 lg:p-8 shadow-sm">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-sans font-medium">
                  {subcategoryName} Collection
                </span>
                <ShareButton />
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-neutral-900 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center justify-between text-[10px] tracking-widest text-neutral-400 font-sans uppercase pt-1">
                <span>SKU: {product.sku}</span>
                <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5">In Stock / Made to Order</span>
              </div>

            </div>

            {/* Description (Editorial Story Only) */}
            <p className="text-neutral-500 font-sans text-xs md:text-sm font-light leading-relaxed">
              {product.description}
            </p>

            {/* Structured Specifications Spaces */}
            <div className="border-t border-b border-neutral-100 py-4 space-y-2.5">
              <div className="flex justify-between text-xs font-sans">
                <span className="text-neutral-400 font-light">Wood Selection</span>
                <span className="text-neutral-800 font-medium">{product.material || product.specs.material}</span>
              </div>
              {product.finish && (
                <div className="flex justify-between text-xs font-sans">
                  <span className="text-neutral-400 font-light">Finish / Polish</span>
                  <span className="text-neutral-800 font-medium">{product.finish}</span>
                </div>
              )}
              {product.fabric && (
                <div className="flex justify-between text-xs font-sans">
                  <span className="text-neutral-400 font-light">Fabric Upholstery</span>
                  <span className="text-neutral-800 font-medium">{product.fabric}</span>
                </div>
              )}
              {product.rattan && (
                <div className="flex justify-between text-xs font-sans">
                  <span className="text-neutral-400 font-light">Rattan Crafting</span>
                  <span className="text-neutral-800 font-medium">{product.rattan}</span>
                </div>
              )}
              
              {/* Measurements Space */}
              {product.dimensionBreakdown && product.dimensionBreakdown.length > 0 ? (
                <div className="pt-2 border-t border-neutral-100/60 space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-sans block font-semibold">
                    Measurements / Dimensions:
                  </span>
                  {product.dimensionBreakdown.map((item) => (
                    <div key={item.label} className="flex justify-between text-xs font-sans pl-2">
                      <span className="text-neutral-500 font-light">• {item.label}</span>
                      <span className="text-neutral-900 font-medium">{item.size}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-between text-xs font-sans">
                  <span className="text-neutral-400 font-light">Dimensions</span>
                  <span className="text-neutral-800 font-medium">{product.dimensions || product.specs.dimensions}</span>
                </div>
              )}
            </div>

            {/* Dynamic Price & Interactive Set Configuration Breakdown */}
            <ProductPricingBreakdown
              productName={product.name}
              productSku={product.sku}
              basePrice={product.price || 0}
              priceBreakdown={product.priceBreakdown}
              dimensionBreakdown={product.dimensionBreakdown}
            />

            {/* Return Link */}
            <div className="pt-2 text-center">
              <Link
                href={`/${mapped.room}/${mapped.subcategory}`}
                className="inline-flex items-center space-x-2 text-[10px] tracking-[0.2em] uppercase text-neutral-400 hover:text-black transition-colors"
              >
                <CornerDownLeft size={10} />
                <span>Back to {subcategoryName}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Custom Sizing Request Form */}
        <CustomSizeForm 
          productName={product.name} 
          productSku={product.sku} 
          productUrl={`https://zooshfurniture.com/products/${product.slug}`} 
        />

        {/* Product Story Section */}
        <section className="mt-16 border-t border-neutral-100 pt-10">
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-2">
              <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans block">
                Editorial Profile
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-neutral-900">
                The Design Story
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-neutral-600 text-sm font-sans font-light leading-relaxed">
              <div className="space-y-6">
                <div>
                  <h4 className="font-serif text-base text-neutral-950 font-medium mb-2">Product Overview</h4>
                  <p>{product.description}</p>
                </div>
                <div>
                  <h4 className="font-serif text-base text-neutral-950 font-medium mb-2">Materials Used</h4>
                  <p>{product.story.materials} Crafted utilizing select solid Teak, Ash, or Mahogany wood structures combined with natural rattan cane weaves and premium upholstery.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="font-serif text-base text-neutral-950 font-medium mb-2">Available Customisations</h4>
                  <p>All dimensions, timber finishes (Natural, Aged, or Charcoal stains), and upholstery textiles can be customized at our Pattambi factory to align with your home blueprints.</p>
                </div>
                <div>
                  <h4 className="font-serif text-base text-neutral-950 font-medium mb-2">Care Instructions</h4>
                  <p>Dust regularly with a dry, soft lint-free cotton cloth. Avoid placing near direct heat or harsh chemical solvents. Nourish solid wood finishes periodically with high-quality natural wax oils.</p>
                </div>
              </div>
            </div>

            <div className="border-t border-b border-neutral-100 py-6 text-center">
              <h4 className="font-serif text-base text-neutral-950 font-medium mb-2">Recommended Spaces</h4>
              <p className="text-neutral-500 font-sans text-sm font-light max-w-xl mx-auto leading-relaxed">
                {product.story.styles}
              </p>
            </div>
          </div>
        </section>

        {/* Specifications Section */}
        <section className="mt-16 bg-neutral-50/50 border border-neutral-100 p-8 md:p-12 max-w-4xl mx-auto">
          <h3 className="font-serif text-xl md:text-2xl font-light tracking-wide text-neutral-900 mb-6 text-center">
            Technical Specifications
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-sans text-neutral-700 font-light">
              <tbody>
                <tr className="border-b border-neutral-200/60">
                  <td className="py-4 font-medium text-neutral-400 uppercase tracking-wider w-1/3">Base Material</td>
                  <td className="py-4 text-neutral-900">{product.specs.material}</td>
                </tr>
                <tr className="border-b border-neutral-200/60">
                  <td className="py-4 font-medium text-neutral-400 uppercase tracking-wider">Wood Selection</td>
                  <td className="py-4 text-neutral-900">{product.specs.woodType}</td>
                </tr>
                <tr className="border-b border-neutral-200/60">
                  <td className="py-4 font-medium text-neutral-400 uppercase tracking-wider">Fabric Type</td>
                  <td className="py-4 text-neutral-900">{product.specs.fabric}</td>
                </tr>
                <tr className="border-b border-neutral-200/60">
                  <td className="py-4 font-medium text-neutral-400 uppercase tracking-wider">Dimensions</td>
                  <td className="py-4 text-neutral-900">{product.specs.dimensions}</td>
                </tr>
                <tr className="border-b border-neutral-200/60">
                  <td className="py-4 font-medium text-neutral-400 uppercase tracking-wider">Weight Scale</td>
                  <td className="py-4 text-neutral-900">{product.specs.weight}</td>
                </tr>
                <tr className="border-b border-neutral-200/60">
                  <td className="py-4 font-medium text-neutral-400 uppercase tracking-wider">Finish Detail</td>
                  <td className="py-4 text-neutral-900">{product.specs.finish}</td>
                </tr>
                <tr className="border-b border-neutral-200/60">
                  <td className="py-4 font-medium text-neutral-400 uppercase tracking-wider">Assembly Spec</td>
                  <td className="py-4 text-neutral-900">{product.specs.assembly}</td>
                </tr>
                <tr className="border-b border-neutral-200/60">
                  <td className="py-4 font-medium text-neutral-400 uppercase tracking-wider">Warranty Duration</td>
                  <td className="py-4 text-neutral-900">{product.specs.warranty}</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium text-neutral-400 uppercase tracking-wider">Bespoke Customization</td>
                  <td className="py-4 text-emerald-700 font-medium">Available Upon Request</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Features Icon Cards */}
        <section className="mt-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="border border-neutral-100 p-6 text-center space-y-3 bg-neutral-50/20 hover:bg-neutral-50/60 transition-all duration-300">
              <Award className="mx-auto text-neutral-400 stroke-[1.2]" size={28} />
              <h5 className="font-serif text-xs text-neutral-900 font-medium uppercase tracking-wide">Premium Craftsmanship</h5>
            </div>
            <div className="border border-neutral-100 p-6 text-center space-y-3 bg-neutral-50/20 hover:bg-neutral-50/60 transition-all duration-300">
              <Activity className="mx-auto text-neutral-400 stroke-[1.2]" size={28} />
              <h5 className="font-serif text-xs text-neutral-900 font-medium uppercase tracking-wide">Solid Wood Frame</h5>
            </div>
            <div className="border border-neutral-100 p-6 text-center space-y-3 bg-neutral-50/20 hover:bg-neutral-50/60 transition-all duration-300">
              <Sparkles className="mx-auto text-neutral-400 stroke-[1.2]" size={28} />
              <h5 className="font-serif text-xs text-neutral-900 font-medium uppercase tracking-wide">Handmade Finish</h5>
            </div>
            <div className="border border-neutral-100 p-6 text-center space-y-3 bg-neutral-50/20 hover:bg-neutral-50/60 transition-all duration-300">
              <Shield className="mx-auto text-neutral-400 stroke-[1.2]" size={28} />
              <h5 className="font-serif text-xs text-neutral-900 font-medium uppercase tracking-wide">Durable Upholstery</h5>
            </div>
            <div className="border border-neutral-100 p-6 text-center space-y-3 bg-neutral-50/20 hover:bg-neutral-50/60 transition-all duration-300">
              <Layers className="mx-auto text-neutral-400 stroke-[1.2]" size={28} />
              <h5 className="font-serif text-xs text-neutral-900 font-medium uppercase tracking-wide">Fully Customizable</h5>
            </div>
            <div className="border border-neutral-100 p-6 text-center space-y-3 bg-neutral-50/20 hover:bg-neutral-50/60 transition-all duration-300">
              <Hammer className="mx-auto text-neutral-400 stroke-[1.2]" size={28} />
              <h5 className="font-serif text-xs text-neutral-900 font-medium uppercase tracking-wide">Made to Order</h5>
            </div>
          </div>
        </section>

        {/* Lifestyle Gallery */}
        <section className="mt-16">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-[9px] tracking-[0.3em] uppercase text-neutral-400 font-sans block">
              Bespoke Inspiration
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-light tracking-wide text-neutral-900">
              Lifestyle Gallery
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {product.lifestyleImages.map((img, idx) => (
              <div key={idx} className="relative aspect-[4/5] overflow-hidden bg-neutral-100 group">
                <img
                  src={img}
                  alt={`Lifestyle view ${idx + 1}`}
                  className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-102"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Related Collections Cross-Navigation */}
        <section className="mt-16 border-t border-neutral-100 pt-10">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-[9px] tracking-[0.3em] uppercase text-neutral-400 font-sans block">
              Cross Curation
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-light tracking-wide text-neutral-900">
              Complete the Concept
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {relatedCollectionsList.map((col) => (
              <Link
                key={col.name}
                href={col.href}
                className="text-[10px] tracking-widest uppercase py-3 px-6 border border-neutral-200 hover:border-black hover:bg-black hover:text-white transition-all duration-300 font-sans font-light"
              >
                {col.name} &rarr;
              </Link>
            ))}
          </div>
        </section>

        {/* Similar Furniture Section ("You May Also Like") */}
        {recommendations.length > 0 && (
          <section className="border-t border-neutral-100 mt-16 pt-10">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
              <span className="text-[9px] tracking-[0.3em] uppercase text-neutral-400 font-sans block">
                Related Designs
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-light tracking-wide text-neutral-900">
                You May Also Like
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {recommendations.map((recProduct) => (
                <ProductCard key={recProduct.id} product={recProduct} />
              ))}
            </div>
          </section>
        )}

        {/* Recently Viewed Panel */}
        <RecentlyViewed currentProduct={product} allProducts={allProducts} />
      </div>
    </div>
  );
}
