import { adminDb, AdminProduct, Category, Collection } from "./admin-db";

export type { AdminProduct, Category, Collection };

export const dynamic = "force-dynamic";

/**
 * Public storefront data access layer.
 * Only retrieves products that have status === 'published'.
 * Draft and archived products are strictly excluded from public storefront.
 */
export async function getPublicProducts(filters?: {
  category?: string;
  collection?: string;
  search?: string;
}): Promise<AdminProduct[]> {
  const products = await adminDb.getProducts({
    status: "published",
    category: filters?.category,
    collection: filters?.collection,
    search: filters?.search,
  });
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

export async function getPublicCategories(): Promise<Category[]> {
  const categories = await adminDb.getCategories();
  return categories.filter((c) => c.status === "active");
}

export async function getPublicCollections(): Promise<Collection[]> {
  const collections = await adminDb.getCollections();
  return collections.filter((c) => c.status === "active");
}
