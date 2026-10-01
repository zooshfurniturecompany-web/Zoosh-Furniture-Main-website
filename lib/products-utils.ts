import { adminDb, AdminProduct } from "@/lib/admin-db";

export interface PriceOption {
  label: string;
  price: number;
  note?: string;
}

export interface DimensionItem {
  label: string;
  size: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  images: string[];
  dimensions: string;
  material: string;
  finish: string;
  sku: string;
  featured?: boolean;
  display_order?: number;
  price?: number;
  startingPrice?: number;
  displayPrice?: boolean;
  pricingType?: "fixed" | "starting_from" | "on_request";
  priceBreakdown?: PriceOption[];
  fabric?: string;
  rattan?: string;
  dimensionBreakdown?: DimensionItem[];
  story: {
    inspiration: string;
    craftsmanship: string;
    comfort: string;
    materials: string;
    styles: string;
  };
  specs: {
    material: string;
    woodType: string;
    fabric: string;
    dimensions: string;
    weight: string;
    finish: string;
    assembly: string;
    warranty: string;
    customizable: boolean;
  };
  variants: {
    woods?: string[];
    colors?: string[];
    fabrics?: string[];
    sizes?: string[];
  };
  features: string[];
  lifestyleImages: string[];
  status?: string;
}

export function extractWoodFromDescriptionOrMaterial(desc?: string, material?: string): string {
  const d = (desc || "").toLowerCase();
  const m = (material || "").trim();

  // Detect exact single wood from product description
  if (d.includes("solid mahogany") || d.includes("mahogany wood") || d.includes("solid mahogany wood")) {
    return "Solid Mahogany Wood";
  }
  if (d.includes("solid ash") || d.includes("ash wood") || d.includes("solid ash wood")) {
    return "Solid Ash Wood";
  }
  if (d.includes("solid acacia") || d.includes("acacia wood") || d.includes("solid acacia wood")) {
    return "Solid Acacia Wood";
  }
  if (d.includes("solid oak") || d.includes("oak wood") || d.includes("solid oak wood")) {
    return "Solid Oak Wood";
  }
  if (d.includes("solid walnut") || d.includes("walnut wood") || d.includes("solid walnut wood")) {
    return "Solid Walnut Wood";
  }
  if (d.includes("solid teak") || d.includes("teakwood") || d.includes("teak wood") || d.includes("treated solid teakwood")) {
    return "Solid Teak Wood";
  }
  if (d.includes("molded plywood") || d.includes("plywood core") || d.includes("molded frame")) {
    return "Molded Plywood & Hardwood Frame";
  }

  // If material is clean and single
  if (m && !m.includes(",") && m !== "Solid Wood") {
    return m;
  }

  return "Solid Teak Wood";
}

export function getDynamicProductDetails(p: Partial<AdminProduct>) {
  const cat = (p.category_name || "").toLowerCase();
  const id = p.id || p.sku || "zsh-01";
  
  // Deterministic seed based on product ID
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);

  // 1. Story
  let story = {
    inspiration: "Inspired by the clean lines of mid-century Scandinavian architecture and modern minimalism, this piece aims to create a focal point of refined elegance.",
    craftsmanship: "Hand-crafted to order by master artisans, this piece features traditional mortise-and-tenon joints, hand-planed edges, and a meticulous multi-step finishing process.",
    comfort: "Ergonomically engineered for prolonged relaxation, utilizing premium foam densities and hand-tensioned suspension systems.",
    materials: "Sourced from sustainably harvested timbers selected for characterful grain profiles and structural strength.",
    styles: "Ideal for modern residential interiors, curated living spaces, and contemporary homes."
  };

  if (cat.includes("chair")) {
    story.inspiration = "Inspired by sculptural organic silhouettes, the design creates a fluid visual flow with a warm, embracing seat.";
  } else if (cat.includes("sofa")) {
    story.inspiration = "Designed around clean architectural proportions offering relaxed living comfort.";
  } else if (cat.includes("table") || cat.includes("dining")) {
    story.inspiration = "A study in architectural jointing and pure geometry, emphasizing solid hardwood stability.";
  }

  const singleWood = extractWoodFromDescriptionOrMaterial(
    p.full_description || p.short_description || (p as any).description,
    p.material
  );

  const rawFabric = (p.fabric_options && p.fabric_options.length > 0 && p.fabric_options[0]) || (p as any).fabric || "";
  const fabricVal = rawFabric && rawFabric !== "N/A" ? rawFabric : "";

  const specs = {
    material: singleWood,
    woodType: singleWood,
    fabric: fabricVal,
    dimensions: p.dimensions || "210 × 90 × 80 cm",
    weight: "Approx. 45-65 kg",
    finish: p.finish || "Melamine Matte Polish",
    assembly: "Delivered Fully Assembled / Minimal Leg Attachment",
    warranty: "5 Years Warranty",
    customizable: true,
  };

  const variants = {
    woods: [singleWood],
    colors: ["Natural Matte Polish", "Warm Walnut Polish"],
    fabrics: fabricVal ? [fabricVal] : [],
    sizes: ["Standard Catalog Dimension", "Custom Room Tailored Size"],
  };

  // 4. Bullet features
  const featuresList = [
    "Sustainably harvested and kiln-dried solid hardwood core",
    "Hand-finished protective matte sealer",
    "Reinforced joinery designed for longevity",
    "Custom dimensions available on request"
  ];

  // 5. Lifestyle Imagery fallback
  const lifestyleImages = [
    "/images/catalog/page_14_img_00.webp",
    "/images/catalog/page_15_img_00.webp",
    "/images/catalog/page_16_img_00.webp",
    "/images/catalog/page_17_img_00.webp"
  ];

  return {
    story,
    specs,
    variants,
    features: featuresList,
    lifestyleImages,
  };
}

export function transformAdminProductToProduct(p: AdminProduct): Product {
  const dynamic = getDynamicProductDetails(p);
  const primaryImg = p.images && p.images.length > 0 ? p.images[0] : "/images/products/sf001-1.jpg";
  const allImgs = p.images && p.images.length > 0 ? p.images : [primaryImg];

  const specificWood = extractWoodFromDescriptionOrMaterial(
    p.full_description || p.short_description || (p as any).description,
    p.material
  );

  const rawFabric = (p.fabric_options && p.fabric_options.length > 0 && p.fabric_options[0]) || (p as any).fabric || "";
  const fabricDisplay = rawFabric && rawFabric !== "N/A" && rawFabric !== "None" ? rawFabric : "";

  return {
    id: p.id,
    name: p.name,
    slug: p.slug || p.sku.toLowerCase(),
    category: p.category_name || "Living",
    description: p.full_description || p.short_description || (p as any).description || "",
    images: allImgs,
    dimensions: p.dimensions || "",
    material: specificWood,
    finish: p.finish || "Melamine Matt Polish",
    sku: p.sku,
    featured: p.featured ?? false,
    display_order: typeof p.display_order === "number" ? p.display_order : 9999,
    price: p.price,
    startingPrice: p.starting_price ?? p.price,
    displayPrice: p.display_price ?? true,
    pricingType: p.pricing_type || "fixed",
    priceBreakdown: p.price_breakdown as any,
    fabric: fabricDisplay,
    rattan: (p.specs?.["Rattan"] as string) || (p as any).rattan || "",
    dimensionBreakdown: (p.dimension_breakdown || (p as any).dimensionBreakdown) as any,
    story: {
      ...dynamic.story,
      ...(p.specs?.story ? (p.specs.story as any) : {})
    },
    specs: {
      material: specificWood,
      woodType: specificWood,
      fabric: fabricDisplay,
      dimensions: p.dimensions || dynamic.specs.dimensions,
      weight: (p.specs?.weight as string) || dynamic.specs.weight,
      finish: p.finish || dynamic.specs.finish,
      assembly: (p.specs?.assembly as string) || dynamic.specs.assembly,
      warranty: "5 Years Warranty",
      customizable: p.customisation_available ?? true
    },
    variants: {
      woods: [specificWood],
      colors: dynamic.variants.colors,
      fabrics: fabricDisplay ? [fabricDisplay] : [],
      sizes: p.size_options && p.size_options.length > 0 ? p.size_options.map(s => s.name) : dynamic.variants.sizes
    },
    features: dynamic.features,
    lifestyleImages: allImgs.slice(1).length > 0 ? allImgs.slice(1) : dynamic.lifestyleImages,
    status: p.status
  };
}

export function getAllProducts(): Product[] {
  const store = adminDb.getStore();
  const published = store.products.filter(p => p.status === "published");
  
  // Sort published products by display_order ascending, then created_at descending
  published.sort((a, b) => {
    const orderA = typeof a.display_order === "number" ? a.display_order : 9999;
    const orderB = typeof b.display_order === "number" ? b.display_order : 9999;
    if (orderA !== orderB) return orderA - orderB;
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
  });

  return published.map(transformAdminProductToProduct);
}

export function getFeaturedProducts(): Product[] {
  return getAllProducts().filter((product) => product.featured);
}

export function getProductBySlug(slug: string): Product | undefined {
  if (!slug) return undefined;
  
  const cleanSlug = slug.toLowerCase().replace(/_/g, "-");
  const normalizedSku = cleanSlug.replace(/[^a-z0-9]/g, "");
  
  const aliases: Record<string, string> = {
    "arc-lounge-chair": "ch001",
    "arc-lounge-composition": "ch001",
    "sculptural-boucle-armchair": "ch007",
    "linear-oak-dining-table": "dn001",
    "plinth-oak-bed-frame": "bd001",
    "travertine-bench": "cst001",
    "monolith-credenza": "cst007",
    "nouveau-modular-sofa": "sf001",
    "nouveau-l-shape-setup": "sf001"
  };

  const resolvedSlug = aliases[cleanSlug] || cleanSlug;
  const store = adminDb.getStore();

  const found = store.products.find(
    (product) => {
      const prodSlug = (product.slug || "").toLowerCase();
      const prodSku = (product.sku || "").toLowerCase();
      const prodId = (product.id || "").toLowerCase();
      const prodNameSlug = (product.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const cleanProdSku = prodSku.replace(/[^a-z0-9]/g, "");
      
      return (
        prodSlug === resolvedSlug ||
        prodSku === resolvedSlug ||
        prodId === resolvedSlug ||
        prodId === `zsh-${resolvedSlug}` ||
        prodNameSlug === resolvedSlug ||
        (normalizedSku.length > 0 && cleanProdSku === normalizedSku)
      );
    }
  );

  return found ? transformAdminProductToProduct(found) : undefined;
}

export function getCategories(): string[] {
  const all = getAllProducts();
  return Array.from(new Set(all.map((product) => product.category)));
}

export function getWhatsAppLink(productName: string, productSku?: string): string {
  const phoneNumber = "919567193992";
  const skuString = productSku ? ` (SKU: ${productSku})` : "";
  const message = `Hello ZOOSH,

I am interested in the product:

Product Name: ${productName}${skuString}

Please share:
• Price
• Available finishes
• Delivery details
• Availability

Thank you.`;

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export function getGeneralWhatsAppLink(type: "general" | "custom" = "general"): string {
  const phoneNumber = "919567193992";

  let message = "";
  if (type === "custom") {
    message = `Hello ZOOSH,
 
I am interested in your Custom Furniture services. I would like to schedule a design consultation to discuss custom options.
 
Please let me know how to proceed.
 
Thank you.`;
  } else {
    message = `Hello ZOOSH,
 
I have a question regarding your custom solid wood furniture collections.
 
Thank you.`;
  }

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export function getRoomAndSubcategory(category: string): { room: string; subcategory: string } {
  const cat = (category || "").toLowerCase();
  
  if (cat.includes("sofa")) return { room: "living", subcategory: "sofas" };
  if (cat.includes("lounge chair")) return { room: "living", subcategory: "lounge-chairs" };
  if (cat.includes("dining chair")) return { room: "dining", subcategory: "dining-chairs" };
  if (cat.includes("dining table")) return { room: "dining", subcategory: "dining-tables" };
  if (cat.includes("dining bench")) return { room: "dining", subcategory: "dining-benches" };
  if (cat.includes("bar stool")) return { room: "dining", subcategory: "bar-stools" };
  
  if (cat.includes("bed cot") || cat.includes("bed")) return { room: "bedroom", subcategory: "bed-cots" };
  if (cat.includes("side table") && cat.includes("bed")) return { room: "bedroom", subcategory: "bedside-tables" };
  if (cat.includes("bedside table") || cat.includes("nightstand")) return { room: "bedroom", subcategory: "bedside-tables" };
  if (cat.includes("bedroom chair")) return { room: "bedroom", subcategory: "bedroom-chairs" };
  if (cat.includes("bench") && cat.includes("bed")) return { room: "bedroom", subcategory: "benches" };
  
  if (cat.includes("console table") && cat.includes("entry")) return { room: "entryway", subcategory: "console-tables" };
  if (cat.includes("mirror")) return { room: "entryway", subcategory: "mirror-units" };
  if (cat.includes("bench") && cat.includes("entry")) return { room: "entryway", subcategory: "benches" };
  if (cat.includes("bench")) return { room: "entryway", subcategory: "benches" };
  
  if (cat.includes("side table")) return { room: "living", subcategory: "side-tables" };
  if (cat.includes("centre table") || cat.includes("coffee table")) return { room: "living", subcategory: "centre-tables" };
  if (cat.includes("console table")) return { room: "living", subcategory: "console-tables" };
  if (cat.includes("tv unit") || cat.includes("media") || cat.includes("cabinet") || cat.includes("shelving")) return { room: "living", subcategory: "console-tables" };
  if (cat.includes("chair")) return { room: "living", subcategory: "arm-chairs" };
  return { room: "living", subcategory: "sofas" };
}

export function getProductsByRoom(roomSlug: string): Product[] {
  const all = getAllProducts();
  return all.filter(p => getRoomAndSubcategory(p.category).room === roomSlug);
}

export function getProductsBySubcategory(roomSlug: string, subcategorySlug: string): Product[] {
  const all = getAllProducts();
  return all.filter(p => {
    const mapped = getRoomAndSubcategory(p.category);
    return mapped.room === roomSlug && mapped.subcategory === subcategorySlug;
  });
}
