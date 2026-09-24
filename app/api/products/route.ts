import { NextResponse } from "next/server";
import { adminDb } from "@/lib/admin-db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const featured = searchParams.get("featured") ? searchParams.get("featured") === "true" : undefined;
    const search = searchParams.get("search") || undefined;

    const products = await adminDb.getProducts({
      status: "published",
      category,
      featured,
      search,
    });

    const publicProducts = products.map((p) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      slug: p.slug,
      category_id: p.category_id,
      category_name: p.category_name,
      collection_id: p.collection_id,
      collection_name: p.collection_name,
      short_description: p.short_description,
      full_description: p.full_description,
      status: p.status,
      featured: p.featured,
      pricing_type: p.pricing_type,
      price: p.price,
      starting_price: p.starting_price,
      display_price: p.display_price,
      price_breakdown: p.price_breakdown,
      dimensions: p.dimensions,
      dimension_breakdown: p.dimension_breakdown,
      custom_dimensions_available: p.custom_dimensions_available,
      customisation_available: p.customisation_available,
      material: p.material,
      finish: p.finish,
      wood_options: p.wood_options,
      fabric_options: p.fabric_options,
      finish_options: p.finish_options,
      size_options: p.size_options ? p.size_options.map(s => ({ name: s.name, dimensions: s.dimensions })) : [],
      specs: p.specs,
      images: p.images,
      seo_title: p.seo_title,
      seo_description: p.seo_description,
      keywords: p.keywords,
      created_at: p.created_at,
      updated_at: p.updated_at,
    }));

    return NextResponse.json(publicProducts, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch products" }, { status: 500 });
  }
}
