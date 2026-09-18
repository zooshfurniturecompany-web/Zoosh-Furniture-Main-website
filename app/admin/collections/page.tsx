"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  Plus,
  Edit,
  Trash2,
  Layers
} from "lucide-react";
import { adminDb, Collection } from "@/lib/admin-db";

export default function CollectionsAdminPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("/images/products/sf001-1.jpg");
  const [displayOrder, setDisplayOrder] = useState(1);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    const list = await adminDb.getCollections();
    setCollections(list);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
    setImageUrl("/images/products/sf001-1.jpg");
    setDisplayOrder(collections.length + 1);
    setModalOpen(true);
  };

  const handleOpenEdit = (col: Collection) => {
    setEditingId(col.id);
    setName(col.name);
    setSlug(col.slug);
    setDescription(col.description);
    setImageUrl(col.image_url);
    setDisplayOrder(col.display_order);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminDb.saveCollection({
      id: editingId || undefined,
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description,
      image_url: imageUrl,
      display_order: Number(displayOrder) || 1,
      status: "active"
    });
    setModalOpen(false);
    loadCollections();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this collection?")) {
      await adminDb.deleteCollection(id);
      loadCollections();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 tracking-tight">
            Curated Collections
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-1">
            Create thematic product lines (e.g. Solid Teakwood Heritage, Organic Curved Bouclé, Modern Ash & Cane).
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Collection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collections.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col sm:flex-row">
            <div className="sm:w-40 h-40 bg-neutral-100 shrink-0">
              <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h3 className="font-semibold text-neutral-900 text-sm">{c.name}</h3>
                <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">{c.description}</p>
              </div>

              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-neutral-400">Order: #{c.display_order}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleOpenEdit(c)} className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <h2 className="text-base font-serif font-bold text-neutral-900">
              {editingId ? "Edit Collection" : "Add New Collection"}
            </h2>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Collection Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingId) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                  }}
                  placeholder="e.g. Solid Teakwood Heritage"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Hero Image URL</label>
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
                  placeholder="Craftsmanship and design theme of this collection..."
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
                />
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
                  Save Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
