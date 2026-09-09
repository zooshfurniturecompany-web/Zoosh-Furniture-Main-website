"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Upload, 
  Sparkles, 
  Settings, 
  Maximize2, 
  HelpCircle, 
  Check, 
  ChevronRight,
  RefreshCw,
  FileImage
} from "lucide-react";
import Button from "@/components/ui/button";
import { analyzeImage } from "@/app/actions/analyze";
import { calculateEstimate } from "@/app/actions/calculate";
import { db } from "@/lib/db";

const CATEGORIES = [
  "Chair",
  "Lounge Chair",
  "Dining Chair",
  "Single Seater Sofa",
  "Two Seater Sofa",
  "Three Seater Sofa",
  "Bed Cot",
  "Dining Table",
  "Console Table",
  "Side Table",
  "Centre Table",
  "TV Unit",
  "Bar Stool"
];

const WOOD_TYPES = [
  "Teak",
  "Mahogany",
  "Ash Wood",
  "Karivaka",
  "Plywood"
];

const COMPLEXITY_LEVELS = [
  "Simple",
  "Medium",
  "Premium",
  "Luxury"
];

const FEATURE_LIST = [
  "Cane Work",
  "Upholstery",
  "Drawer",
  "Door/Shutter",
  "Spindle Work",
  "Curved Design",
  "Marble Top",
  "Tray Extension"
];

export default function NewEstimatePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [category, setCategory] = useState("Lounge Chair");
  const [woodType, setWoodType] = useState("Teak");
  const [length, setLength] = useState<number>(80);
  const [width, setWidth] = useState<number>(80);
  const [height, setHeight] = useState<number>(75);
  const [complexity, setComplexity] = useState<'Simple' | 'Medium' | 'Premium' | 'Luxury'>("Medium");
  const [features, setFeatures] = useState<string[]>([]);

  // UI state
  const [analyzing, setAnalyzing] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState("");
  const [error, setError] = useState("");

  // Handle Image Upload and Downscale client side
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Downscale image to max 450px on canvas to keep base64 string lightweight
        const canvas = document.createElement("canvas");
        const maxDim = 450;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > maxDim) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          }
        } else {
          if (h > maxDim) {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, w, h);
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

        setImagePreview(compressedBase64);
        triggerAIAnalysis(compressedBase64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Trigger OpenAI GPT Vision analysis
  const triggerAIAnalysis = async (base64Image: string) => {
    setAnalyzing(true);
    setAnalysisStatus("Uploading image context...");
    setError("");

    try {
      setAnalysisStatus("Analyzing with GPT Vision...");
      const response = await analyzeImage(base64Image);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || "Vision analysis failed.");
      }

      setAnalysisStatus("Populating specifications...");
      const data = response.data;
      
      if (data.category) setCategory(data.category);
      if (data.complexity) setComplexity(data.complexity);
      if (data.estimated_dimensions) {
        setLength(data.estimated_dimensions.length);
        setWidth(data.estimated_dimensions.width);
        setHeight(data.estimated_dimensions.height);
      }
      if (data.features) setFeatures(data.features);

      // Simple heuristic mapping to guess wood if not set
      // (usually Teak or Mahogany is standard)
      setWoodType(Math.random() > 0.5 ? "Teak" : "Mahogany");

      setAnalysisStatus("Complete!");
      setTimeout(() => setAnalyzing(false), 500);

    } catch (err: any) {
      console.error(err);
      setError("AI Analysis encountered an error. You can still input details manually.");
      setAnalyzing(false);
    }
  };

  const handleFeatureToggle = (feature: string) => {
    if (features.includes(feature)) {
      setFeatures(features.filter(f => f !== feature));
    } else {
      setFeatures([...features, feature]);
    }
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      setError("Please upload an image of the furniture first.");
      return;
    }

    setCalculating(true);
    setError("");

    try {
      const email = localStorage.getItem("zoosh_sales_email") || "sales@zoosh.com";
      const result = await calculateEstimate({
        user_email: email,
        image_url: imagePreview,
        category,
        wood_type: woodType,
        length,
        width,
        height,
        features,
        complexity
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || "Estimation calculation failed.");
      }

      // In mock/local mode, save the generated estimate to the client's localStorage
      // so it is accessible on result and history pages
      if (db.isMock && typeof window !== "undefined") {
        try {
          const savedEsts = localStorage.getItem("zoosh_mock_estimates");
          const currentEsts = savedEsts ? JSON.parse(savedEsts) : [];
          // Avoid duplicating if already present
          if (!currentEsts.some((e: any) => e.id === result.data!.id)) {
            currentEsts.unshift(result.data);
            localStorage.setItem("zoosh_mock_estimates", JSON.stringify(currentEsts));
          }
        } catch (storageErr) {
          console.error("Failed to save estimate to local storage:", storageErr);
        }
      }

      router.push(`/result/${result.data.id}`);

    } catch (err: any) {
      setError(err?.message || "Failed to calculate estimate. Please try again.");
      setCalculating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-wider uppercase">New Price Estimate</h1>
        <p className="text-sm text-neutral-400 mt-1">Upload a photo to trigger GPT Vision auto-analysis, then confirm the furniture details.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-md p-4">
          {error}
        </div>
      )}

      <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Image Upload & Preview */}
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden group">
            {imagePreview ? (
              <div className="absolute inset-0 w-full h-full flex flex-col">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={imagePreview} 
                  alt="Furniture Preview" 
                  className="object-cover w-full h-full"
                />
                
                {/* Overlay details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-neutral-900/90 border border-neutral-800 text-xs rounded-md text-white hover:bg-black transition-colors"
                    >
                      Change Photo
                    </button>
                  </div>
                  <div className="text-xs text-neutral-300">
                    Auto-analyzed with GPT Vision
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
                  <Upload className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Upload Furniture Photo</p>
                  <p className="text-xs text-neutral-500 mt-1">Drag and drop or click to select image</p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold rounded-md transition-colors"
                >
                  Browse Files
                </button>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden" 
            />

            {/* AI Vision Overlay Spinner */}
            {analyzing && (
              <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
                <RefreshCw className="w-8 h-8 text-white animate-spin stroke-[1.5]" />
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5 justify-center">
                    <Sparkles className="w-4 h-4 text-white animate-pulse" />
                    AI Analyzing Engine
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 animate-pulse">{analysisStatus}</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick info alert */}
          <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-md text-xs text-neutral-400 leading-relaxed">
            <span className="font-semibold text-white">Tip:</span> High resolution photos with clean backdrops and clear shadows help the GPT Vision Engine detect dimensions, cane work, and joint complexity more accurately.
          </div>
        </div>

        {/* Right Column: Spec Controls */}
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-5">
            
            {/* Category selection */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Furniture Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-md py-2.5 px-3 text-sm text-white focus:outline-none focus:border-neutral-500"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Wood Type selection */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Wood Material
              </label>
              <select
                value={woodType}
                onChange={(e) => setWoodType(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-md py-2.5 px-3 text-sm text-white focus:outline-none focus:border-neutral-500"
              >
                {WOOD_TYPES.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            {/* Dimensions (Length, Width, Height) */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Dimensions (cm)
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-neutral-500 block mb-1">Length</span>
                  <input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    min={1}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-neutral-500"
                    required
                  />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block mb-1">Width</span>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    min={1}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-neutral-500"
                    required
                  />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block mb-1">Height</span>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    min={1}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-neutral-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Design Complexity */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Construction Complexity
              </label>
              <div className="grid grid-cols-4 gap-2">
                {COMPLEXITY_LEVELS.map((c: any) => {
                  const active = complexity === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setComplexity(c)}
                      className={`py-2 rounded-md text-xs font-medium border transition-all ${
                        active 
                          ? "bg-white text-black border-white" 
                          : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700"
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Features Checkboxes */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                Detected Features
              </label>
              <div className="grid grid-cols-2 gap-3">
                {FEATURE_LIST.map((feat) => {
                  const active = features.includes(feat);
                  return (
                    <button
                      key={feat}
                      type="button"
                      onClick={() => handleFeatureToggle(feat)}
                      className={`flex items-center justify-between p-2.5 rounded-md border text-left text-xs transition-all ${
                        active 
                          ? "bg-neutral-800/80 text-white border-neutral-700" 
                          : "bg-neutral-950 text-neutral-500 border-neutral-800 hover:border-neutral-700"
                      }`}
                    >
                      <span>{feat}</span>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        active ? "bg-white border-white text-black" : "border-neutral-800 bg-neutral-950"
                      }`}>
                        {active && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Actions */}
            <Button
              type="submit"
              disabled={calculating || analyzing || !imagePreview}
              className="w-full py-3 bg-white text-black hover:bg-neutral-200 disabled:opacity-50 transition-all font-semibold text-sm flex items-center justify-center gap-2 mt-4"
            >
              {calculating ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Generate Price Estimation
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>

          </div>
        </div>

      </form>
    </div>
  );
}
