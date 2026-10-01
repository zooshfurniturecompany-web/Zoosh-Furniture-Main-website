"use client";

import { useState, useEffect } from "react";
import { adminDb } from "@/lib/admin-db";
import {
  Product,
  PriceOption,
  DimensionItem,
  getAllProducts,
  getFeaturedProducts,
  getProductBySlug,
  getCategories,
  getWhatsAppLink,
  getGeneralWhatsAppLink,
  getRoomAndSubcategory,
  getProductsByRoom,
  getProductsBySubcategory,
  transformAdminProductToProduct,
  getDynamicProductDetails
} from "@/lib/products-utils";

export type { Product, PriceOption, DimensionItem };
export {
  getAllProducts,
  getFeaturedProducts,
  getProductBySlug,
  getCategories,
  getWhatsAppLink,
  getGeneralWhatsAppLink,
  getRoomAndSubcategory,
  getProductsByRoom,
  getProductsBySubcategory,
  transformAdminProductToProduct,
  getDynamicProductDetails
};

/**
 * React hook that subscribes to real-time CMS changes.
 * Whenever an admin adds, edits, deletes, publishes, or unpublishes a product,
 * all active storefront components re-render immediately.
 */
export function useProducts(): Product[] {
  const [products, setProducts] = useState<Product[]>(() => getAllProducts());

  useEffect(() => {
    const handleUpdate = () => {
      setProducts(getAllProducts());
    };

    window.addEventListener("zoosh_store_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    // Synchronize changes without overwriting local admin edits
    fetch("/api/products", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const currentStore = adminDb.getStore();
          const localMap = new Map((currentStore.products || []).map((p) => [p.id, p]));
          
          const mergedProducts = data.map((serverProd: any) => {
            const local = localMap.get(serverProd.id) || localMap.get(serverProd.sku);
            // If locally modified and newer than server, keep local product
            if (
              local &&
              local.updated_at &&
              (!serverProd.updated_at || new Date(local.updated_at).getTime() >= new Date(serverProd.updated_at).getTime())
            ) {
              return local;
            }
            return serverProd;
          });

          // Also include any local-only products that aren't on the server yet
          (currentStore.products || []).forEach((lp) => {
            if (!mergedProducts.find((p: any) => p.id === lp.id || p.sku === lp.sku)) {
              mergedProducts.unshift(lp);
            }
          });

          adminDb.syncStore({ products: mergedProducts });
          setProducts(mergedProducts.map(transformAdminProductToProduct));
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener("zoosh_store_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return products;
}

export function useProductBySlug(slug: string): Product | undefined {
  const products = useProducts();
  if (!slug) return undefined;
  const cleanSlug = slug.toLowerCase().replace(/_/g, "-");
  return products.find(
    p => p.slug.toLowerCase() === cleanSlug || p.sku.toLowerCase() === cleanSlug || p.id.toLowerCase() === cleanSlug
  );
}
