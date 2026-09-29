import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

import { ChevronRight } from "lucide-react";
import ProductGallery from "@/components/product/product-gallery";
import ProductCard from "@/components/product/product-card";
import ProductDetailView from "@/components/product/product-detail-view";
import RecentlyViewed from "@/components/product/recently-viewed";
import CustomSizeForm from "@/components/product/custom-size-form";
import {
  getProductBySlug,
  getAllProducts,
  getRoomAndSubcategory,
  transformAdminProductToProduct,
  Product,
} from "@/lib/products-utils";
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
  const bySku = all.find(
    (p) =>
      p.sku.toLowerCase() === rawSlug.toLowerCase() ||
      p.id.toLowerCase() === rawSlug.toLowerCase()
  );
  if (bySku) return bySku;

  return undefined;
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

  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/images/products/sf001-1.jpg";

  return {
    title: `${product.name} | ZOOSH Premium Furniture`,
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

  // Schema.org structured data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku,
    category: product.category,
    material: product.material,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price ? product.price.toString() : "40000",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "FurnitureStore",
        name: "ZOOSH Furniture Company",
      },
    },
    brand: {
      "@type": "Brand",
      name: "ZOOSH",
    },
  };

  const roomLabels: Record<string, string> = {
    living: "Living",
    dining: "Dining",
    bedroom: "Bedroom",
    entryway: "Entryway",
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
    benches: "Benches",
  };

  const mapped = getRoomAndSubcategory(product.category);
  const roomName = roomLabels[mapped.room] || mapped.room;
  const subcategoryName = subcategoryLabels[mapped.subcategory] || mapped.subcategory;

  return (
    <div className="py-6 sm:py-10 bg-white min-h-screen">
      {/* Schema markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-[9px] sm:text-[10px] tracking-widest uppercase text-neutral-400 mb-6 font-sans font-medium">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight size={10} />
          <Link href={`/${mapped.room}`} className="hover:text-black transition-colors">
            {roomName}
          </Link>
          <ChevronRight size={10} />
          <Link
            href={`/${mapped.room}/${mapped.subcategory}`}
            className="hover:text-black transition-colors"
          >
            {subcategoryName}
          </Link>
          <ChevronRight size={10} />
          <span className="text-neutral-900 truncate max-w-[120px] sm:max-w-none">
            {product.name}
          </span>
        </div>

        {/* Main Product Layout (Homework Living Style: Gallery on Left, Sticky Details on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left Column: Product Image Gallery */}
          <div className="lg:col-span-7 w-full">
            <ProductGallery images={product.images} />
          </div>

          {/* Right Column: Sticky Product Form & Un-collapsed Details */}
          <div className="lg:col-span-5 w-full">
            <ProductDetailView
              product={product}
              subcategoryName={subcategoryName}
              roomSlug={mapped.room}
              subcategorySlug={mapped.subcategory}
            />
          </div>
        </div>

        {/* Custom Sizing Request Form */}
        <div className="mt-14 pt-10 border-t border-neutral-100">
          <CustomSizeForm
            productName={product.name}
            productSku={product.sku}
            productUrl={`https://zoosh.in/products/${product.slug}`}
          />
        </div>

        {/* "You May Also Like" Curated Recommendations Grid */}
        {recommendations.length > 0 && (
          <section className="border-t border-neutral-100 mt-16 pt-12">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-1.5">
              <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-medium block">
                Curated Recommendations
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-wide text-neutral-900">
                You May Also Like
              </h2>
            </div>
            
            {/* 2-Column Mobile Grid / 4-Column Desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
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
