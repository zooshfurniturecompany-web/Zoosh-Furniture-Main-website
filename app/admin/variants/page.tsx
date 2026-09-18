"use client";

import { useEffect, useState } from "react";
import { Sliders, Plus, CheckCircle2, Layers, Tag } from "lucide-react";
import { adminDb } from "@/lib/admin-db";

export default function VariantsAdminPage() {
  const [woodOptions, setWoodOptions] = useState([
    "Treated Solid Teak",
    "Canadian Imported Ash Wood",
    "Selected Mahogany Wood",
    "Treated Karivaka Wood",
    "Molded Plywood Structure"
  ]);
  const [newWood, setNewWood] = useState("");

  const [finishOptions, setFinishOptions] = useState([
    "Melamine Matt Polish",
    "Natural Matt Polish",
    "Warm Walnut Stain",
    "Smoked Ash Polish",
    "Raw Honed Organic Sealer"
  ]);
  const [newFinish, setNewFinish] = useState("");

  const [sizeTiers, setSizeTiers] = useState([
    "Standard 3-Seater (210-240 cm)",
    "Compact 2-Seater (160-180 cm)",
    "Single Seater Accent (85-95 cm)",
    "Grand Sectional Chaise Setup (280+ cm)"
  ]);
  const [newSize, setNewSize] = useState("");

  const handleAddWood = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWood.trim() && !woodOptions.includes(newWood.trim())) {
      setWoodOptions([...woodOptions, newWood.trim()]);
      setNewWood("");
    }
  };

  const handleAddFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFinish.trim() && !finishOptions.includes(newFinish.trim())) {
      setFinishOptions([...finishOptions, newFinish.trim()]);
      setNewFinish("");
    }
  };

  const handleAddSize = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSize.trim() && !sizeTiers.includes(newSize.trim())) {
      setSizeTiers([...sizeTiers, newSize.trim()]);
      setNewSize("");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 tracking-tight">
          Product Variant Presets
        </h1>
        <p className="text-xs md:text-sm text-neutral-500 mt-1">
          Configure global timber choices, polish finishes, and standard sizing presets for fast assignment in product creation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        {/* Wood Options Preset */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-neutral-600" />
            <h3 className="font-semibold text-neutral-900 text-sm">Wood Species Presets</h3>
          </div>

          <form onSubmit={handleAddWood} className="flex gap-2">
            <input
              type="text"
              value={newWood}
              onChange={(e) => setNewWood(e.target.value)}
              placeholder="Add wood option..."
              className="flex-1 px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
            />
            <button type="submit" className="p-2 bg-black text-white rounded-lg hover:bg-neutral-800">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="space-y-1.5">
            {woodOptions.map((opt, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg border border-neutral-100 text-neutral-800 font-medium">
                <span>{opt}</span>
                <button
                  onClick={() => setWoodOptions(woodOptions.filter((_, idx) => idx !== i))}
                  className="text-neutral-400 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Finish Options Preset */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-neutral-600" />
            <h3 className="font-semibold text-neutral-900 text-sm">Polish & Finish Presets</h3>
          </div>

          <form onSubmit={handleAddFinish} className="flex gap-2">
            <input
              type="text"
              value={newFinish}
              onChange={(e) => setNewFinish(e.target.value)}
              placeholder="Add polish finish..."
              className="flex-1 px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
            />
            <button type="submit" className="p-2 bg-black text-white rounded-lg hover:bg-neutral-800">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="space-y-1.5">
            {finishOptions.map((opt, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg border border-neutral-100 text-neutral-800 font-medium">
                <span>{opt}</span>
                <button
                  onClick={() => setFinishOptions(finishOptions.filter((_, idx) => idx !== i))}
                  className="text-neutral-400 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Size Tiers Preset */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-neutral-600" />
            <h3 className="font-semibold text-neutral-900 text-sm">Standard Sizing Tiers</h3>
          </div>

          <form onSubmit={handleAddSize} className="flex gap-2">
            <input
              type="text"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              placeholder="Add size tier..."
              className="flex-1 px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
            />
            <button type="submit" className="p-2 bg-black text-white rounded-lg hover:bg-neutral-800">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="space-y-1.5">
            {sizeTiers.map((opt, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg border border-neutral-100 text-neutral-800 font-medium">
                <span>{opt}</span>
                <button
                  onClick={() => setSizeTiers(sizeTiers.filter((_, idx) => idx !== i))}
                  className="text-neutral-400 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
