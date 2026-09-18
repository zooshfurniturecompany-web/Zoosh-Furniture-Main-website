import { adminDb, AdminProduct } from "./admin-db";

export type { AdminProduct };

/**
 * Public storefront data access layer.
 * Only retrieves products that have status === 'published'.
 */
export async function getPublicProducts(): Promise<AdminProduct[]> {
  const products = await adminDb.getProducts({ status: "published" });
  return products;
}

export async function getPublicProductBySlug(slug: string): Promise<AdminProduct | null> {
  const product = await adminDb.getProductById(slug);
  if (product && product.status === "published") {
    return product;
  }
  return null;
}

export async function getPublicFeaturedProducts(): Promise<AdminProduct[]> {
  const products = await adminDb.getProducts({ status: "published", featured: true });
  return products;
}

export async function getPublicCategories() {
  const categories = await adminDb.getCategories();
  return categories.filter(c => c.status === "active");
}

export async function getPublicCollections() {
  const collections = await adminDb.getCollections();
  return collections.filter(c => c.status === "active");
}
