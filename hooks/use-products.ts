import productsData from "@/data/products.json";

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
}

function getDynamicProductDetails(p: any) {
  const cat = (p.category || "").toLowerCase();
  const name = p.name || "";
  const id = p.id || "";
  
  // Deterministic seed based on product ID
  let hash = 0;
  const str = id;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);

  // 1. Story
  let story = {
    inspiration: `Inspired by the clean lines of mid-century Scandinavian architecture and modern European minimalism, this piece aims to create a focal point of refined elegance in any contemporary living space.`,
    craftsmanship: `Hand-crafted to order by master artisans, this piece features traditional mortise-and-tenon joints, hand-planed edges, and a meticulous multi-step finishing process that highlights the raw, organic beauty of the material.`,
    comfort: `Ergonomically engineered for prolonged relaxation, utilizing premium foam densities, hand-tensioned suspension systems, and tailored linen or bouclé fabrics that feel exceptionally soft to the touch.`,
    materials: `Sourced from sustainable forests and historic quarries, the raw solid timbers and natural Italian travertine elements are selected for their characterful grain profiles and structural strength.`,
    styles: `Ideal for high-end modern residential projects, minimal urban lofts, gallery-style interiors, and contemporary editorial spaces.`
  };

  if (cat.includes("chair")) {
    story.inspiration = `Inspired by sculptural organic silhouettes, the design creates a fluid visual flow. Its gentle curves mimic anatomical contours, creating a warm, embracing seat.`;
    story.comfort = `Features high-density luxury foam cores wrapped in premium textured bouclé. Designed to support postural alignment while maintaining a soft, feather-like initial feel.`;
  } else if (cat.includes("sofa")) {
    story.inspiration = `Designed around low-profile, modular architectural blocks, offering an editorial lounging scale. It sits low to the ground to keep interior sightlines open and fluid.`;
    story.comfort = `Plush goose-down top layers combined with high-resiliency pocket springs. The heavy-weight linen upholstery feels incredibly cool and breathable throughout all seasons.`;
  } else if (cat.includes("table") || cat.includes("dining")) {
    story.inspiration = `A study in architectural jointing and pure geometry. The monolithic legs support a heavy-set solid surface, emphasizing geological solidity and raw structural form.`;
    story.comfort = `Perfect for hosting long gatherings, featuring smooth chamfered edges, generous leg clearance, and a matte wax sealer that invites tactile interaction.`;
  }

  // 2. Specifications
  let fabricVal = "N/A";
  if (cat.includes("chair") || cat.includes("sofa")) {
    fabricVal = seed % 2 === 0 ? "Premium Linen-Cotton Blend" : "Cream Italian Bouclé";
  }

  let woodTypeVal = "N/A";
  if (p.material?.toLowerCase().includes("ash") || p.material?.toLowerCase().includes("oak")) woodTypeVal = "Premium Ash Wood";
  else if (p.material?.toLowerCase().includes("teak")) woodTypeVal = "Kerala Teak Wood";
  else if (p.material?.toLowerCase().includes("mahogany")) woodTypeVal = "Selected Mahogany";
  else if (p.material?.toLowerCase().includes("rattan") || p.material?.toLowerCase().includes("cane")) woodTypeVal = "Natural Rattan Cane & Teak";
  else woodTypeVal = "Kerala Teak Wood";

  const specs = {
    material: p.material || "Solid Wood",
    woodType: woodTypeVal,
    fabric: fabricVal,
    dimensions: p.dimensions || "90cm W x 90cm D x 75cm H",
    weight: `${25 + (seed % 35)} kg`,
    finish: p.finish || "Matte Organic Oil / Natural Honed",
    assembly: seed % 3 === 0 ? "None - Delivered fully assembled" : "Minimal assembly required (legs attachment)",
    warranty: "5-Year Structural Frame Warranty",
    customizable: true
  };

  // 3. Variants
  const woods = ["Natural Teak", "Aged Mahogany", "Natural Ash", "Charcoal Ash"];
  const colors = ["Ivory", "Oatmeal", "Charcoal", "Olive"];
  const fabrics = ["Textured Bouclé", "Raw Linen", "Premium Wool"];
  const sizes = ["Standard", "Grand", "Bespoke / Custom"];

  const variants = {
    woods: cat.includes("stone") || cat.includes("travertine") ? ["Travertine Stone", "Calacatta Marble"] : woods.slice(0, 2 + (seed % 3)),
    colors: colors.slice(0, 2 + (seed % 3)),
    fabrics: cat.includes("chair") || cat.includes("sofa") ? fabrics.slice(0, 2 + (seed % 2)) : undefined,
    sizes: sizes.slice(0, 2 + (seed % 2))
  };
  const featuresList = [
    "Premium Craftsmanship",
    "Solid Wood Structure",
    "Handmade Finish",
    "Tailored Details"
  ];
  if (cat.includes("chair") || cat.includes("sofa")) {
    featuresList.push("Long Lasting Upholstery");
  }
  featuresList.push("Customizable", "Made to Order");

  // 5. Lifestyle Images (from Unsplash portfolio)
  const lifestyleImages = [
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200"
  ];

  return {
    story,
    specs,
    variants,
    features: featuresList,
    lifestyleImages,
  };
}

function getDynamicProductImages(category: string, id: string, primaryImage: string): string[] {
  const cat = (category || "").toLowerCase();
  
  // Deterministic seed based on product ID
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);

  // Set of premium Unsplash images per category
  let secondaryPool: string[] = [];

  if (cat.includes("chair")) {
    secondaryPool = [
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=800",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=800",
      "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=800",
      "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?q=80&w=800",
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800"
    ];
  } else if (cat.includes("table") || cat.includes("dining") || cat.includes("bench")) {
    secondaryPool = [
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?q=80&w=800",
      "https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=800",
      "https://images.unsplash.com/photo-1581428982868-e410dd047a90?q=80&w=800",
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800"
    ];
  } else if (cat.includes("bed") || cat.includes("bedroom")) {
    secondaryPool = [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800"
    ];
  } else if (cat.includes("console") || cat.includes("credenza") || cat.includes("cabinet") || cat.includes("storage") || cat.includes("living")) {
    secondaryPool = [
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=800",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800",
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800"
    ];
  } else if (cat.includes("sofa")) {
    secondaryPool = [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=800",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800"
    ];
  } else {
    secondaryPool = [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800"
    ];
  }

  const filteredPool = secondaryPool.filter(img => img !== primaryImage);
  const secondaryImages: string[] = [];
  const poolLen = filteredPool.length;
  
  if (poolLen > 0) {
    for (let i = 0; i < Math.min(3, poolLen); i++) {
      const targetIdx = (seed + i) % poolLen;
      const img = filteredPool[targetIdx];
      if (!secondaryImages.includes(img)) {
        secondaryImages.push(img);
      }
    }
  }

  return [primaryImage, ...secondaryImages];
}

const PRODUCTS: Product[] = (productsData as any[]).map((p) => {
  const id = p.id || `zsh-${p.sku?.toLowerCase()}`;
  const category = p.category || "General";
  const primaryImage = p.images?.[0] || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800";
  const resolvedImages = (p.images && p.images.length > 0) ? p.images : [primaryImage];
  const dynamicDetails = getDynamicProductDetails(p);
  
  return {
    id,
    name: p.name,
    slug: p.slug || p.sku?.toLowerCase() || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    category,
    description: p.description || "",
    images: resolvedImages,
    dimensions: p.dimensions || "",
    material: p.material || p.wood_type || "",
    finish: p.finish || "Natural Polish",
    sku: p.sku || p.product_code || "",
    featured: p.featured || false,
    price: p.price,
    fabric: p.fabric || (dynamicDetails as any).specs?.fabric || "",
    rattan: p.rattan || "",
    priceBreakdown: p.priceBreakdown || null,
    dimensionBreakdown: p.dimensionBreakdown || null,
    ...dynamicDetails
  };
});

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((product) => product.featured);
}

export function getProductBySlug(slug: string): Product | undefined {
  if (!slug) return undefined;
  
  const cleanSlug = slug.toLowerCase().replace(/_/g, "-");
  
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

  return PRODUCTS.find(
    (product) => 
      product.slug.toLowerCase() === resolvedSlug || 
      product.sku.toLowerCase() === resolvedSlug ||
      product.id.toLowerCase() === resolvedSlug
  );
}

export function getCategories(): string[] {
  return Array.from(new Set(PRODUCTS.map((product) => product.category)));
}

export function getWhatsAppLink(productName: string, productSku?: string): string {
  const phoneNumber = "919567193992"; // Custom contact phone number

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

/**
 * Generates a general custom enquiry WhatsApp link
 */
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
  
  // SOFAS
  if (cat.includes("sofa")) {
    return { room: "living", subcategory: "sofas" };
  }
  // LOUNGE & ARM CHAIRS
  if (cat.includes("lounge chair")) {
    return { room: "living", subcategory: "lounge-chairs" };
  }
  if (cat.includes("dining chair")) {
    return { room: "dining", subcategory: "dining-chairs" };
  }
  if (cat.includes("dining table")) {
    return { room: "dining", subcategory: "dining-tables" };
  }
  if (cat.includes("dining bench")) {
    return { room: "dining", subcategory: "dining-benches" };
  }
  if (cat.includes("bar stool")) {
    return { room: "dining", subcategory: "bar-stools" };
  }
  
  // BEDROOM
  if (cat.includes("bed cot") || cat.includes("bed")) {
    return { room: "bedroom", subcategory: "bed-cots" };
  }
  if (cat.includes("side table") && cat.includes("bed")) {
    return { room: "bedroom", subcategory: "bedside-tables" };
  }
  if (cat.includes("bedside table") || cat.includes("nightstand")) {
    return { room: "bedroom", subcategory: "bedside-tables" };
  }
  if (cat.includes("bedroom chair")) {
    return { room: "bedroom", subcategory: "bedroom-chairs" };
  }
  if (cat.includes("bench") && cat.includes("bed")) {
    return { room: "bedroom", subcategory: "benches" };
  }
  
  // ENTRYWAY
  if (cat.includes("console table") && cat.includes("entry")) {
    return { room: "entryway", subcategory: "console-tables" };
  }
  if (cat.includes("mirror")) {
    return { room: "entryway", subcategory: "mirror-units" };
  }
  if (cat.includes("bench") && cat.includes("entry")) {
    return { room: "entryway", subcategory: "benches" };
  }
  if (cat.includes("bench")) {
    return { room: "entryway", subcategory: "benches" };
  }
  
  // FALLBACKS / OTHER LIVING
  if (cat.includes("side table")) {
    return { room: "living", subcategory: "side-tables" };
  }
  if (cat.includes("centre table") || cat.includes("coffee table")) {
    return { room: "living", subcategory: "centre-tables" };
  }
  if (cat.includes("console table")) {
    return { room: "living", subcategory: "console-tables" };
  }
  if (cat.includes("tv unit") || cat.includes("media") || cat.includes("cabinet") || cat.includes("shelving")) {
    return { room: "living", subcategory: "console-tables" };
  }
  if (cat.includes("chair")) {
    return { room: "living", subcategory: "arm-chairs" };
  }
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

