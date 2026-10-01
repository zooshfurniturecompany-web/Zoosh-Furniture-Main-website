"use client";

import { useProductBySlug, Product } from "@/hooks/use-products";
import ProductGallery from "@/components/product/product-gallery";
import ProductDetailView from "@/components/product/product-detail-view";

interface ProductDetailContainerProps {
  initialProduct: Product;
  subcategoryName: string;
  roomSlug: string;
  subcategorySlug: string;
}

export default function ProductDetailContainer({
  initialProduct,
  subcategoryName,
  roomSlug,
  subcategorySlug,
}: ProductDetailContainerProps) {
  // Real-time synchronization: subscribe to live store updates when admin edits images or specs
  const liveProduct = useProductBySlug(initialProduct.slug) || useProductBySlug(initialProduct.sku) || initialProduct;
  const currentProduct = liveProduct || initialProduct;

  const currentImages = currentProduct.images && currentProduct.images.length > 0
    ? currentProduct.images
    : initialProduct.images;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
      {/* Left Column: Product Image Gallery (Real-time reactive to admin updates) */}
      <div className="lg:col-span-7 w-full">
        <ProductGallery images={currentImages} />
      </div>

      {/* Right Column: Sticky Product Form & Specifications */}
      <div className="lg:col-span-5 w-full">
        <ProductDetailView
          product={currentProduct}
          subcategoryName={subcategoryName}
          roomSlug={roomSlug}
          subcategorySlug={subcategorySlug}
        />
      </div>
    </div>
  );
}
