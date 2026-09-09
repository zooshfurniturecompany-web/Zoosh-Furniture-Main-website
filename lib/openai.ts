import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY || "";
export const isOpenAIConfigured = !!apiKey;

const openai = isOpenAIConfigured ? new OpenAI({ apiKey }) : null;

export interface VisionAnalysisResult {
  category: string;
  wood_usage: 'Low' | 'Medium' | 'High';
  features: string[];
  complexity: 'Simple' | 'Medium' | 'Premium' | 'Luxury';
  estimated_dimensions: {
    length: number;
    width: number;
    height: number;
  };
  confidence: number;
}

// Pre-defined realistic mock analysis results for testing
const MOCK_VISION_RESPONSES = [
  {
    category: "Lounge Chair",
    wood_usage: "Medium",
    features: ["Cane Work", "Upholstery", "Curved Design"],
    complexity: "Premium",
    estimated_dimensions: { length: 82, width: 78, height: 74 },
    confidence: 88
  },
  {
    category: "Two Seater Sofa",
    wood_usage: "High",
    features: ["Upholstery", "Spindle Work"],
    complexity: "Medium",
    estimated_dimensions: { length: 160, width: 85, height: 80 },
    confidence: 85
  },
  {
    category: "Dining Table",
    wood_usage: "High",
    features: ["Curved Design", "Marble Top"],
    complexity: "Luxury",
    estimated_dimensions: { length: 220, width: 95, height: 75 },
    confidence: 91
  },
  {
    category: "Side Table",
    wood_usage: "Low",
    features: ["Drawer"],
    complexity: "Simple",
    estimated_dimensions: { length: 45, width: 45, height: 55 },
    confidence: 94
  },
  {
    category: "TV Unit",
    wood_usage: "High",
    features: ["Drawer", "Door/Shutter"],
    complexity: "Premium",
    estimated_dimensions: { length: 180, width: 45, height: 60 },
    confidence: 87
  }
];

/**
 * Analyzes a furniture image using OpenAI GPT Vision API.
 * Falls back to a realistic mock analysis if the API key is not configured.
 * @param imageBase64 The base64 data URL of the image.
 */
export async function analyzeFurnitureImage(imageBase64: string): Promise<VisionAnalysisResult> {
  if (!isOpenAIConfigured || !openai) {
    console.warn("OpenAI API Key is not configured. Running in Mock Vision mode.");
    // Simulate API network latency
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // Pick a random mock response
    const randomIndex = Math.floor(Math.random() * MOCK_VISION_RESPONSES.length);
    return MOCK_VISION_RESPONSES[randomIndex] as VisionAnalysisResult;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an expert furniture price estimation assistant. 
Analyze the uploaded image of a piece of furniture and return a structured JSON response.

The JSON object MUST contain the following properties:
1. "category": Choose exactly one of the following: "Chair", "Lounge Chair", "Dining Chair", "Single Seater Sofa", "Two Seater Sofa", "Three Seater Sofa", "Bed Cot", "Dining Table", "Console Table", "Side Table", "Centre Table", "TV Unit", "Bar Stool"
2. "wood_usage": Choose either "Low", "Medium", or "High"
3. "features": An array of detected features from this list: "Cane Work", "Upholstery", "Drawer", "Door/Shutter", "Spindle Work", "Curved Design", "Marble Top", "Tray Extension"
4. "complexity": Choose exactly one of: "Simple", "Medium", "Premium", "Luxury"
5. "estimated_dimensions": An object with "length", "width", "height" in centimeters. Make a realistic estimate of the size based on standard sizes for that category.
6. "confidence": A number representing your confidence percentage (between 50 and 99).

Example JSON Output:
{
  "category": "Lounge Chair",
  "wood_usage": "Medium",
  "features": ["Cane Work", "Upholstery"],
  "complexity": "Premium",
  "estimated_dimensions": { "length": 80, "width": 78, "height": 75 },
  "confidence": 89
}`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this furniture photo and output a JSON breakdown matching the requested schema."
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64 // Assumed to be data:image/jpeg;base64,...
              }
            }
          ]
        }
      ]
    });

    const text = response.choices[0]?.message?.content || "{}";
    const result = JSON.parse(text);

    // Validate properties
    const validCategories = ["Chair", "Lounge Chair", "Dining Chair", "Single Seater Sofa", "Two Seater Sofa", "Three Seater Sofa", "Bed Cot", "Dining Table", "Console Table", "Side Table", "Centre Table", "TV Unit", "Bar Stool"];
    const validComplexities = ["Simple", "Medium", "Premium", "Luxury"];

    return {
      category: validCategories.includes(result.category) ? result.category : "Chair",
      wood_usage: ["Low", "Medium", "High"].includes(result.wood_usage) ? result.wood_usage : "Medium",
      features: Array.isArray(result.features) ? result.features.filter((f: string) => [
        "Cane Work", "Upholstery", "Drawer", "Door/Shutter", "Spindle Work", "Curved Design", "Marble Top", "Tray Extension"
      ].includes(f)) : [],
      complexity: validComplexities.includes(result.complexity) ? result.complexity : "Medium",
      estimated_dimensions: {
        length: typeof result.estimated_dimensions?.length === 'number' ? result.estimated_dimensions.length : 80,
        width: typeof result.estimated_dimensions?.width === 'number' ? result.estimated_dimensions.width : 80,
        height: typeof result.estimated_dimensions?.height === 'number' ? result.estimated_dimensions.height : 75,
      },
      confidence: typeof result.confidence === 'number' ? result.confidence : 80
    };

  } catch (error) {
    console.error("OpenAI GPT Vision execution failed, returning mock:", error);
    // Fall back to a default mock rather than throwing
    return MOCK_VISION_RESPONSES[0] as VisionAnalysisResult;
  }
}
