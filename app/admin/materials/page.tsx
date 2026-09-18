"use client";

import { useEffect, useState } from "react";
import {
  TreePine,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Layers,
  Sparkles
} from "lucide-react";
import { adminDb, WoodType, FabricType, OtherMaterial } from "@/lib/admin-db";

export default function MaterialsAdminPage() {
  const [activeTab, setActiveTab] = useState<"woods" | "fabrics" | "others">("woods");
  const [woods, setWoods] = useState<WoodType[]>([]);
  const [fabrics, setFabrics] = useState<FabricType[]>([]);
  const [others, setOthers] = useState<OtherMaterial[]>([]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [otherCategory, setOtherCategory] = useState("Hardware");

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    const [w, f, o] = await Promise.all([
      adminDb.getWoodTypes(),
      adminDb.getFabricTypes(),
      adminDb.getOtherMaterials()
    ]);
    setWoods(w);
    setFabrics(f);
    setOthers(o);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setImageUrl("");
    setIsAvailable(true);
    setOtherCategory("Hardware");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "woods") {
      await adminDb.saveWoodType({ id: editingId || undefined, name, description, image_url: imageUrl, is_available: isAvailable });
    } else if (activeTab === "fabrics") {
      await adminDb.saveFabricType({ id: editingId || undefined, name, description, image_url: imageUrl, is_available: isAvailable });
    } else {
      await adminDb.saveOtherMaterial({ id: editingId || undefined, name, category: otherCategory, description, image_url: imageUrl, is_available: isAvailable });
    }
    setModalOpen(false);
    loadMaterials();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this material?")) {
      if (activeTab === "woods") await adminDb.deleteWoodType(id);
      else if (activeTab === "fabrics") await adminDb.deleteFabricType(id);
      else await adminDb.deleteOtherMaterial(id);
      loadMaterials();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 tracking-tight">
            Materials & Swatches Management
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-1">
            Manage timber species, fabric grades, natural rattan, and premium hardware options.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add {activeTab === "woods" ? "Wood Type" : activeTab === "fabrics" ? "Fabric" : "Material"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 space-x-2 text-xs">
        <button
          onClick={() => setActiveTab("woods")}
          className={`pb-2.5 px-4 font-semibold border-b-2 transition-colors ${
            activeTab === "woods" ? "border-black text-black" : "border-transparent text-neutral-500 hover:text-black"
          }`}
        >
          Wood Species ({woods.length})
        </button>
        <button
          onClick={() => setActiveTab("fabrics")}
          className={`pb-2.5 px-4 font-semibold border-b-2 transition-colors ${
            activeTab === "fabrics" ? "border-black text-black" : "border-transparent text-neutral-500 hover:text-black"
          }`}
        >
          Fabrics & Upholstery ({fabrics.length})
        </button>
        <button
          onClick={() => setActiveTab("others")}
          className={`pb-2.5 px-4 font-semibold border-b-2 transition-colors ${
            activeTab === "others" ? "border-black text-black" : "border-transparent text-neutral-500 hover:text-black"
          }`}
        >
          Rattan, Stones & Accents ({others.length})
        </button>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(activeTab === "woods" ? woods : activeTab === "fabrics" ? fabrics : others).map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 flex flex-col justify-between space-y-3 text-xs">
            <div className="flex items-start gap-3">
              {item.image_url ? (
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-neutral-200">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 font-bold shrink-0">
                  {item.name[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-neutral-900 truncate">{item.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    item.is_available ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"
                  }`}>
                    {item.is_available ? "In Stock" : "Unavailable"}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2">{item.description}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 flex items-center justify-end gap-1">
              <button
                onClick={() => {
                  setEditingId(item.id);
                  setName(item.name);
                  setDescription(item.description);
                  setImageUrl(item.image_url);
                  setIsAvailable(item.is_available);
                  if ("category" in item) setOtherCategory((item as any).category);
                  setModalOpen(true);
                }}
                className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <h2 className="text-base font-serif font-bold text-neutral-900">
              {editingId ? "Edit Material" : "Add Material"}
            </h2>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Material / Swatch Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Treated Solid Teak"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
                />
              </div>

              {activeTab === "others" && (
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Category</label>
                  <select
                    value={otherCategory}
                    onChange={(e) => setOtherCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
                  >
                    <option value="Cane/Rattan">Cane / Rattan</option>
                    <option value="Stone/Marble">Stone / Marble / Travertine</option>
                    <option value="Metal/Brass">Metal / Brass Inlays</option>
                    <option value="Hardware">Hardware & Accents</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Swatch Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/images/products/sf001-1.jpg"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Grain characteristics, durability, grade..."
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="availCheck"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="w-4 h-4 rounded text-black focus:ring-black"
                />
                <label htmlFor="availCheck" className="text-neutral-700 font-medium">Currently Available in Workshop</label>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-800 font-semibold shadow-sm"
                >
                  Save Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
