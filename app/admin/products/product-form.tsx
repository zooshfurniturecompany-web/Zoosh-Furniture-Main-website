"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  CheckCircle2,
  Sparkles,
  Info,
  DollarSign,
  Tag,
  Layers,
  Search,
  Eye,
  ExternalLink,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2
} from "lucide-react";
import { adminDb, AdminProduct, Category, Collection, WoodType, FabricType, MediaItem } from "@/lib/admin-db";

interface ProductFormProps {
  initialData?: AdminProduct | null;
  isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active form tab
  const [activeTab, setActiveTab] = useState<"basic" | "images" | "specs" | "pricing" | "seo">("basic");
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Reference data
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [woodList, setWoodList] = useState<WoodType[]>([]);
  const [fabricList, setFabricList] = useState<FabricType[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);
  const [mediaSearch, setMediaSearch] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Form State
  const [name, setName] = useState(initialData?.name || "");
  const [sku, setSku] = useState(initialData?.sku || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [categoryId, setCategoryId] = useState(initialData?.category_id || "");
  const [categoryName, setCategoryName] = useState(initialData?.category_name || "L-Shape Sofa");
  const [collectionId, setCollectionId] = useState(initialData?.collection_id || "col-1");
  const [collectionName, setCollectionName] = useState(initialData?.collection_name || "Solid Teakwood Heritage");
  const [status, setStatus] = useState<"published" | "draft" | "archived">(initialData?.status || "published");
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [shortDesc, setShortDesc] = useState(initialData?.short_description || "");
  const [fullDesc, setFullDesc] = useState(initialData?.full_description || "");

  // Pricing
  const [pricingType, setPricingType] = useState<"fixed" | "starting_from" | "on_request">(initialData?.pricing_type || "fixed");
  const [price, setPrice] = useState<number>(initialData?.price ?? 45000);
  const [startingPrice, setStartingPrice] = useState<number>(initialData?.starting_price ?? 45000);
  const [displayPrice, setDisplayPrice] = useState<boolean>(initialData?.display_price ?? true);
  const [priceBreakdowns, setPriceBreakdowns] = useState<Array<{ label: string; price: number; note?: string }>>(
    initialData?.price_breakdown || []
  );

  // Specifications
  const [dimensions, setDimensions] = useState(initialData?.dimensions || "210cm W × 90cm D × 80cm H");
  const [dimensionBreakdowns, setDimensionBreakdowns] = useState<Array<{ label: string; size: string }>>(
    initialData?.dimension_breakdown || []
  );
  const [customDimensionsAvailable, setCustomDimensionsAvailable] = useState(initialData?.custom_dimensions_available ?? true);
  const [customisationAvailable, setCustomisationAvailable] = useState(initialData?.customisation_available ?? true);
  const [material, setMaterial] = useState(initialData?.material || "Treated Solid Teakwood");
  const [finish, setFinish] = useState(initialData?.finish || "Melamine Matt Polish");

  // Options
  const [selectedWoods, setSelectedWoods] = useState<string[]>(initialData?.wood_options || ["Treated Solid Teak", "Canadian Ash Wood", "Selected Mahogany"]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>(initialData?.fabric_options || ["Cream Textured Bouclé", "Natural Linen Blend"]);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>(initialData?.finish_options || ["Natural Matt Polish", "Warm Walnut Polish", "Smoked Ash"]);

  // Images
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [newImageUrl, setNewImageUrl] = useState("");

  // SEO
  const [seoTitle, setSeoTitle] = useState(initialData?.seo_title || "");
  const [seoDesc, setSeoDesc] = useState(initialData?.seo_description || "");
  const [keywords, setKeywords] = useState<string>(initialData?.keywords?.join(", ") || "sofa, solid wood, kerala, zoosh");

  // Load supporting reference lists
  useEffect(() => {
    async function loadRefs() {
      const [cats, cols, woods, fabs, meds] = await Promise.all([
        adminDb.getCategories(),
        adminDb.getCollections(),
        adminDb.getWoodTypes(),
        adminDb.getFabricTypes(),
        adminDb.getMediaItems()
      ]);
      setCategories(cats);
      setCollections(cols);
      setWoodList(woods);
      setFabricList(fabs);
      setMediaList(meds);
    }
    loadRefs();
  }, []);

  // Auto-generate slug and SKU when name changes (for new products)
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit && !slug) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  };

  // Image compression & DataURL helper
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1920;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL("image/jpeg", 0.88));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle direct file uploads from computer/mobile
  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    const addedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;
      try {
        const dataUrl = await compressImage(file);
        addedUrls.push(dataUrl);
        await adminDb.addMediaItem({
          url: dataUrl,
          name: file.name,
          size: `${Math.round(file.size / 1024)} KB`
        });
      } catch (err) {
        console.error("Error compressing file:", err);
      }
    }
    if (addedUrls.length > 0) {
      setImages((prev) => [...prev, ...addedUrls]);
      const updatedMedia = await adminDb.getMediaItems();
      setMediaList(updatedMedia);
    }
    setIsUploading(false);
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      await handleFilesSelected(e.dataTransfer.files);
    }
  };

  // Toggle selection from Media Library
  const handleToggleMediaImage = (url: string) => {
    if (images.includes(url)) {
      setImages(images.filter((u) => u !== url));
    } else {
      setImages([...images, url]);
    }
  };

  // Add Image URL manual field
  const handleAddImage = () => {
    if (newImageUrl.trim() && !images.includes(newImageUrl.trim())) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSetCoverImage = (index: number) => {
    if (index === 0) return;
    const item = images[index];
    const rest = images.filter((_, i) => i !== index);
    setImages([item, ...rest]);
  };

  const handleMoveImage = (fromIdx: number, direction: "left" | "right") => {
    const toIdx = direction === "left" ? fromIdx - 1 : fromIdx + 1;
    if (toIdx < 0 || toIdx >= images.length) return;
    const newArr = [...images];
    const temp = newArr[fromIdx];
    newArr[fromIdx] = newArr[toIdx];
    newArr[toIdx] = temp;
    setImages(newArr);
  };

  // Add Price breakdown row
  const handleAddPriceBreakdown = () => {
    setPriceBreakdowns([...priceBreakdowns, { label: "Standard Size", price: price, note: "" }]);
  };

  // Add Dimension breakdown row
  const handleAddDimensionBreakdown = () => {
    setDimensionBreakdowns([...dimensionBreakdowns, { label: "Standard Unit", size: dimensions }]);
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    try {
      const kwArray = keywords.split(",").map(k => k.trim()).filter(Boolean);
      
      const payload: Partial<AdminProduct> = {
        id: initialData?.id,
        sku: sku || ("SF" + Math.floor(100 + Math.random() * 900)),
        name: name || "Untitled Product",
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        category_id: categoryId || undefined,
        category_name: categoryName,
        collection_id: collectionId || undefined,
        collection_name: collectionName,
        status,
        featured,
        short_description: shortDesc,
        full_description: fullDesc,
        pricing_type: pricingType,
        price: Number(price) || 0,
        starting_price: Number(startingPrice) || Number(price) || 0,
        display_price: displayPrice,
        price_breakdown: priceBreakdowns,
        dimensions,
        dimension_breakdown: dimensionBreakdowns,
        custom_dimensions_available: customDimensionsAvailable,
        customisation_available: customisationAvailable,
        material,
        finish,
        wood_options: selectedWoods,
        fabric_options: selectedFabrics,
        finish_options: selectedFinishes,
        images: images.length > 0 ? images : ["/images/catalog/page_14_img_00.webp"],
        seo_title: seoTitle || name + " | ZOOSH",
        seo_description: seoDesc || shortDesc,
        keywords: kwArray,
        specs: {
          "Wood Type": material,
          "Finish": finish,
          "Dimensions": dimensions,
          "Customizable": customisationAvailable ? "Yes - Made to order" : "No",
          "Warranty": "5-Year Frame Structural Warranty",
          "Assembly": "Delivered Fully Assembled"
        }
      };

      const saved = await adminDb.saveProduct(payload);
      setNotification({ type: "success", msg: "Product saved successfully!" });
      setTimeout(() => {
        router.push("/admin/products");
      }, 700);
    } catch (err) {
      console.error(err);
      setNotification({ type: "error", msg: "Failed to save product. Please check inputs." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-600 hover:text-black transition-colors"
            title="Back to all products"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-neutral-900 tracking-tight">
              {isEdit ? "Edit Product: " + (initialData?.name || initialData?.sku) : "Create New Product"}
            </h1>
            <p className="text-xs text-neutral-500">
              {isEdit ? "Update specifications, images, pricing, and live status" : "Add a bespoke handcrafted piece to the Zoosh master catalog"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isEdit && initialData && (
            <a
              href={"/products/" + initialData.slug}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-600 hover:text-black border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" /> View Live
            </a>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : isEdit ? "Update Product" : "Publish Product"}
          </button>
        </div>
      </div>

      {notification && (
        <div className={`p-3.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
          notification.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {notification.msg}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-neutral-200 overflow-x-auto space-x-1 text-xs">
        {[
          { key: "basic", label: "Basic Information", icon: <Info className="w-3.5 h-3.5" /> },
          { key: "images", label: "Images & Gallery", icon: <ImageIcon className="w-3.5 h-3.5" /> },
          { key: "specs", label: "Specifications & Options", icon: <Layers className="w-3.5 h-3.5" /> },
          { key: "pricing", label: "Pricing & Customization", icon: <DollarSign className="w-3.5 h-3.5" /> },
          { key: "seo", label: "SEO & Search", icon: <Tag className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2.5 font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? "border-black text-black font-semibold"
                : "border-transparent text-neutral-500 hover:text-black hover:border-neutral-300"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ========================================================
            TAB 1: BASIC INFORMATION
            ======================================================== */}
        {activeTab === "basic" && (
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-5 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1.5">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Grand Cloud Bouclé Teak 3-Seater Sofa"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:bg-white text-neutral-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1.5">SKU / Product Code *</label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value.toUpperCase())}
                  placeholder="e.g. SF021"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:bg-white text-neutral-900 font-mono font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1.5">Category *</label>
                <select
                  value={categoryName}
                  onChange={(e) => {
                    setCategoryName(e.target.value);
                    const found = categories.find(c => c.name === e.target.value);
                    if (found) setCategoryId(found.id);
                  }}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:bg-white text-neutral-900"
                >
                  <option value="L-Shape Sofa">L-Shape Sofa</option>
                  <option value="Three Seater Sofa">Three Seater Sofa</option>
                  <option value="Two Seater Sofa">Two Seater Sofa</option>
                  <option value="Single Seater Sofa">Single Seater Sofa</option>
                  <option value="Sectional Sofa">Sectional Sofa</option>
                  <option value="Lounge Chair">Lounge Chair</option>
                  <option value="Arm Chair">Arm Chair</option>
                  <option value="Dining Table">Dining Table</option>
                  <option value="Dining Chair">Dining Chair</option>
                  <option value="Bed Cot">Bed Cot</option>
                  <option value="Console Table">Console Table</option>
                  <option value="Centre Table">Centre Table</option>
                  <option value="Side Table">Side Table</option>
                  <option value="Bench">Bench</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1.5">Collection</label>
                <select
                  value={collectionId}
                  onChange={(e) => {
                    setCollectionId(e.target.value);
                    const found = collections.find(c => c.id === e.target.value);
                    if (found) setCollectionName(found.name);
                  }}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:bg-white text-neutral-900"
                >
                  {collections.map((col) => (
                    <option key={col.id} value={col.id}>{col.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1.5">Publication Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:bg-white text-neutral-900 font-medium"
                >
                  <option value="published">Published (Visible on Storefront)</option>
                  <option value="draft">Draft (Hidden from Public)</option>
                  <option value="archived">Archived (Inactive)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <input
                type="checkbox"
                id="featuredCheck"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-black focus:ring-black"
              />
              <label htmlFor="featuredCheck" className="text-neutral-800 font-medium cursor-pointer">
                Mark as Featured Product (Highlights on Homepage & Primary Collections)
              </label>
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1.5">Short Summary Description</label>
              <textarea
                rows={2}
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="A brief 1-2 sentence overview for product cards and quick previews..."
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:bg-white text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1.5">Full Handcrafted Narrative Description</label>
              <textarea
                rows={5}
                value={fullDesc}
                onChange={(e) => setFullDesc(e.target.value)}
                placeholder="Detailed craftsmanship story, timber seasoning, jointing details, and upholstery design..."
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:bg-white text-neutral-900 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: IMAGES & GALLERY
            ======================================================== */}
        {activeTab === "images" && (
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-6 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Product Photography Gallery</h3>
                <p className="text-neutral-500 mt-0.5">
                  Upload photos directly from your device or select from the Media Library. The first image is the main cover photo.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMediaLibraryOpen(true)}
                  className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Browse Media Library ({mediaList.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-4 py-2 bg-black hover:bg-neutral-800 text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-60"
                >
                  {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>Upload Photos</span>
                </button>
              </div>
            </div>

            {/* Hidden Native File Input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFilesSelected(e.target.files)}
              className="hidden"
            />

            {/* Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-black bg-neutral-100 scale-[0.99]"
                  : "border-neutral-300 hover:border-black bg-neutral-50/60 hover:bg-neutral-50"
              }`}
            >
              <div className="max-w-xs mx-auto space-y-2">
                <div className="w-12 h-12 bg-white rounded-full border border-neutral-200 flex items-center justify-center mx-auto shadow-xs">
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 text-neutral-900 animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6 text-neutral-600" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-neutral-900 text-xs">
                    {isUploading ? "Uploading & Optimizing..." : "Click to upload or drag photos here"}
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Supports JPG, PNG, WEBP, HEIC from phone or desktop
                  </p>
                </div>
              </div>
            </div>

            {/* Manual Image URL Input fallback */}
            <div className="pt-2 border-t border-neutral-100">
              <label className="block text-neutral-500 font-medium mb-1 text-[11px]">Or add via image URL / path:</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Enter image URL or path (e.g. /images/products/sf021-1.jpg or https://...)"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:bg-white text-neutral-900"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-neutral-900 text-white font-semibold rounded-lg hover:bg-black transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> Add URL
                </button>
              </div>
            </div>

            {/* Images Grid */}
            <div className="space-y-3 pt-2 border-t border-neutral-100">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-900">
                  Uploaded Photos ({images.length})
                </span>
                <span className="text-[10px] text-neutral-400">
                  First photo is the primary storefront cover
                </span>
              </div>

              {images.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-neutral-200 rounded-lg bg-neutral-50 text-neutral-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 stroke-1 text-neutral-300" />
                  <p>No photos added yet. Upload from your device or browse the media library.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className={`relative group border rounded-xl overflow-hidden bg-neutral-50 shadow-xs aspect-[4/5] flex flex-col transition-all ${
                        idx === 0 ? "border-black ring-2 ring-black/10" : "border-neutral-200"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Product image ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Cover Badge */}
                      <div className="absolute top-2 left-2 flex gap-1">
                        {idx === 0 ? (
                          <span className="bg-black text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                            Cover
                          </span>
                        ) : (
                          <span className="bg-black/60 text-white text-[9px] font-medium px-1.5 py-0.5 rounded backdrop-blur-xs">
                            #{idx + 1}
                          </span>
                        )}
                      </div>

                      {/* Reorder Arrows on Card */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-1 bg-black/70 p-1 rounded-md backdrop-blur-xs">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveImage(idx, "left");
                            }}
                            className="p-1 text-white hover:text-neutral-200 disabled:opacity-30"
                            title="Move Left"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === images.length - 1}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveImage(idx, "right");
                            }}
                            className="p-1 text-white hover:text-neutral-200 disabled:opacity-30"
                            title="Move Right"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex gap-1">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetCoverImage(idx)}
                              className="px-2 py-1 bg-white text-black text-[10px] font-bold rounded shadow hover:bg-neutral-100 transition-colors"
                              title="Set as Main Cover Photo"
                            >
                              Make Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1.5 bg-red-600 text-white rounded shadow hover:bg-red-700 transition-colors"
                            title="Delete Image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Media Library Picker Modal */}
        {mediaLibraryOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden">
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-neutral-900">Select From Media Library</h3>
                  <p className="text-xs text-neutral-500">
                    Click photos to add or remove them from this product ({images.length} selected).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMediaLibraryOpen(false)}
                  className="p-2 text-neutral-400 hover:text-black rounded-lg hover:bg-neutral-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Search Bar */}
              <div className="px-6 py-3 border-b border-neutral-100 bg-neutral-50 flex items-center gap-2">
                <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search photos by filename..."
                  value={mediaSearch}
                  onChange={(e) => setMediaSearch(e.target.value)}
                  className="w-full bg-transparent border-none text-xs focus:outline-none text-neutral-900"
                />
              </div>

              {/* Modal Grid */}
              <div className="p-6 overflow-y-auto flex-1 max-h-[50vh]">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {mediaList
                    .filter((m) => m.name.toLowerCase().includes(mediaSearch.toLowerCase()) || m.url.toLowerCase().includes(mediaSearch.toLowerCase()))
                    .map((m) => {
                      const isSelected = images.includes(m.url);
                      return (
                        <div
                          key={m.id}
                          onClick={() => handleToggleMediaImage(m.url)}
                          className={`relative aspect-[4/5] rounded-lg overflow-hidden border cursor-pointer group transition-all ${
                            isSelected
                              ? "border-black ring-2 ring-black"
                              : "border-neutral-200 hover:border-neutral-400"
                          }`}
                        >
                          <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center shadow-xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white p-1 text-[9px] truncate opacity-0 group-hover:opacity-100 transition-opacity">
                            {m.name}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
                <span className="text-xs text-neutral-600 font-medium">
                  {images.length} photo(s) attached to product
                </span>
                <button
                  type="button"
                  onClick={() => setMediaLibraryOpen(false)}
                  className="px-5 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: SPECIFICATIONS & OPTIONS
            ======================================================== */}
        {activeTab === "specs" && (
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-6 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1.5">Standard Dimensions *</label>
                <input
                  type="text"
                  required
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="e.g. 240cm W × 115cm D × 78cm H (Seat H: 42cm)"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:bg-white text-neutral-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1.5">Primary Wood / Core Material</label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="e.g. Treated Solid Teak / Molded Plywood"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:bg-white text-neutral-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1.5">Standard Polish & Finish</label>
                <input
                  type="text"
                  value={finish}
                  onChange={(e) => setFinish(e.target.value)}
                  placeholder="e.g. Melamine Matt Polish / Organic Matte Sealer"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:bg-white text-neutral-900"
                />
              </div>

              <div className="flex items-center gap-4 pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customDimensionsAvailable}
                    onChange={(e) => setCustomDimensionsAvailable(e.target.checked)}
                    className="w-4 h-4 rounded text-black focus:ring-black"
                  />
                  <span className="font-medium text-neutral-800">Custom Dimensions Available</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customisationAvailable}
                    onChange={(e) => setCustomisationAvailable(e.target.checked)}
                    className="w-4 h-4 rounded text-black focus:ring-black"
                  />
                  <span className="font-medium text-neutral-800">Custom Finishes Available</span>
                </label>
              </div>
            </div>

            {/* Wood Options Selector */}
            <div className="space-y-2 border-t border-neutral-100 pt-4">
              <label className="block text-neutral-700 font-semibold">Available Wood Options</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {woodList.map((wood) => {
                  const checked = selectedWoods.includes(wood.name);
                  return (
                    <label key={wood.id} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      checked ? "bg-neutral-900 text-white border-neutral-900" : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                    }`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedWoods([...selectedWoods, wood.name]);
                          else setSelectedWoods(selectedWoods.filter(w => w !== wood.name));
                        }}
                        className="sr-only"
                      />
                      <span className="text-xs font-medium">{wood.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Fabric Options Selector */}
            <div className="space-y-2 border-t border-neutral-100 pt-4">
              <label className="block text-neutral-700 font-semibold">Available Fabric & Upholstery Options</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {fabricList.map((fab) => {
                  const checked = selectedFabrics.includes(fab.name);
                  return (
                    <label key={fab.id} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      checked ? "bg-neutral-900 text-white border-neutral-900" : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                    }`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedFabrics([...selectedFabrics, fab.name]);
                          else setSelectedFabrics(selectedFabrics.filter(f => f !== fab.name));
                        }}
                        className="sr-only"
                      />
                      <span className="text-xs font-medium">{fab.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: PRICING
            ======================================================== */}
        {activeTab === "pricing" && (
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-6 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1.5">Pricing Model</label>
                <select
                  value={pricingType}
                  onChange={(e) => setPricingType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:bg-white text-neutral-900 font-medium"
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="starting_from">Starting From Price</option>
                  <option value="on_request">Price on Request</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1.5">Catalog Price (INR ₹)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="e.g. 45700"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:bg-white text-neutral-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1.5">Display Setting</label>
                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={displayPrice}
                      onChange={(e) => setDisplayPrice(e.target.checked)}
                      className="w-4 h-4 rounded text-black focus:ring-black"
                    />
                    <span className="font-medium text-neutral-800">Display price publicly on zoosh.in</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Price Breakdown / Multi-Tier Pricing */}
            <div className="space-y-3 border-t border-neutral-100 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-neutral-900">Custom Size / Dimension Price Breakdown</h4>
                  <p className="text-neutral-500">Add price variants for different lengths, setups, or configurations.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddPriceBreakdown}
                  className="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 text-neutral-800 font-medium rounded-lg hover:bg-neutral-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Tier
                </button>
              </div>

              {priceBreakdowns.map((row, idx) => (
                <div key={idx} className="flex gap-3 items-center bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <input
                    type="text"
                    value={row.label}
                    onChange={(e) => {
                      const updated = [...priceBreakdowns];
                      updated[idx].label = e.target.value;
                      setPriceBreakdowns(updated);
                    }}
                    placeholder="e.g. Grand Three Seater (240 cm)"
                    className="flex-1 px-3 py-1.5 bg-white border border-neutral-200 rounded text-neutral-900"
                  />
                  <input
                    type="number"
                    value={row.price}
                    onChange={(e) => {
                      const updated = [...priceBreakdowns];
                      updated[idx].price = Number(e.target.value);
                      setPriceBreakdowns(updated);
                    }}
                    placeholder="Price in INR"
                    className="w-36 px-3 py-1.5 bg-white border border-neutral-200 rounded text-neutral-900 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setPriceBreakdowns(priceBreakdowns.filter((_, i) => i !== idx))}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: SEO & METADATA
            ======================================================== */}
        {activeTab === "seo" && (
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-4 text-xs">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1.5">Custom URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}
                placeholder="e.g. grand-cloud-boucle-sofa"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:bg-white text-neutral-900 font-mono"
              />
              <p className="text-[11px] text-neutral-400 mt-1">Live URL: https://zoosh.in/products/{slug || "example-slug"}</p>
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1.5">SEO Meta Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="e.g. Grand Cloud Bouclé Sofa | Custom Teak Furniture Kerala | ZOOSH"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:bg-white text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1.5">SEO Meta Description</label>
              <textarea
                rows={3}
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                placeholder="Short description for Google search snippets..."
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:bg-white text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1.5">Keywords (Comma Separated)</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="custom sofa, teak wood sofa, kerala furniture, living room, zoosh"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:bg-white text-neutral-900"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
