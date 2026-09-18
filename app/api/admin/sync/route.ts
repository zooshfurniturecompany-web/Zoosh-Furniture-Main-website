import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminDb, AdminProduct } from "@/lib/admin-db";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const store = adminDb.getStore();
    return NextResponse.json(store, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch store" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { store, action, product, category, collection, woodType, fabricType, otherMaterial, settings } = body;

    // 1. If full store is synced
    if (store) {
      adminDb.syncStore(store);
    }

    // 2. Direct single-entity mutations
    if (action === "save_product" && product) {
      await adminDb.saveProduct(product);
    } else if (action === "delete_product" && product?.id) {
      await adminDb.deleteProduct(product.id);
    } else if (action === "toggle_publish" && product?.id) {
      await adminDb.togglePublish(product.id);
    } else if (action === "archive_product" && product?.id) {
      await adminDb.archiveProduct(product.id);
    } else if (action === "save_category" && category) {
      await adminDb.saveCategory(category);
    } else if (action === "delete_category" && category?.id) {
      await adminDb.deleteCategory(category.id);
    } else if (action === "save_collection" && collection) {
      await adminDb.saveCollection(collection);
    } else if (action === "delete_collection" && collection?.id) {
      await adminDb.deleteCollection(collection.id);
    } else if (action === "save_wood" && woodType) {
      await adminDb.saveWoodType(woodType);
    } else if (action === "delete_wood" && woodType?.id) {
      await adminDb.deleteWoodType(woodType.id);
    } else if (action === "save_fabric" && fabricType) {
      await adminDb.saveFabricType(fabricType);
    } else if (action === "delete_fabric" && fabricType?.id) {
      await adminDb.deleteFabricType(fabricType.id);
    } else if (action === "save_settings" && settings) {
      await adminDb.saveSettings(settings);
    }

    // 3. Purge Next.js / Vercel cache across all storefront pages
    try {
      revalidatePath("/", "layout");
      revalidatePath("/[room]", "page");
      revalidatePath("/[room]/[subcategory]", "page");
      revalidatePath("/products/[slug]", "page");
      revalidatePath("/collection", "page");
      revalidatePath("/search", "page");
      revalidatePath("/custom", "page");
      revalidatePath("/about", "page");
      revalidatePath("/contact", "page");
    } catch (cacheErr) {
      console.warn("revalidatePath notice:", cacheErr);
    }

    return NextResponse.json({ success: true, timestamp: Date.now() }, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: any) {
    console.error("API sync error:", err);
    return NextResponse.json({ error: err.message || "Sync failed" }, { status: 500 });
  }
}
