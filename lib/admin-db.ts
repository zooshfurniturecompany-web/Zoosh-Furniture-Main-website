import { supabase, isSupabaseConfigured } from "./supabase";

export interface AdminProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category_id?: string;
  category_name: string;
  collection_id?: string;
  collection_name?: string;
  short_description: string;
  full_description: string;
  status: "published" | "draft" | "archived";
  featured: boolean;
  
  // Pricing
  pricing_type: "fixed" | "starting_from" | "on_request";
  price: number;
  starting_price?: number;
  display_price: boolean;
  price_breakdown?: Array<{ label: string; price: number; note?: string }>;
  
  // Specs & Dimensions
  dimensions: string;
  dimension_breakdown?: Array<{ label: string; size: string }>;
  custom_dimensions_available: boolean;
  customisation_available: boolean;
  material: string;
  finish: string;
  
  // Customization Options
  wood_options: string[];
  fabric_options: string[];
  finish_options: string[];
  size_options?: Array<{ name: string; dimensions: string; price_adjustment?: number }>;
  specs: Record<string, string | boolean>;
  
  // Images
  images: string[];
  
  // SEO
  seo_title?: string;
  seo_description?: string;
  keywords?: string[];
  
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  room_slug: "living" | "dining" | "bedroom" | "entryway" | "custom";
  description: string;
  image_url: string;
  display_order: number;
  status: "active" | "archived";
  created_at: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
  status: "active" | "archived";
  created_at: string;
}

export interface WoodType {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_available: boolean;
  display_order: number;
  created_at: string;
}

export interface FabricType {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_available: boolean;
  display_order: number;
  created_at: string;
}

export interface OtherMaterial {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  image_url: string;
  is_available: boolean;
  display_order: number;
  created_at: string;
}

export interface WebsiteSettings {
  contact_phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  currency: string;
  default_seo_title: string;
  default_seo_description: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "editor";
  created_at: string;
}

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  size?: string;
  created_at: string;
}

// ==========================================
// DEFAULT SEED DATA
// ==========================================

const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Sofas", slug: "sofas", room_slug: "living", description: "Bespoke handcrafted 3-seater, 2-seater, and sectional sofas", image_url: "/images/catalog/page_14_img_00.webp", display_order: 1, status: "active", created_at: new Date().toISOString() },
  { id: "cat-2", name: "Lounge Chairs", slug: "lounge-chairs", room_slug: "living", description: "Sculptural accent and lounge chairs", image_url: "/images/catalog/page_15_img_00.webp", display_order: 2, status: "active", created_at: new Date().toISOString() },
  { id: "cat-3", name: "Arm Chairs", slug: "arm-chairs", room_slug: "living", description: "Comfortable ergonomic solid wood arm chairs", image_url: "/images/catalog/page_16_img_00.webp", display_order: 3, status: "active", created_at: new Date().toISOString() },
  { id: "cat-4", name: "Centre Tables", slug: "centre-tables", room_slug: "living", description: "Solid wood and organic stone centre tables", image_url: "/images/catalog/page_17_img_00.webp", display_order: 4, status: "active", created_at: new Date().toISOString() },
  { id: "cat-5", name: "Side Tables", slug: "side-tables", room_slug: "living", description: "Accent side tables and plinths", image_url: "/images/catalog/page_18_img_00.webp", display_order: 5, status: "active", created_at: new Date().toISOString() },
  { id: "cat-6", name: "Console Tables", slug: "console-tables", room_slug: "entryway", description: "Architectural entryway and living console tables", image_url: "/images/catalog/page_27_img_00.webp", display_order: 6, status: "active", created_at: new Date().toISOString() },
  { id: "cat-7", name: "Dining Tables", slug: "dining-tables", room_slug: "dining", description: "Grand handcrafted solid timber dining tables", image_url: "/images/catalog/page_21_img_00.webp", display_order: 7, status: "active", created_at: new Date().toISOString() },
  { id: "cat-8", name: "Dining Chairs", slug: "dining-chairs", room_slug: "dining", description: "Ergonomic wood and woven cane dining chairs", image_url: "/images/catalog/page_23_img_00.webp", display_order: 8, status: "active", created_at: new Date().toISOString() },
  { id: "cat-9", name: "Bed Cots", slug: "bed-cots", room_slug: "bedroom", description: "Solid wood plinth beds with floating nightstands", image_url: "/images/catalog/page_22_img_00.webp", display_order: 9, status: "active", created_at: new Date().toISOString() },
  { id: "cat-10", name: "Benches", slug: "benches", room_slug: "entryway", description: "Solid wood and upholstered entryway benches", image_url: "/images/catalog/page_24_img_00.webp", display_order: 10, status: "active", created_at: new Date().toISOString() }
];

const DEFAULT_COLLECTIONS: Collection[] = [
  { id: "col-1", name: "Solid Teakwood Heritage", slug: "solid-teakwood-heritage", description: "Handcrafted from seasoned Kerala teakwood with traditional mortise-and-tenon joinery", image_url: "/images/products/sf001-1.jpg", display_order: 1, status: "active", created_at: new Date().toISOString() },
  { id: "col-2", name: "Organic Sculptural Bouclé", slug: "organic-sculptural-boucle", description: "Curved architectural silhouettes wrapped in sumptuous textured bouclé", image_url: "/images/products/sf001-2.jpg", display_order: 2, status: "active", created_at: new Date().toISOString() },
  { id: "col-3", name: "Modern Ash & Cane", slug: "modern-ash-cane", description: "Clean Scandinavian lines blending treated ash wood with natural woven cane", image_url: "/images/products/sf004-1.jpg", display_order: 3, status: "active", created_at: new Date().toISOString() },
  { id: "col-4", name: "Classic Spindle Mahogany", slug: "classic-spindle-mahogany", description: "Refined linear spindle woodwork in warm mahogany tones", image_url: "/images/products/sf003-1.jpg", display_order: 4, status: "active", created_at: new Date().toISOString() }
];

const DEFAULT_WOOD_TYPES: WoodType[] = [
  { id: "wood-1", name: "Solid Teak Wood", slug: "solid-teak-wood", description: "Premium seasoned Kerala teak known for unmatched grain depth and lifetime durability", image_url: "/images/products/sf001-1.jpg", is_available: true, display_order: 1, created_at: new Date().toISOString() },
  { id: "wood-2", name: "Premium Ash Wood", slug: "premium-ash-wood", description: "Light-toned hardwood with expressive modern cathedral grain patterns", image_url: "/images/products/sf002-1.jpg", is_available: true, display_order: 2, created_at: new Date().toISOString() },
  { id: "wood-3", name: "Selected Mahogany Wood", slug: "selected-mahogany-wood", description: "Dense hardwood offering rich reddish-brown luster and high tensile strength", image_url: "/images/products/sf003-1.jpg", is_available: true, display_order: 3, created_at: new Date().toISOString() }
];

const DEFAULT_FABRIC_TYPES: FabricType[] = [
  { id: "fab-1", name: "Cream Textured Bouclé", slug: "cream-textured-boucle", description: "Heavyweight looped bouclé with a soft tactile feel (₹700/m grade)", image_url: "/images/products/sf001-2.jpg", is_available: true, display_order: 1, created_at: new Date().toISOString() },
  { id: "fab-2", name: "Natural Linen-Cotton Blend", slug: "natural-linen-cotton", description: "Breathable textured linen blend available in warm oatmeal, cream, and sand", image_url: "/images/products/sf002-1.jpg", is_available: true, display_order: 2, created_at: new Date().toISOString() },
  { id: "fab-3", name: "Royal Indigo Blue Weave", slug: "royal-indigo-blue-weave", description: "Vibrant jewel-tone woven upholstery with stain-resistant coating", image_url: "/images/products/sf004-1.jpg", is_available: true, display_order: 3, created_at: new Date().toISOString() },
  { id: "fab-4", name: "Slate Grey Plush Velvet", slug: "slate-grey-plush-velvet", description: "High-density micro-velvet with matte sheen and luxurious hand-feel", image_url: "/images/products/sf001-3.jpg", is_available: true, display_order: 4, created_at: new Date().toISOString() }
];

const DEFAULT_OTHER_MATERIALS: OtherMaterial[] = [
  { id: "mat-1", name: "Natural Hand-Woven Rattan Cane", slug: "natural-rattan-cane", category: "Cane/Rattan", description: "Sustainable natural cane woven in traditional hexagonal pattern", image_url: "/images/products/sf001-1.jpg", is_available: true, display_order: 1, created_at: new Date().toISOString() },
  { id: "mat-2", name: "Brushed Brass Inlays", slug: "brushed-brass-inlays", category: "Metal/Brass", description: "Architectural satin brass trim and corner capping", image_url: "", is_available: true, display_order: 2, created_at: new Date().toISOString() },
  { id: "mat-3", name: "Honed Italian Travertine", slug: "honed-italian-travertine", category: "Stone/Marble", description: "Organic vein-cut natural travertine stone slabs", image_url: "", is_available: true, display_order: 3, created_at: new Date().toISOString() }
];

const DEFAULT_SETTINGS: WebsiteSettings = {
  contact_phone: "+91 95671 93992",
  whatsapp_number: "919567193992",
  email: "zooshfurniturecompany@gmail.com",
  address: "ZOOSH Factory Workshop, Pattambi, Palakkad, Kerala 679303",
  currency: "INR",
  default_seo_title: "ZOOSH | Premium Custom Solid Wood Furniture | Kerala",
  default_seo_description: "ZOOSH is a premium factory-direct custom furniture manufacturer based in Pattambi, Palakkad, Kerala. Bespoke solid wood furniture made to order."
};

const DEFAULT_ADMIN_USERS: AdminUser[] = [
  { id: "usr-1", email: "admin@zoosh.in", name: "Zoosh Admin", role: "admin", created_at: new Date().toISOString() }
];

const INITIAL_FALLBACK_PRODUCTS: AdminProduct[] = [
  {
    id: "zsh-sf001",
    sku: "SF001",
    name: "Nouveau Modular Sectional Sofa",
    slug: "nouveau-modular-sectional-sofa",
    category_name: "Three Seater Sofa",
    collection_id: "col-1",
    collection_name: "Solid Teakwood Heritage",
    short_description: "Architectural low-profile sectional crafted with solid teak wood framing and premium textured bouclé upholstery.",
    full_description: "The Nouveau Modular Sectional Sofa is designed for open-plan modern living. Built with seasoned Kerala teakwood and high-density foam cores wrapped in feather-touch looped bouclé.",
    status: "published",
    featured: true,
    pricing_type: "fixed",
    price: 54000,
    starting_price: 54000,
    display_price: true,
    dimensions: "280cm W × 160cm D × 75cm H",
    material: "Treated Solid Teakwood & Bouclé",
    finish: "Natural Melamine Matt Polish",
    wood_options: ["Solid Teak Wood", "Premium Ash Wood", "Selected Mahogany Wood"],
    fabric_options: ["Cream Textured Bouclé", "Natural Linen Blend", "Slate Grey Velvet"],
    finish_options: ["Natural Matt Polish", "Warm Walnut Polish"],
    specs: {
      "Wood Type": "Treated Solid Teakwood & Bouclé",
      "Finish": "Natural Melamine Matt Polish",
      "Warranty": "5-Year Frame Structural Warranty",
      "Assembly": "Delivered Fully Assembled"
    },
    images: [
      "/images/products/sf001-1.jpg",
      "/images/products/sf001-2.jpg",
      "/images/products/sf001-3.jpg"
    ],
    custom_dimensions_available: true,
    customisation_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "zsh-sf002",
    sku: "SF002",
    name: "Linear Frame Ash Lounge Chair",
    slug: "linear-frame-ash-lounge-chair",
    category_name: "Lounge Chair",
    collection_id: "col-3",
    collection_name: "Modern Ash & Cane",
    short_description: "Minimalist Japanese-Scandinavian inspired lounge chair with treated Canadian ash wood frame and natural cane weave.",
    full_description: "Clean linear geometry combined with ergonomic backrest angle. Hand-finished with natural hardwax oil to preserve the cathedral grain of solid ash wood.",
    status: "published",
    featured: true,
    pricing_type: "fixed",
    price: 24500,
    starting_price: 24500,
    display_price: true,
    dimensions: "78cm W × 82cm D × 74cm H",
    material: "Canadian Ash Wood & Natural Rattan",
    finish: "Organic Hardwax Oil Polish",
    wood_options: ["Premium Ash Wood", "Solid Teak Wood"],
    fabric_options: ["Oatmeal Linen", "Cream Bouclé"],
    finish_options: ["Natural Ash Polish", "Smoked Charcoal"],
    specs: {
      "Wood Type": "Canadian Ash Wood & Natural Rattan",
      "Finish": "Organic Hardwax Oil Polish",
      "Warranty": "5-Year Frame Structural Warranty",
      "Assembly": "Delivered Fully Assembled"
    },
    images: [
      "/images/products/sf002-1.jpg",
      "/images/products/sf002-2.jpg"
    ],
    custom_dimensions_available: true,
    customisation_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "zsh-sf003",
    sku: "SF003",
    name: "Atelier Solid Teak Dining Table",
    slug: "atelier-solid-teak-dining-table",
    category_name: "Dining Table",
    collection_id: "col-1",
    collection_name: "Solid Teakwood Heritage",
    short_description: "Monumental solid teak dining table with chamfered edge profiles and sculpted monolithic trestle base.",
    full_description: "Crafted from seasoned plantation teak planks. Seats 6 to 8 people with expansive legroom and a tactile matte sealer finish.",
    status: "published",
    featured: true,
    pricing_type: "fixed",
    price: 48000,
    starting_price: 48000,
    display_price: true,
    dimensions: "210cm W × 95cm D × 76cm H",
    material: "Solid Kerala Teak Wood",
    finish: "Melamine Matte Sealer",
    wood_options: ["Solid Teak Wood", "Selected Mahogany Wood"],
    fabric_options: [],
    finish_options: ["Natural Teak Matt", "Smoked Walnut"],
    specs: {
      "Wood Type": "Solid Kerala Teak Wood",
      "Finish": "Melamine Matte Sealer",
      "Warranty": "5-Year Frame Structural Warranty",
      "Assembly": "Delivered Fully Assembled"
    },
    images: [
      "/images/products/sf003-1.jpg",
      "/images/products/sf003-2.jpg"
    ],
    custom_dimensions_available: true,
    customisation_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "zsh-sf004",
    sku: "SF004",
    name: "Cane Back Dining Chair (Set of 2)",
    slug: "cane-back-dining-chair-set-of-2",
    category_name: "Dining Chair",
    collection_id: "col-3",
    collection_name: "Modern Ash & Cane",
    short_description: "Refined solid wood dining chair featuring hand-woven radio cane backrest and high-density upholstered seat.",
    full_description: "Lightweight yet structurally reinforced with mortise-and-tenon joints. Designed to complement any modern dining setting.",
    status: "published",
    featured: true,
    pricing_type: "fixed",
    price: 18500,
    starting_price: 18500,
    display_price: true,
    dimensions: "52cm W × 55cm D × 82cm H",
    material: "Solid Teak & Natural Rattan Cane",
    finish: "Melamine Matt Polish",
    wood_options: ["Solid Teak Wood", "Premium Ash Wood"],
    fabric_options: ["Natural Sand Linen", "Oatmeal Bouclé"],
    finish_options: ["Natural Matt", "Walnut Finish"],
    specs: {
      "Wood Type": "Solid Teak & Natural Rattan Cane",
      "Finish": "Melamine Matt Polish",
      "Warranty": "5-Year Frame Structural Warranty",
      "Assembly": "Delivered Fully Assembled"
    },
    images: [
      "/images/products/sf004-1.jpg",
      "/images/products/sf004-2.jpg"
    ],
    custom_dimensions_available: true,
    customisation_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "zsh-sf005",
    sku: "SF005",
    name: "Sculptural Low Platform Bed Cot",
    slug: "sculptural-low-platform-bed-cot",
    category_name: "Bed Cot",
    collection_id: "col-1",
    collection_name: "Solid Teakwood Heritage",
    short_description: "Low-profile solid teak platform bed cot with integrated floating cantilevered side ledges.",
    full_description: "Heavy-gauge solid teak headboard with subtle radius bevels. Engineered with rigid slat system for optimum mattress support.",
    status: "published",
    featured: true,
    pricing_type: "fixed",
    price: 62000,
    starting_price: 62000,
    display_price: true,
    dimensions: "195cm W × 215cm L × 90cm H (King Size)",
    material: "Solid Seasoned Kerala Teak",
    finish: "Natural Matt Polish",
    wood_options: ["Solid Teak Wood", "Canadian Ash Wood"],
    fabric_options: [],
    finish_options: ["Natural Teak Matt", "Warm Walnut Polish"],
    specs: {
      "Wood Type": "Solid Seasoned Kerala Teak",
      "Finish": "Natural Matt Polish",
      "Warranty": "5-Year Frame Structural Warranty",
      "Assembly": "Delivered Fully Assembled"
    },
    images: [
      "/images/products/sf005-1.jpg",
      "/images/products/sf005-2.jpg"
    ],
    custom_dimensions_available: true,
    customisation_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// ==========================================
// STORE STATE
// ==========================================

let store = {
  products: [...INITIAL_FALLBACK_PRODUCTS],
  categories: DEFAULT_CATEGORIES,
  collections: DEFAULT_COLLECTIONS,
  woodTypes: DEFAULT_WOOD_TYPES,
  fabricTypes: DEFAULT_FABRIC_TYPES,
  otherMaterials: DEFAULT_OTHER_MATERIALS,
  settings: DEFAULT_SETTINGS,
  users: DEFAULT_ADMIN_USERS,
  media: [] as MediaItem[]
};

// Populate initial media from fallback product images
const initialMediaList: MediaItem[] = [];
store.products.forEach(p => {
  p.images.forEach((url, i) => {
    if (!initialMediaList.find(m => m.url === url)) {
      initialMediaList.push({
        id: `media-${initialMediaList.length + 1}`,
        url,
        name: `${p.sku}-${i + 1}.jpg`,
        size: "4:5 Portrait Ratio",
        created_at: p.created_at
      });
    }
  });
});
store.media = initialMediaList;

// Client-side synchronization
if (typeof window !== "undefined") {
  const saved = localStorage.getItem("zoosh_admin_store_v3");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.products && parsed.products.length > 0) {
        store = { ...store, ...parsed };
      }
    } catch (e) {
      console.error("Failed to parse zoosh_admin_store_v3", e);
    }
  }
}

function persistStore() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("zoosh_admin_store_v3", JSON.stringify(store));
      window.dispatchEvent(new CustomEvent("zoosh_store_updated", { detail: { timestamp: Date.now() } }));
    } catch (e) {
      console.error("Failed to persist store to localStorage", e);
    }
  }
}

// ==========================================
// ADMIN DATABASE SERVICE
// ==========================================

export const adminDb = {
  getStore() {
    return store;
  },

  syncStore(partialStore: Partial<typeof store>) {
    store = { ...store, ...partialStore };
    persistStore();
    return store;
  },
  // PRODUCTS
  async getProducts(filters?: {
    search?: string;
    category?: string;
    collection?: string;
    status?: string;
    featured?: boolean;
    sort?: string;
  }): Promise<AdminProduct[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from("products").select("*");
        if (filters?.status && filters.status !== "all") query = query.eq("status", filters.status);
        if (filters?.featured !== undefined) query = query.eq("featured", filters.featured);
        if (filters?.category && filters.category !== "all") query = query.eq("category_name", filters.category);
        if (filters?.collection && filters.collection !== "all") query = query.eq("collection_id", filters.collection);
        if (filters?.search) {
          query = query.or(`name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%,material.ilike.%${filters.search}%`);
        }
        query = query.order("created_at", { ascending: false });
        const { data, error } = await query;
        if (!error && Array.isArray(data)) {
          if (!filters || Object.keys(filters).length === 0 || (Object.keys(filters).length === 1 && filters.status === "published")) {
            store.products = data as AdminProduct[];
          }
          return data as AdminProduct[];
        }
      } catch (err) {
        console.warn("Supabase products fetch fallback to memory store:", err);
      }
    }

    let list = [...store.products];
    if (filters?.status && filters.status !== "all") {
      list = list.filter(p => p.status === filters.status);
    }
    if (filters?.featured !== undefined) {
      list = list.filter(p => p.featured === filters.featured);
    }
    if (filters?.category && filters.category !== "all") {
      list = list.filter(p => p.category_name.toLowerCase() === filters.category!.toLowerCase());
    }
    if (filters?.collection && filters.collection !== "all") {
      list = list.filter(p => p.collection_id === filters.collection || p.collection_name?.toLowerCase() === filters.collection!.toLowerCase());
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.sku.toLowerCase().includes(q) || 
        p.material.toLowerCase().includes(q) ||
        p.category_name.toLowerCase().includes(q)
      );
    }

    if (filters?.sort) {
      if (filters.sort === "price-low") list.sort((a, b) => (a.price || 0) - (b.price || 0));
      else if (filters.sort === "price-high") list.sort((a, b) => (b.price || 0) - (a.price || 0));
      else if (filters.sort === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));
      else if (filters.sort === "sku-asc") list.sort((a, b) => a.sku.localeCompare(b.sku));
      else list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return list;
  },

  async getProductById(id: string): Promise<AdminProduct | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from("products").select("*").or(`id.eq.${id},sku.eq.${id},slug.eq.${id}`).single();
        if (!error && data) return data as AdminProduct;
      } catch (e) {}
    }
    return store.products.find(p => p.id === id || p.sku.toLowerCase() === id.toLowerCase() || p.slug.toLowerCase() === id.toLowerCase()) || null;
  },

  async saveProduct(product: Partial<AdminProduct>): Promise<AdminProduct> {
    const id = product.id || `zsh-${product.sku?.toLowerCase() || Date.now()}`;
    const sku = product.sku || `SF${String(store.products.length + 1).padStart(3, "0")}`;
    const slug = product.slug || sku.toLowerCase();
    
    const savedItem: AdminProduct = {
      id,
      sku,
      name: product.name || "Untitled Product",
      slug,
      category_id: product.category_id,
      category_name: product.category_name || "Three Seater Sofa",
      collection_id: product.collection_id,
      collection_name: product.collection_name,
      short_description: product.short_description || "",
      full_description: product.full_description || "",
      status: product.status || "published",
      featured: product.featured ?? false,
      pricing_type: product.pricing_type || "fixed",
      price: product.price ?? 0,
      starting_price: product.starting_price ?? product.price,
      display_price: product.display_price ?? true,
      price_breakdown: product.price_breakdown || [],
      dimensions: product.dimensions || "",
      dimension_breakdown: product.dimension_breakdown || [],
      custom_dimensions_available: product.custom_dimensions_available ?? true,
      customisation_available: product.customisation_available ?? true,
      material: product.material || "Solid Wood",
      finish: product.finish || "Matt Polish",
      wood_options: product.wood_options || ["Solid Teak Wood", "Premium Ash Wood", "Selected Mahogany Wood"],
      fabric_options: product.fabric_options || ["Cream Textured Bouclé", "Natural Linen Blend"],
      finish_options: product.finish_options || ["Natural Matt Polish"],
      size_options: product.size_options || [],
      specs: product.specs || {
        "Wood Type": product.material || "Solid Wood",
        "Finish": product.finish || "Matt Polish",
        "Warranty": "5-Year Frame Structural Warranty",
        "Assembly": "Delivered Fully Assembled"
      },
      images: product.images && product.images.length > 0 ? product.images : ["/images/products/sf001-1.jpg"],
      seo_title: product.seo_title || `${product.name} | ZOOSH`,
      seo_description: product.seo_description || product.short_description || "",
      keywords: product.keywords || [],
      created_at: product.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from("products").upsert([savedItem], { onConflict: "id" });
        if (error) {
          console.warn("Supabase upsert by ID warning, trying SKU conflict resolution:", error);
          await supabase.from("products").upsert([savedItem], { onConflict: "sku" });
        }
      } catch (err) {
        console.error("Supabase saveProduct error:", err);
      }
    }

    const idx = store.products.findIndex(p => p.id === id || p.sku === sku);
    if (idx !== -1) store.products[idx] = savedItem;
    else store.products.unshift(savedItem);

    // Register images to media library
    savedItem.images.forEach((url, i) => {
      if (!store.media.find(m => m.url === url)) {
        store.media.unshift({
          id: `media-${Date.now()}-${i}`,
          url,
          name: `${savedItem.sku}-${i + 1}.jpg`,
          created_at: new Date().toISOString()
        });
      }
    });

    persistStore();

    // Trigger server-side cache revalidation
    if (typeof window !== "undefined") {
      fetch("/api/admin/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_product", product: savedItem }),
      }).catch(() => {});
    }

    return savedItem;
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("products").delete().or(`id.eq.${id},sku.eq.${id}`);
      } catch (err) {
        console.error("Supabase deleteProduct error:", err);
      }
    }
    store.products = store.products.filter(p => p.id !== id && p.sku !== id);
    persistStore();

    if (typeof window !== "undefined") {
      fetch("/api/admin/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_product", product: { id } }),
      }).catch(() => {});
    }
    return true;
  },

  async archiveProduct(id: string): Promise<boolean> {
    const list = await this.getProducts();
    const p = list.find(x => x.id === id || x.sku === id);
    if (p) {
      const newStatus = p.status === "archived" ? "published" : "archived";
      const updated_at = new Date().toISOString();
      const updatedProduct = { ...p, status: newStatus, updated_at };
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from("products").update({ status: newStatus, updated_at }).or(`id.eq.${p.id},sku.eq.${p.sku}`);
        } catch (err) {}
      }
      const idx = store.products.findIndex(x => x.id === id || x.sku === id);
      if (idx !== -1) {
        store.products[idx].status = newStatus;
        store.products[idx].updated_at = updated_at;
      }
      persistStore();
      if (typeof window !== "undefined") {
        fetch("/api/admin/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "save_product", product: updatedProduct }),
        }).catch(() => {});
      }
      return true;
    }
    return false;
  },

  async togglePublish(id: string): Promise<boolean> {
    const list = await this.getProducts();
    const p = list.find(x => x.id === id || x.sku === id);
    if (p) {
      const newStatus = p.status === "published" ? "draft" : "published";
      const updated_at = new Date().toISOString();
      const updatedProduct = { ...p, status: newStatus, updated_at };
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from("products").update({ status: newStatus, updated_at }).or(`id.eq.${p.id},sku.eq.${p.sku}`);
        } catch (err) {}
      }
      const idx = store.products.findIndex(x => x.id === id || x.sku === id);
      if (idx !== -1) {
        store.products[idx].status = newStatus;
        store.products[idx].updated_at = updated_at;
      }
      persistStore();
      if (typeof window !== "undefined") {
        fetch("/api/admin/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "save_product", product: updatedProduct }),
        }).catch(() => {});
      }
      return true;
    }
    return false;
  },

  async duplicateProduct(id: string): Promise<AdminProduct | null> {
    const src = await this.getProductById(id);
    if (!src) return null;
    const newSku = `${src.sku}-COPY`;
    const newName = `${src.name} (Copy)`;
    return this.saveProduct({
      ...src,
      id: `zsh-${newSku.toLowerCase()}-${Date.now()}`,
      sku: newSku,
      name: newName,
      slug: newSku.toLowerCase(),
      status: "draft",
      created_at: new Date().toISOString()
    });
  },

  // CATEGORIES
  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from("categories").select("*").order("display_order", { ascending: true });
        if (!error && data && data.length > 0) {
          store.categories = data as Category[];
          return data as Category[];
        }
      } catch (e) {}
    }
    return [...store.categories].sort((a, b) => a.display_order - b.display_order);
  },

  async saveCategory(cat: Partial<Category>): Promise<Category> {
    const isNew = !cat.id || !store.categories.some(c => c.id === cat.id);
    const id = cat.id || `cat-${Date.now()}`;
    const item: Category = {
      id,
      name: cat.name || "New Category",
      slug: cat.slug || cat.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "new-category",
      room_slug: cat.room_slug || "living",
      description: cat.description || "",
      image_url: cat.image_url || "/images/catalog/page_14_img_00.webp",
      display_order: cat.display_order ?? (store.categories.length + 1),
      status: cat.status || "active",
      created_at: cat.created_at || new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("categories").upsert([item], { onConflict: "id" });
      } catch (e) {}
    }

    if (isNew) store.categories.push(item);
    else {
      const idx = store.categories.findIndex(c => c.id === id);
      if (idx !== -1) store.categories[idx] = item;
    }
    persistStore();

    if (typeof window !== "undefined") {
      fetch("/api/admin/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_category", category: item }),
      }).catch(() => {});
    }

    return item;
  },

  async deleteCategory(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("categories").delete().eq("id", id);
      } catch (e) {}
    }
    store.categories = store.categories.filter(c => c.id !== id);
    persistStore();
    return true;
  },

  // COLLECTIONS
  async getCollections(): Promise<Collection[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from("collections").select("*").order("display_order", { ascending: true });
        if (!error && data && data.length > 0) {
          store.collections = data as Collection[];
          return data as Collection[];
        }
      } catch (e) {}
    }
    return [...store.collections].sort((a, b) => a.display_order - b.display_order);
  },

  async saveCollection(col: Partial<Collection>): Promise<Collection> {
    const isNew = !col.id || !store.collections.some(c => c.id === col.id);
    const id = col.id || `col-${Date.now()}`;
    const item: Collection = {
      id,
      name: col.name || "New Collection",
      slug: col.slug || col.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "new-collection",
      description: col.description || "",
      image_url: col.image_url || "/images/products/sf001-1.jpg",
      display_order: col.display_order ?? (store.collections.length + 1),
      status: col.status || "active",
      created_at: col.created_at || new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("collections").upsert([item], { onConflict: "id" });
      } catch (e) {}
    }

    if (isNew) store.collections.push(item);
    else {
      const idx = store.collections.findIndex(c => c.id === id);
      if (idx !== -1) store.collections[idx] = item;
    }
    persistStore();

    if (typeof window !== "undefined") {
      fetch("/api/admin/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_collection", collection: item }),
      }).catch(() => {});
    }

    return item;
  },

  async deleteCollection(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("collections").delete().eq("id", id);
      } catch (e) {}
    }
    store.collections = store.collections.filter(c => c.id !== id);
    persistStore();
    return true;
  },

  // MATERIALS
  async getWoodTypes(): Promise<WoodType[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from("wood_types").select("*").order("display_order", { ascending: true });
        if (!error && data && data.length > 0) {
          store.woodTypes = data as WoodType[];
          return data as WoodType[];
        }
      } catch (e) {}
    }
    return [...store.woodTypes].sort((a, b) => a.display_order - b.display_order);
  },

  async saveWoodType(wood: Partial<WoodType>): Promise<WoodType> {
    const id = wood.id || `wood-${Date.now()}`;
    const item: WoodType = {
      id,
      name: wood.name || "Wood Type",
      slug: wood.slug || wood.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "wood-type",
      description: wood.description || "",
      image_url: wood.image_url || "",
      is_available: wood.is_available ?? true,
      display_order: wood.display_order ?? (store.woodTypes.length + 1),
      created_at: wood.created_at || new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("wood_types").upsert([item], { onConflict: "id" });
      } catch (e) {}
    }

    const idx = store.woodTypes.findIndex(w => w.id === id);
    if (idx !== -1) store.woodTypes[idx] = item;
    else store.woodTypes.push(item);
    persistStore();
    return item;
  },

  async deleteWoodType(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("wood_types").delete().eq("id", id);
      } catch (e) {}
    }
    store.woodTypes = store.woodTypes.filter(w => w.id !== id);
    persistStore();
    return true;
  },

  async getFabricTypes(): Promise<FabricType[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from("fabric_types").select("*").order("display_order", { ascending: true });
        if (!error && data && data.length > 0) {
          store.fabricTypes = data as FabricType[];
          return data as FabricType[];
        }
      } catch (e) {}
    }
    return [...store.fabricTypes].sort((a, b) => a.display_order - b.display_order);
  },

  async saveFabricType(fab: Partial<FabricType>): Promise<FabricType> {
    const id = fab.id || `fab-${Date.now()}`;
    const item: FabricType = {
      id,
      name: fab.name || "Fabric Type",
      slug: fab.slug || fab.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "fabric-type",
      description: fab.description || "",
      image_url: fab.image_url || "",
      is_available: fab.is_available ?? true,
      display_order: fab.display_order ?? (store.fabricTypes.length + 1),
      created_at: fab.created_at || new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("fabric_types").upsert([item], { onConflict: "id" });
      } catch (e) {}
    }

    const idx = store.fabricTypes.findIndex(f => f.id === id);
    if (idx !== -1) store.fabricTypes[idx] = item;
    else store.fabricTypes.push(item);
    persistStore();
    return item;
  },

  async deleteFabricType(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("fabric_types").delete().eq("id", id);
      } catch (e) {}
    }
    store.fabricTypes = store.fabricTypes.filter(f => f.id !== id);
    persistStore();
    return true;
  },

  async getOtherMaterials(): Promise<OtherMaterial[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from("other_materials").select("*").order("display_order", { ascending: true });
        if (!error && data && data.length > 0) {
          store.otherMaterials = data as OtherMaterial[];
          return data as OtherMaterial[];
        }
      } catch (e) {}
    }
    return [...store.otherMaterials].sort((a, b) => a.display_order - b.display_order);
  },

  async saveOtherMaterial(mat: Partial<OtherMaterial>): Promise<OtherMaterial> {
    const id = mat.id || `mat-${Date.now()}`;
    const item: OtherMaterial = {
      id,
      name: mat.name || "Material",
      slug: mat.slug || mat.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "material",
      category: mat.category || "Hardware",
      description: mat.description || "",
      image_url: mat.image_url || "",
      is_available: mat.is_available ?? true,
      display_order: mat.display_order ?? (store.otherMaterials.length + 1),
      created_at: mat.created_at || new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("other_materials").upsert([item], { onConflict: "id" });
      } catch (e) {}
    }

    const idx = store.otherMaterials.findIndex(m => m.id === id);
    if (idx !== -1) store.otherMaterials[idx] = item;
    else store.otherMaterials.push(item);
    persistStore();
    return item;
  },

  async deleteOtherMaterial(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("other_materials").delete().eq("id", id);
      } catch (e) {}
    }
    store.otherMaterials = store.otherMaterials.filter(m => m.id !== id);
    persistStore();
    return true;
  },

  // MEDIA
  async getMediaItems(): Promise<MediaItem[]> {
    return [...store.media];
  },

  async addMediaItem(item: Omit<MediaItem, "id" | "created_at">): Promise<MediaItem> {
    const newItem: MediaItem = {
      id: `media-${Date.now()}`,
      ...item,
      created_at: new Date().toISOString()
    };
    store.media.unshift(newItem);
    persistStore();
    return newItem;
  },

  async deleteMediaItem(id: string): Promise<boolean> {
    store.media = store.media.filter(m => m.id !== id);
    persistStore();
    return true;
  },

  // SETTINGS & USERS
  async getSettings(): Promise<WebsiteSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from("website_settings").select("value").eq("key", "main").single();
        if (!error && data?.value) {
          store.settings = { ...store.settings, ...data.value };
          return store.settings;
        }
      } catch (e) {}
    }
    return { ...store.settings };
  },

  async saveSettings(settings: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
    store.settings = { ...store.settings, ...settings };
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("website_settings").upsert([{ key: "main", value: store.settings, updated_at: new Date().toISOString() }], { onConflict: "key" });
      } catch (e) {}
    }
    persistStore();
    return store.settings;
  },

  async getUsers(): Promise<AdminUser[]> {
    return [...store.users];
  },

  async saveUser(user: Partial<AdminUser>): Promise<AdminUser> {
    const id = user.id || `usr-${Date.now()}`;
    const item: AdminUser = {
      id,
      email: user.email || "user@zoosh.in",
      name: user.name || "User",
      role: user.role || "editor",
      created_at: user.created_at || new Date().toISOString()
    };
    const idx = store.users.findIndex(u => u.id === id);
    if (idx !== -1) store.users[idx] = item;
    else store.users.push(item);
    persistStore();
    return item;
  },

  async deleteUser(id: string): Promise<boolean> {
    store.users = store.users.filter(u => u.id !== id);
    persistStore();
    return true;
  },

  // DASHBOARD STATS
  async getDashboardStats() {
    const [products, categories, collections, woodTypes, fabricTypes, otherMaterials] = await Promise.all([
      this.getProducts(),
      this.getCategories(),
      this.getCollections(),
      this.getWoodTypes(),
      this.getFabricTypes(),
      this.getOtherMaterials()
    ]);

    const published = products.filter(p => p.status === "published").length;
    const draft = products.filter(p => p.status === "draft").length;
    const archived = products.filter(p => p.status === "archived").length;
    const featured = products.filter(p => p.featured).length;

    const recentProducts = [...products]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 6);

    return {
      totalProducts: products.length,
      publishedProducts: published,
      draftProducts: draft,
      archivedProducts: archived,
      featuredProducts: featured,
      totalCategories: categories.length,
      totalCollections: collections.length,
      totalMaterials: woodTypes.length + fabricTypes.length + otherMaterials.length,
      recentProducts
    };
  }
};
