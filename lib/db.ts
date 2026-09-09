import { supabase, isSupabaseConfigured } from "./supabase";
import productsData from "@/data/products.json";

export interface DbProduct {
  id: string;
  product_code: string;
  name: string;
  category: string;
  wood_type: string;
  features: string[];
  price: number;
  image_url?: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  created_at?: string;
}

export interface DbEstimate {
  id: string;
  user_id: string;
  image_url: string;
  category: string;
  wood_type: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  features: string[];
  complexity: 'Simple' | 'Medium' | 'Premium' | 'Luxury';
  estimated_price: {
    min: number;
    recommended: number;
    max: number;
  };
  confidence_score: number;
  reasoning: {
    referenceProductId?: string;
    referenceProductName?: string;
    referenceProductPrice?: number;
    sizeFactor?: number;
    woodFactor?: number;
    complexityFactor?: number;
    featureCosts?: Array<{ name: string; cost: number }>;
    explanation?: string;
    topMatches?: Array<{
      id: string;
      code: string;
      name: string;
      basePrice: number;
      adjustedPrice: number;
      sizeFactor: number;
      woodFactor: number;
      complexityFactor: number;
      featureDelta: number;
    }>;
  };
  created_at: string;
}


// Mock local store for fallback
let mockProducts: DbProduct[] = [];
let mockEstimates: DbEstimate[] = [];

// Seed mock products from static products.json if mockProducts is empty
function seedMockProducts() {
  if (mockProducts.length === 0) {
    mockProducts = (productsData as any[]).map((p, idx) => {
      // Map properties to match DbProduct
      // Determine wood type from material/title
      let wood_type = "Teak";
      const mat = p.material?.toLowerCase() || "";
      if (mat.includes("oak")) wood_type = "Ash Wood";
      else if (mat.includes("walnut")) wood_type = "Mahogany";
      else if (mat.includes("teak")) wood_type = "Teak";
      else if (mat.includes("karivaka")) wood_type = "Karivaka";
      else if (mat.includes("plywood")) wood_type = "Plywood";

      // Dimensions mapping
      let length = 80, width = 80, height = 75;
      const dimStr = p.dimensions || "";
      const match = dimStr.match(/(\d+)\s*cm\s*[Ww]\s*x\s*(\d+)\s*cm\s*[Dd]\s*x\s*(\d+)\s*cm\s*[Hh]/);
      if (match) {
        length = parseInt(match[1]);
        width = parseInt(match[2]);
        height = parseInt(match[3]);
      }

      // Price mapping - some mock prices
      const basePrices: Record<string, number> = {
        "Chairs": 18000,
        "Sofas": 45000,
        "Benches": 12000,
        "Dining": 38000,
        "Living": 28000,
        "Bedroom": 55000
      };
      const price = basePrices[p.category] || 25000;

      // Extract features
      const features: string[] = [];
      const desc = p.description?.toLowerCase() || "";
      if (desc.includes("cushion") || desc.includes("upholster") || desc.includes("fabric") || desc.includes("linen") || desc.includes("boucle")) features.push("Upholstery");
      if (desc.includes("curve") || desc.includes("sculptur")) features.push("Curved Design");
      if (desc.includes("door") || desc.includes("cabinet")) features.push("Door/Shutter");
      if (desc.includes("drawer") || desc.includes("storage")) features.push("Drawer");
      if (desc.includes("marble") || desc.includes("stone") || desc.includes("travertine")) features.push("Marble Top");
      if (desc.includes("cane") || desc.includes("rattan")) features.push("Cane Work");

      return {
        id: p.id || `mock-${idx + 1}`,
        product_code: p.sku || `ZSH-MOCK-${100 + idx}`,
        name: p.name,
        category: p.category === "Chairs" ? "Lounge Chair" : p.category === "Sofas" ? "Two Seater Sofa" : p.category === "Dining" ? "Dining Table" : p.category === "Living" ? "Centre Table" : p.category,
        wood_type,
        features,
        price,
        image_url: p.images?.[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800",
        dimensions: { length, width, height },
        created_at: new Date().toISOString()
      };
    });
  }
}

// In-memory caching/handling for server/client lifecycle
if (typeof window !== "undefined") {
  // Client-side local storage backup
  const savedProds = localStorage.getItem("zoosh_mock_products");
  const savedEsts = localStorage.getItem("zoosh_mock_estimates");
  if (savedProds) {
    mockProducts = JSON.parse(savedProds);
  } else {
    seedMockProducts();
    localStorage.setItem("zoosh_mock_products", JSON.stringify(mockProducts));
  }
  if (savedEsts) {
    mockEstimates = JSON.parse(savedEsts);
  }
} else {
  // Server-side seeding
  seedMockProducts();
}

const updateLocalStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("zoosh_mock_products", JSON.stringify(mockProducts));
    localStorage.setItem("zoosh_mock_estimates", JSON.stringify(mockEstimates));
  }
};

const syncFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const savedProds = localStorage.getItem("zoosh_mock_products");
    const savedEsts = localStorage.getItem("zoosh_mock_estimates");
    if (savedProds) mockProducts = JSON.parse(savedProds);
    if (savedEsts) mockEstimates = JSON.parse(savedEsts);
  }
};

export const db = {
  isMock: !isSupabaseConfigured,

  async getProducts(): Promise<DbProduct[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (!error && data) {
        return data as DbProduct[];
      }
      console.error("Supabase getProducts error, using mock:", error);
    }
    syncFromLocalStorage();
    seedMockProducts();
    return mockProducts;
  },

  async addProduct(product: Omit<DbProduct, "id" | "created_at">): Promise<DbProduct> {
    const newProduct: DbProduct = {
      ...product,
      id: crypto.randomUUID ? crypto.randomUUID() : `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("products")
        .insert([newProduct])
        .select()
        .single();
      
      if (!error && data) {
        return data as DbProduct;
      }
      console.error("Supabase addProduct error, using mock:", error);
    }

    mockProducts.unshift(newProduct);
    updateLocalStorage();
    return newProduct;
  },

  async deleteProduct(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);
      if (!error) return;
      console.error("Supabase deleteProduct error:", error);
    }
    mockProducts = mockProducts.filter(p => p.id !== id);
    updateLocalStorage();
  },

  async getEstimates(): Promise<DbEstimate[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("estimates")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (!error && data) {
        return data as DbEstimate[];
      }
      console.error("Supabase getEstimates error, using mock:", error);
    }
    syncFromLocalStorage();
    return mockEstimates;
  },

  async getEstimateById(id: string): Promise<DbEstimate | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("estimates")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) {
        return data as DbEstimate;
      }
      console.error("Supabase getEstimateById error, using mock:", error);
    }
    syncFromLocalStorage();
    const estimate = mockEstimates.find(e => e.id === id);
    return estimate || null;
  },

  async addEstimate(estimate: Omit<DbEstimate, "id" | "created_at">): Promise<DbEstimate> {
    const newEstimate: DbEstimate = {
      ...estimate,
      id: crypto.randomUUID ? crypto.randomUUID() : `est-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("estimates")
        .insert([newEstimate])
        .select()
        .single();
      
      if (!error && data) {
        return data as DbEstimate;
      }
      console.error("Supabase addEstimate error, using mock:", error);
    }

    mockEstimates.unshift(newEstimate);
    updateLocalStorage();
    return newEstimate;
  }
};
