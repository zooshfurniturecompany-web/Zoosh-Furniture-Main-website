"use client";

import { useEffect, useState } from "react";
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Image as ImageIcon,
  Layers,
  Search
} from "lucide-react";
import { adminDb, Category } from "@/lib/admin-db";

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [roomSlug, setRoomSlug] = useState<"living" | "dining" | "bedroom" | "entryway" | "custom">("living");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("/images/catalog/page_14_img_00.webp");
  const [displayOrder, setDisplayOrder] = useState(1);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const list = await adminDb.getCategories();
    setCategories(list);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setRoomSlug("living");
    setDescription("");
    setImageUrl("/images/catalog/page_14_img_00.webp");
    setDisplayOrder(categories.length + 1);
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingId(c.id);
    setName(c.name);
    setSlug(c.slug);
    setRoomSlug(c.room_slug);
    setDescription(c.description);
    setImageUrl(c.image_url);
    setDisplayOrder(c.display_order);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminDb.saveCategory({
      id: editingId || undefined,
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      room_slug: roomSlug,
      description,
      image_url: imageUrl,
      display_order: Number(displayOrder) || 1,
      status: "active"
    });
    setModalOpen(false);
    loadCategories();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this category?")) {
      await adminDb.deleteCategory(id);
      loadCategories();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 tracking-tight">
            Category Management
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-1">
            Organize catalog categories and map them to primary storefront rooms (Living, Dining, Bedroom, Entryway).
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-14 h-16 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                <img src={c.image_url || "/images/catalog/page_14_img_00.webp"} alt={c.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-neutral-900 text-sm truncate">{c.name}</h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                    {c.room_slug}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2">{c.description || "Bespoke furniture category"}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-neutral-400">Order: #{c.display_order}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <h2 className="text-base font-serif font-bold text-neutral-900">
              {editingId ? "Edit Category" : "Add New Category"}
            </h2>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingId) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                  }}
                  placeholder="e.g. Lounge Chairs"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Storefront Room *</label>
                  <select
                    value={roomSlug}
                    onChange={(e) => setRoomSlug(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
                  >
                    <option value="living">Living Room</option>
                    <option value="dining">Dining</option>
                    <option value="bedroom">Bedroom</option>
                    <option value="entryway">Entryway</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Category Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/images/catalog/page_14_img_00.webp"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of products in this category..."
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
