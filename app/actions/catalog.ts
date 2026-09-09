"use server";

import { db, DbProduct } from "@/lib/db";
import * as XLSX from "xlsx";

export interface ImportResponse {
  success: boolean;
  insertedCount: number;
  error?: string;
}

/**
 * Server action to directly import an array of products extracted from PDF or Excel catalogues.
 */
export async function importCatalogProducts(products: any[]): Promise<ImportResponse> {
  try {
    if (!Array.isArray(products) || products.length === 0) {
      return { success: false, insertedCount: 0, error: "No products provided for import" };
    }

    let insertedCount = 0;
    const errors: string[] = [];

    for (const item of products) {
      // Validate and sanitize inputs
      const productCode = String(item.product_code || item.sku || `ZSH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`).trim();
      const name = String(item.name || item.product_name || "ZOOSH Furniture Piece").trim();
      
      // Map to standard category list
      const category = String(item.category || "Chair").trim();
      
      // Map to standard wood type
      let wood_type = String(item.wood_type || item.wood || "Teak").trim();
      const wtLower = wood_type.toLowerCase();
      if (wtLower.includes("teak")) wood_type = "Teak";
      else if (wtLower.includes("mahogany")) wood_type = "Mahogany";
      else if (wtLower.includes("ash")) wood_type = "Ash Wood";
      else if (wtLower.includes("karivaka")) wood_type = "Karivaka";
      else if (wtLower.includes("plywood")) wood_type = "Plywood";
      else wood_type = "Teak"; // default fallback

      // Handle features list
      let features: string[] = [];
      if (Array.isArray(item.features)) {
        features = item.features;
      } else if (typeof item.features === "string") {
        features = (item.features as string).split(",").map((f: string) => f.trim()).filter(Boolean);
      } else if (item.features) {
        features = [String(item.features)];
      }

      // Sanitize features against the valid list
      const validFeatures = ["Cane Work", "Upholstery", "Drawer", "Door/Shutter", "Spindle Work", "Curved Design", "Marble Top", "Tray Extension"];
      const cleanedFeatures = features.filter(f => validFeatures.includes(f));

      // Parse Price
      let price = parseFloat(String(item.price).replace(/[^0-9.]/g, ""));
      if (isNaN(price) || price <= 0) {
        price = 15000; // default fallback
      }

      // Parse Dimensions
      let dimensions = { length: 80, width: 80, height: 75 };
      if (item.dimensions && typeof item.dimensions === "object") {
        dimensions = {
          length: Number(item.dimensions.length || item.dimensions.L || 80),
          width: Number(item.dimensions.width || item.dimensions.W || 80),
          height: Number(item.dimensions.height || item.dimensions.H || 75)
        };
      } else if (typeof item.dimensions === "string") {
        const match = item.dimensions.match(/(\d+)\s*[xX*]\s*(\d+)\s*[xX*]\s*(\d+)/);
        if (match) {
          dimensions = {
            length: parseInt(match[1]),
            width: parseInt(match[2]),
            height: parseInt(match[3])
          };
        }
      }

      const imageUrl = item.image_url || "/images/SHAM3334 insta.jpg.jpeg";

      try {
        await db.addProduct({
          product_code: productCode,
          name,
          category,
          wood_type,
          features: cleanedFeatures,
          price,
          image_url: imageUrl,
          dimensions
        });
        insertedCount++;
      } catch (err: any) {
        console.error(`Failed to insert catalog item ${productCode}:`, err);
        errors.push(`${productCode}: ${err.message || "Unknown error"}`);
      }
    }

    if (errors.length > 0 && insertedCount === 0) {
      return { success: false, insertedCount: 0, error: `Failed to import: ${errors.slice(0, 3).join("; ")}` };
    }

    return {
      success: true,
      insertedCount
    };
  } catch (error: any) {
    console.error("Error in importCatalogProducts server action:", error);
    return { success: false, insertedCount: 0, error: error?.message || "Failed to process catalog upload" };
  }
}

/**
 * Server action to parse an Excel spreadsheet (.xlsx, .xls) and extract products.
 * @param base64Data Base64 representation of the Excel file.
 */
export async function parseExcelCatalog(base64Data: string): Promise<{ success: boolean; products?: any[]; error?: string }> {
  try {
    if (!base64Data) {
      return { success: false, error: "No spreadsheet data provided" };
    }

    // Strip base64 headers if present
    const base64Content = base64Data.split(";base64,").pop() || base64Data;
    const buffer = Buffer.from(base64Content, "base64");

    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet);

    if (rawRows.length === 0) {
      return { success: false, error: "The uploaded sheet is empty" };
    }

    // Standardize column mappings (e.g., Code, Name, Category, Wood, Price, Features, L x W x H)
    const products = rawRows.map((row, idx) => {
      // Find matches for common headers
      const getVal = (keys: string[]) => {
        for (const k of Object.keys(row)) {
          if (keys.some(key => k.toLowerCase().replace(/[^a-z0-9]/g, "").includes(key.toLowerCase()))) {
            return row[k];
          }
        }
        return undefined;
      };

      const product_code = getVal(["code", "sku", "id"]) || `ZSH-XL-${100 + idx}`;
      const name = getVal(["name", "title", "product"]) || `ZOOSH Item ${100 + idx}`;
      const category = getVal(["category", "type"]) || "Chair";
      const wood_type = getVal(["wood", "material"]) || "Teak";
      const price = getVal(["price", "cost", "value"]) || 15000;
      const featuresStr = getVal(["features", "extras", "specs"]) || "";
      const dimensionsStr = getVal(["dimensions", "size", "dims", "lxwxh"]) || "";

      // Clean up features
      let featuresList: string[] = [];
      if (typeof featuresStr === "string") {
        featuresList = featuresStr.split(/[;,]/).map(f => f.trim()).filter(Boolean);
      } else if (Array.isArray(featuresStr)) {
        featuresList = featuresStr;
      }

      return {
        product_code,
        name,
        category,
        wood_type,
        price,
        features: featuresList,
        dimensions: dimensionsStr
      };
    });

    return {
      success: true,
      products
    };

  } catch (error: any) {
    console.error("Error parsing Excel catalogue:", error);
    return { success: false, error: error?.message || "Failed to parse Excel file" };
  }
}
