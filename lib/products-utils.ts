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
  price?: number;
  fabric?: string;
  rattan?: string;
  priceBreakdown?: PriceOption[];
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
    inspiration: "Inspired by the clean lines of mid-century Scandinavian architecture and modern European minimalism, this piece aims to create a focal point of refined elegance in any contemporary living space.",
    craftsmanship: "Hand-crafted to order by master artisans, this piece features traditional mortise-and-tenon joints, hand-planed edges, and a meticulous multi-step finishing process that highlights the raw, organic beauty of the material.",
    comfort: "Ergonomically engineered for prolonged relaxation, utilizing premium foam densities, hand-tensioned suspension systems, and tailored linen or bouclé fabrics that feel exceptionally soft to the touch.",
    materials: "Sourced from sustainable forests and historic quarries, the raw solid timbers and natural Italian travertine elements are selected for their characterful grain profiles and structural strength.",
    styles: "Ideal for high-end modern residential projects, minimal urban lofts, gallery-style interiors, and contemporary editorial spaces."
  };

  if (cat.includes("chair")) {
    story.inspiration = "Inspired by sculptural organic silhouettes, the design creates a fluid visual flow. Its gentle curves mimic anatomical contours, creating a warm, embracing seat.";
    story.comfort = "Features high-density luxury foam cores wrapped in premium textured bouclé. Designed to support postural alignment while maintaining a soft, feather-like initial feel.";
  } else if (cat.includes("sofa")) {
    story.inspiration = "Designed around low-profile, modular architectural blocks, offering an editorial lounging scale. It sits low to the ground to keep interior sightlines open and fluid.";
    story.comfort = "Plush goose-down top layers combined with high-resiliency pocket springs. The heavy-weight linen upholstery feels incredibly cool and breathable throughout all seasons.";
  } else if (cat.includes("table") || cat.includes("dining")) {
    story.inspiration = "A study in architectural jointing and pure geometry. The monolithic legs support a heavy-set solid surface, emphasizing geological solidity and raw structural form.";
    story.comfort = "Perfect for hosting long gatherings, featuring smooth chamfered edges, generous leg clearance, and a matte wax sealer that invites tactile interaction.";
  }

  // 2. Specifications
  let fabricVal = "N/A";
  if (cat.includes("chair") || cat.includes("sofa")) {
    fabricVal = seed % 2 === 0 ? "Premium Linen-Cotton Blend" : "Cream Italian Bouclé";
  }

  const specs = {
    material: p.material || "Treated Solid Teakwood",
    woodType: "Solid Teak Wood",
    fabric: fabricVal,
    dimensions: p.dimensions || "210 × 90 × 80 cm",
    weight: "Approx. 45-65 kg",
    finish: p.finish || "Melamine Matte Polish",
    assembly: "Delivered Fully Assembled / Minimal Leg Attachment",
    warranty: "5-Year Frame Structural Warranty",
    customizable: true,
  };

  // 3. Variants
  const variants = {
    woods: ["Solid Teak Wood", "Premium Ash Wood", "Selected Mahogany Wood"],
    colors: ["Natural Matte Polish", "Warm Walnut Polish", "Smoked Charcoal"],
    fabrics: ["Cream Textured Bouclé", "Natural Linen Blend", "Slate Grey Velvet"],
    sizes: ["Standard Catalog Dimension", "Custom Room Tailored Size"],
  };

  // 4. Bullet features
  const featuresList = [
    "Sustainably harvested and kiln-dried A-grade hardwood core",
    "Hand-finished organic matte protective sealer",
    "Tailored commercial-grade stain-resistant luxury upholstery",
    "Reinforced joinery designed for generational structural longevity",
    "Custom dimensions and bespoke fabric alterations available on request"
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

  return {
    id: p.id,
    name: p.name,
    slug: p.slug || p.sku.toLowerCase(),
    category: p.category_name || "Living",
    description: p.full_description || p.short_description || "",
    images: allImgs,
    dimensions: p.dimensions || "",
    material: p.material || "Solid Wood",
    finish: p.finish || "Melamine Matt Polish",
    sku: p.sku,
    featured: p.featured ?? false,
    price: p.price,
    fabric: p.fabric_options?.[0] || "",
    rattan: (p.specs?.["Rattan"] as string) || "",
    priceBreakdown: p.price_breakdown as any,
    dimensionBreakdown: (p.dimension_breakdown || (p as any).dimensionBreakdown) as any,
    story: {
      ...dynamic.story,
      ...(p.specs?.story ? (p.specs.story as any) : {})
    },
    specs: {
      material: p.material || "Solid Wood",
      woodType: p.wood_options?.[0] || dynamic.specs.woodType,
      fabric: p.fabric_options?.[0] || dynamic.specs.fabric,
      dimensions: p.dimensions || dynamic.specs.dimensions,
      weight: (p.specs?.weight as string) || dynamic.specs.weight,
      finish: p.finish || dynamic.specs.finish,
      assembly: (p.specs?.assembly as string) || dynamic.specs.assembly,
      warranty: (p.specs?.warranty as string) || dynamic.specs.warranty,
      customizable: p.customisation_available ?? true
    },
    variants: {
      woods: p.wood_options && p.wood_options.length > 0 ? p.wood_options : dynamic.variants.woods,
      colors: dynamic.variants.colors,
      fabrics: p.fabric_options && p.fabric_options.length > 0 ? p.fabric_options : dynamic.variants.fabrics,
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
