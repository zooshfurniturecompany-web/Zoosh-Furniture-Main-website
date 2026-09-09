"use server";

import { db, DbProduct, DbEstimate } from "@/lib/db";

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(val);
};

// Standard Category Default Dimensions (Length, Width, Height in cm)
const DEFAULT_DIMENSIONS: Record<string, { length: number; width: number; height: number }> = {
  "Chair": { length: 60, width: 60, height: 85 },
  "Lounge Chair": { length: 80, width: 80, height: 75 },
  "Dining Chair": { length: 50, width: 50, height: 95 },
  "Single Seater Sofa": { length: 90, width: 90, height: 80 },
  "Two Seater Sofa": { length: 160, width: 90, height: 80 },
  "Three Seater Sofa": { length: 220, width: 90, height: 80 },
  "Bed Cot": { length: 200, width: 160, height: 45 },
  "Dining Table": { length: 180, width: 90, height: 75 },
  "Console Table": { length: 120, width: 40, height: 75 },
  "Side Table": { length: 50, width: 50, height: 55 },
  "Centre Table": { length: 100, width: 60, height: 45 },
  "TV Unit": { length: 160, width: 45, height: 50 },
  "Bar Stool": { length: 45, width: 45, height: 90 }
};

// Wood Multipliers
const WOOD_MULTIPLIERS: Record<string, number> = {
  "Plywood": 0.8,
  "Karivaka": 1.1,
  "Mahogany": 1.2,
  "Ash Wood": 1.3,
  "Teak": 1.5
};

// Complexity Multipliers
const COMPLEXITY_MULTIPLIERS: Record<string, number> = {
  "Simple": 1.0,
  "Medium": 1.2,
  "Premium": 1.5,
  "Luxury": 2.0
};

// Feature Costs (flat adjustments in INR)
const FEATURE_COSTS: Record<string, number> = {
  "Cane Work": 3500,
  "Upholstery": 6000,
  "Drawer": 2000,
  "Door/Shutter": 2500,
  "Spindle Work": 3000,
  "Curved Design": 4500,
  "Marble Top": 10000,
  "Tray Extension": 2000
};

export interface CalculateActionRequest {
  user_email: string;
  image_url: string;
  category: string;
  wood_type: string;
  length: number;
  width: number;
  height: number;
  features: string[];
  complexity: 'Simple' | 'Medium' | 'Premium' | 'Luxury';
}

export interface CalculateActionResponse {
  success: boolean;
  data?: DbEstimate;
  error?: string;
}

export async function calculateEstimate(req: CalculateActionRequest): Promise<CalculateActionResponse> {
  try {
    const products = await db.getProducts();
    if (products.length === 0) {
      return { success: false, error: "Reference catalogue is empty. Please upload some reference products first in the Admin Panel." };
    }

    // 1. Filter products by category
    let categoryProducts = products.filter(p => p.category.toLowerCase() === req.category.toLowerCase());
    let referenceList = categoryProducts.length > 0 ? categoryProducts : products;

    // 2. Rank reference products by similarity
    const scoredReferences = referenceList.map(ref => {
      let score = 0;
      
      // Priortize category
      if (ref.category.toLowerCase() === req.category.toLowerCase()) score += 15;
      
      // Match wood type
      if (ref.wood_type.toLowerCase() === req.wood_type.toLowerCase()) score += 5;
      
      // Feature matches
      const refFeatures = ref.features || [];
      const commonFeatures = refFeatures.filter(f => req.features.includes(f));
      score += commonFeatures.length * 3;

      // Penalize feature difference
      const featureDiff = Math.abs(refFeatures.length - req.features.length);
      score -= featureDiff;

      return { ref, score };
    });

    // Sort by highest score first
    scoredReferences.sort((a, b) => b.score - a.score);

    // Get top 3 reference products
    const topMatches = scoredReferences.slice(0, 3).map(item => item.ref);
    
    // 3. Compute adjusted price for each of the top matching products
    const adjustedPrices: number[] = [];
    const referenceDetailsList: any[] = [];
    const newVol = req.length * req.width * req.height;

    for (const ref of topMatches) {
      // Size Factor
      let refDim = ref.dimensions || DEFAULT_DIMENSIONS[ref.category] || { length: 80, width: 80, height: 75 };
      const refVol = refDim.length * refDim.width * refDim.height;
      const sizeFactor = Math.min(Math.max(newVol / refVol, 0.6), 1.8);

      // Wood Factor
      const refWoodMult = WOOD_MULTIPLIERS[ref.wood_type] || 1.2;
      const newWoodMult = WOOD_MULTIPLIERS[req.wood_type] || 1.2;
      const woodFactor = newWoodMult / refWoodMult;

      // Complexity Factor
      const refComplexity: any = (ref as any).complexity || "Medium";
      const refComplexityMult = COMPLEXITY_MULTIPLIERS[refComplexity] || 1.2;
      const newComplexityMult = COMPLEXITY_MULTIPLIERS[req.complexity] || 1.2;
      const complexityFactor = newComplexityMult / refComplexityMult;

      // Features Delta
      const refFeatures = ref.features || [];
      const addedFeatures = req.features.filter(f => !refFeatures.includes(f));
      const removedFeatures = refFeatures.filter(f => !req.features.includes(f));

      let featureDelta = 0;
      for (const f of addedFeatures) {
        featureDelta += FEATURE_COSTS[f] || 2000;
      }
      for (const f of removedFeatures) {
        featureDelta -= (FEATURE_COSTS[f] || 2000) * 0.7; // subtract slightly less
      }

      // Adjusted Price calculation for this reference item
      const refPrice = Number(ref.price);
      const adjustedPrice = (refPrice * sizeFactor * woodFactor * complexityFactor) + featureDelta;

      adjustedPrices.push(adjustedPrice);

      referenceDetailsList.push({
        id: ref.id,
        code: ref.product_code || "ZSH-REF",
        name: ref.name,
        basePrice: refPrice,
        adjustedPrice: Math.round(adjustedPrice / 100) * 100,
        sizeFactor,
        woodFactor,
        complexityFactor,
        featureDelta
      });
    }

    // 4. Calculate the average estimated price from matches
    const averageAdjustedPrice = adjustedPrices.reduce((sum, p) => sum + p, 0) / adjustedPrices.length;

    // Safeguard minimum pricing based on category
    const minCap = req.category.includes("Sofa") || req.category.includes("Bed") ? 12000 : 3500;
    const finalRecommended = Math.max(averageAdjustedPrice, minCap);

    // Round values to nearest 100
    const roundedRecommended = Math.round(finalRecommended / 100) * 100;
    const roundedMin = Math.round((roundedRecommended * 0.90) / 100) * 100;
    const roundedMax = Math.round((roundedRecommended * 1.10) / 100) * 100;

    // 5. Calculate Confidence Score based on similarity match strengths
    const bestMatchScore = scoredReferences[0]?.score || 0;
    let confidence = 85;
    if (bestMatchScore < 10) {
      confidence -= 15; // penalize if matching score is low
    }
    // Clamp confidence
    confidence = Math.min(Math.max(confidence, 50), 98);

    // 6. Generate detailed audit explanation
    const bestRef = topMatches[0];
    let explanation = `Calculated an average estimated price of ${formatCurrency(roundedRecommended)} by comparing against ${topMatches.length} similar reference products: ` +
      `${topMatches.map(m => `"${m.name}" (${m.product_code})`).join(", ")}. `;
    
    explanation += `For the primary match "${bestRef.name}", we scaled by size factor ${referenceDetailsList[0].sizeFactor.toFixed(2)}x ` +
      `(${req.length}x${req.width}x${req.height}cm vs reference ${bestRef.dimensions?.length}x${bestRef.dimensions?.width}x${bestRef.dimensions?.height}cm)`;

    if (referenceDetailsList[0].woodFactor !== 1) {
      explanation += `, wood ratio ${referenceDetailsList[0].woodFactor.toFixed(2)}x (${bestRef.wood_type} to ${req.wood_type})`;
    }
    explanation += `. The final estimation represents the average of the adjusted prices of all matched reference products.`;

    const reasoning = {
      referenceProductId: bestRef.id,
      referenceProductName: bestRef.name,
      referenceProductPrice: Number(bestRef.price),
      sizeFactor: referenceDetailsList[0].sizeFactor,
      woodFactor: referenceDetailsList[0].woodFactor,
      complexityFactor: referenceDetailsList[0].complexityFactor,
      featureCosts: req.features.map(f => ({ name: f, cost: FEATURE_COSTS[f] || 2000 })),
      explanation,
      topMatches: referenceDetailsList // Save the complete top matches breakdown
    };

    // Save in Database
    const savedEstimate = await db.addEstimate({
      user_id: req.user_email || "sales@zoosh.com",
      image_url: req.image_url,
      category: req.category,
      wood_type: req.wood_type,
      dimensions: {
        length: req.length,
        width: req.width,
        height: req.height
      },
      features: req.features,
      complexity: req.complexity,
      estimated_price: {
        min: roundedMin,
        recommended: roundedRecommended,
        max: roundedMax
      },
      confidence_score: confidence,
      reasoning
    });

    return {
      success: true,
      data: savedEstimate
    };

  } catch (error: any) {
    console.error("Error in calculateEstimate server action:", error);
    return { success: false, error: error?.message || "Failed to calculate estimate" };
  }
}
