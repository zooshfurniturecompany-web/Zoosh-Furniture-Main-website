"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Sparkles, 
  Printer, 
  Package, 
  Maximize2 
} from "lucide-react";
import { db, DbEstimate, DbProduct } from "@/lib/db";

// Standard currency formatter
const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(val);
};

export default function ResultPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [estimate, setEstimate] = useState<DbEstimate | null>(null);
  const [displaySimilar, setDisplaySimilar] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const est = await db.getEstimateById(id);
        if (!est) {
          setLoading(false);
          return;
        }
        setEstimate(est);

        // Fetch similar reference products
        const allProducts = await db.getProducts();
        const categoryProducts = allProducts.filter(
          p => p.category.toLowerCase() === est.category.toLowerCase()
        );

        // Rank by similarity
        const rankedSimilar = categoryProducts
          .map(p => {
            let score = 0;
            if (p.wood_type.toLowerCase() === est.wood_type.toLowerCase()) score += 5;
            const commonFeats = (p.features || []).filter(f => est.features.includes(f));
            score += commonFeats.length * 2;
            return { product: p, score };
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, 5)
          .map(entry => entry.product);

        let similar = [...rankedSimilar];
        if (similar.length < 5) {
          const remaining = allProducts.filter(p => !similar.some(ds => ds.id === p.id));
          similar = [...similar, ...remaining.slice(0, 5 - similar.length)];
        }
        setDisplaySimilar(similar);
      } catch (err) {
        console.error("Failed to load estimate result data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 text-center text-neutral-500 flex flex-col items-center justify-center gap-3 min-h-[400px]">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        <p className="text-sm">Loading estimation breakdown report...</p>
      </div>
    );
  }

  if (!estimate) {
    return (
      <div className="p-12 text-center text-neutral-500 flex flex-col items-center justify-center gap-4 min-h-[400px]">
        <h2 className="text-xl font-bold text-white">Estimate Report Not Found</h2>
        <p className="text-sm max-w-md text-neutral-400">
          The requested estimate report with ID <code className="text-white bg-neutral-900 px-1 py-0.5 rounded">{id}</code> could not be found.
        </p>
        <Link 
          href="/dashboard" 
          className="px-5 py-2.5 bg-white text-black rounded-md text-xs font-bold hover:bg-neutral-200 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { min, recommended, max } = estimate.estimated_price;
  const reasoning = estimate.reasoning;

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-800 pb-6">
        <div className="flex items-center gap-3">
          <Link 
            href="/new" 
            className="p-2 rounded-md border border-neutral-800 hover:bg-neutral-900 transition-colors text-neutral-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-wider uppercase">Estimation Breakdown</h1>
            <p className="text-xs text-neutral-500 mt-0.5">Report ID: {estimate.id}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/history"
            className="px-4 py-2 border border-neutral-800 hover:bg-neutral-900 rounded-md text-xs font-semibold transition-colors"
          >
            All History
          </Link>
          <button 
            onClick={() => {
              if (typeof window !== "undefined") window.print();
            }}
            className="px-4 py-2 bg-white text-black hover:bg-neutral-200 rounded-md text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Estimate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Image & Detected Specs */}
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden relative aspect-square flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={estimate.image_url} 
              alt="Uploaded Estimate Photo" 
              className="object-cover w-full h-full"
            />
            {/* Confidence indicator badge */}
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/80 backdrop-blur-md border border-neutral-800 rounded-full text-xs font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>{estimate.confidence_score}% Confidence</span>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Specifications Overview</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-neutral-500 block mb-0.5">Category</span>
                <span className="font-semibold text-white">{estimate.category}</span>
              </div>
              <div>
                <span className="text-neutral-500 block mb-0.5">Wood Type</span>
                <span className="font-semibold text-white">{estimate.wood_type}</span>
              </div>
              <div>
                <span className="text-neutral-500 block mb-0.5">Dimensions (LxWxH)</span>
                <span className="font-semibold text-white">
                  {estimate.dimensions.length} x {estimate.dimensions.width} x {estimate.dimensions.height} cm
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block mb-0.5">Complexity</span>
                <span className="font-semibold text-white">{estimate.complexity}</span>
              </div>
            </div>

            {estimate.features.length > 0 && (
              <div className="border-t border-neutral-800 pt-4">
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest block mb-2">Detected Special Features</span>
                <div className="flex flex-wrap gap-1.5">
                  {estimate.features.map(f => (
                    <span key={f} className="px-2.5 py-1 bg-neutral-950 border border-neutral-800 text-[10px] font-medium rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pricing Breakdown & Reasoning */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Pricing cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 text-center">
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Minimum Price</span>
              <h3 className="text-xl font-bold mt-2 text-neutral-300">{formatCurrency(min)}</h3>
              <p className="text-[10px] text-neutral-500 mt-1">Recommended minus 10%</p>
            </div>

            <div className="bg-white border border-white rounded-lg p-6 text-center text-black shadow-lg shadow-white/5 ring-1 ring-white/10">
              <span className="text-[10px] text-neutral-600 uppercase tracking-widest font-bold">Recommended Price</span>
              <h2 className="text-3xl font-extrabold mt-2 tracking-tight">{formatCurrency(recommended)}</h2>
              <p className="text-[10px] text-neutral-700 mt-1.5 font-medium">Primary sales reference target</p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 text-center">
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Maximum Price</span>
              <h3 className="text-xl font-bold mt-2 text-neutral-300">{formatCurrency(max)}</h3>
              <p className="text-[10px] text-neutral-500 mt-1">Recommended plus 10%</p>
            </div>
          </div>

          {/* Reasoning / Audit Log */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-300">Estimation Logic Breakdown</h2>
            
            <p className="text-xs text-neutral-400 leading-relaxed bg-neutral-950 p-4 border border-neutral-850 rounded-md">
              {reasoning.explanation}
            </p>

            {reasoning.topMatches && reasoning.topMatches.length > 0 ? (
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-widest text-[9px]">Matched Reference Products Used for Average</h3>
                <div className="border border-neutral-800 rounded-md overflow-hidden bg-neutral-950 divide-y divide-neutral-900 text-xs">
                  {reasoning.topMatches.map((match: any, idx: number) => (
                    <div key={idx} className="p-3 flex justify-between items-center gap-4">
                      <div>
                        <div className="font-semibold text-white">{match.name}</div>
                        <div className="text-[10px] text-neutral-500 mt-1">
                          Code: {match.code} | Size: {match.sizeFactor.toFixed(2)}x | Wood: {match.woodFactor.toFixed(2)}x | Complexity: {match.complexityFactor.toFixed(2)}x
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-bold text-white">{formatCurrency(match.adjustedPrice)}</div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">Base: {formatCurrency(match.basePrice)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-widest">Adjustment Factor Details</h3>
                <div className="divide-y divide-neutral-800 text-xs">
                  {reasoning.referenceProductName && (
                    <div className="py-2.5 flex justify-between">
                      <span className="text-neutral-500">Catalog Reference Match</span>
                      <span className="font-semibold text-white">
                        {reasoning.referenceProductName} ({formatCurrency(reasoning.referenceProductPrice || 0)})
                      </span>
                    </div>
                  )}

                  {reasoning.sizeFactor && (
                    <div className="py-2.5 flex justify-between">
                      <span className="text-neutral-500">Volume Scaling Factor</span>
                      <span className="font-semibold text-white">
                        {reasoning.sizeFactor.toFixed(2)}x ({reasoning.sizeFactor > 1 ? "+" : ""}{Math.round((reasoning.sizeFactor - 1) * 100)}% size adjustment)
                      </span>
                    </div>
                  )}

                  {reasoning.woodFactor && reasoning.woodFactor !== 1 && (
                    <div className="py-2.5 flex justify-between">
                      <span className="text-neutral-500">Wood Multiplier Ratio</span>
                      <span className="font-semibold text-white">
                        {reasoning.woodFactor.toFixed(2)}x adjustment
                      </span>
                    </div>
                  )}

                  {reasoning.complexityFactor && reasoning.complexityFactor !== 1 && (
                    <div className="py-2.5 flex justify-between">
                      <span className="text-neutral-500">Complexity Multiplier Ratio</span>
                      <span className="font-semibold text-white">
                        {reasoning.complexityFactor.toFixed(2)}x ({estimate.complexity} vs Reference)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Feature costs list */}
            {reasoning.featureCosts && reasoning.featureCosts.length > 0 && (
              <div className="pt-4 border-t border-neutral-800">
                <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-widest text-[9px] mb-2">Feature Cost Breakdowns</h3>
                <div className="space-y-1.5 text-xs text-neutral-400 pl-2">
                  {reasoning.featureCosts.map((feat: any, idx: number) => (
                    <div key={idx} className="flex justify-between">
                      <span>{feat.name}</span>
                      <span className={feat.cost >= 0 ? "text-green-400" : "text-red-400"}>
                        {feat.cost >= 0 ? "+" : ""}{formatCurrency(feat.cost)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Similar Products section */}
      <div className="space-y-4 pt-6">
        <h2 className="text-lg font-bold tracking-wider uppercase">Similar Catalogue Reference Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {displaySimilar.map((p) => (
            <div 
              key={p.id}
              className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden flex flex-col justify-between"
            >
              <div className="aspect-square bg-neutral-950 flex items-center justify-center relative border-b border-neutral-800 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={p.image_url} 
                  alt={p.name} 
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-3.5 space-y-1.5 flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-neutral-500 block">
                    {p.product_code}
                  </span>
                  <h4 className="font-semibold text-xs text-white truncate" title={p.name}>
                    {p.name}
                  </h4>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[10px] text-neutral-400">{p.wood_type}</span>
                  <span className="text-xs font-bold text-white">
                    {formatCurrency(p.price)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
