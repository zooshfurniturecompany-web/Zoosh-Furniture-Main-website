"use client";

import { useEffect, useState } from "react";
import {
  Image as ImageIcon,
  Upload,
  Copy,
  Check,
  Search,
  Trash2,
  ExternalLink,
  Plus
} from "lucide-react";
import { adminDb, MediaItem } from "@/lib/admin-db";

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState("");

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    const list = await adminDb.getMediaItems();
    setMedia(list);
  };

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newUrl.trim()) {
      await adminDb.addMediaItem({
        url: newUrl.trim(),
        name: newUrl.split("/").pop() || "image.jpg",
        size: "Custom Asset"
      });
      setNewUrl("");
      loadMedia();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Remove image from media library?")) {
      await adminDb.deleteMediaItem(id);
      loadMedia();
    }
  };

  const filteredMedia = media.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.url.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 tracking-tight">
            Media & Asset Library
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-1">
            Central repository of product lifestyle photography, catalog renders, and workshop images.
          </p>
        </div>
      </div>

      {/* Add & Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between text-xs">
        <form onSubmit={handleAddMedia} className="flex gap-2 w-full md:w-auto flex-1">
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="Paste image URL (e.g. /images/products/sf021-1.jpg or https://...)"
            className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-800 font-semibold shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Asset
          </button>
        </form>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredMedia.map((m) => (
          <div key={m.id} className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm flex flex-col group relative">
            <div className="aspect-[4/5] bg-neutral-100 overflow-hidden relative">
              <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                <button
                  onClick={() => handleCopyUrl(m)}
                  className="p-2 bg-white text-black rounded-lg shadow hover:bg-neutral-100 text-xs font-semibold flex items-center gap-1"
                  title="Copy Image URL"
                >
                  {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="p-2 text-[11px]">
              <p className="font-semibold text-neutral-800 truncate" title={m.name}>{m.name}</p>
              <p className="text-neutral-400 text-[10px] truncate">{m.size || "Image"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
