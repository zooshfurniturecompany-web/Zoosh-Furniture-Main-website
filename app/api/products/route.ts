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

    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch products" }, { status: 500 });
  }
}
