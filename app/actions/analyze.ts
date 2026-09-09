"use server";

import { analyzeFurnitureImage, VisionAnalysisResult } from "@/lib/openai";

export interface AnalyzeActionResponse {
  success: boolean;
  data?: VisionAnalysisResult;
  error?: string;
}

/**
 * Server action to analyze a furniture image using OpenAI Vision.
 * @param imageBase64 The base64 data URL of the image.
 */
export async function analyzeImage(imageBase64: string): Promise<AnalyzeActionResponse> {
  if (!imageBase64) {
    return { success: false, error: "No image data provided" };
  }

  try {
    const analysis = await analyzeFurnitureImage(imageBase64);
    return { success: true, data: analysis };
  } catch (error: any) {
    console.error("Error inside analyzeImage server action:", error);
    return { success: false, error: error?.message || "Failed to analyze image" };
  }
}
