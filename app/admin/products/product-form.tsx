"use client";

import { useState, useEffect } from "react";
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
  ExternalLink
} from "lucide-react";
import { adminDb, AdminProduct, Category, Collection, WoodType, FabricType } from "@/lib/admin-db";

interface ProductFormProps {
  initialData?: AdminProduct | null;
  isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter();

  // Active form tab
  const [activeTab, setActiveTab] = useState<"basic" | "images" | "specs" | "pricing" | "seo">("basic");
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Reference data
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [woodList, setWoodList] = useState<WoodType[]>([]);
  const [fabricList, setFabricList] = useState<FabricType[]>([]);

  // Form State
  const [name, setName] = useState(initialData?.name || "");
  const [sku, setSku] = useState(initialData?.sku || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [categoryId, setCategoryId] = useState(initialData?.category_id || "");
  const [categoryName, setCategoryName] = useState(initialData?.category_name || "Three Seater Sofa");
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
  const [images, setImages] = useState<string[]>(initialData?.images || ["/images/catalog/page_14_img_00.webp"]);
  const [newImageUrl, setNewImageUrl] = useState("");

  // SEO
  const [seoTitle, setSeoTitle] = useState(initialData?.seo_title || "");
  const [seoDesc, setSeoDesc] = useState(initialData?.seo_description || "");
  const [keywords, setKeywords] = useState<string>(initialData?.keywords?.join(", ") || "sofa, solid wood, kerala, zoosh");

  // Load supporting reference lists
  useEffect(() => {
    async function loadRefs() {
      const [cats, cols, woods, fabs] = await Promise.all([
        adminDb.getCategories(),
        adminDb.getCollections(),
        adminDb.getWoodTypes(),
        adminDb.getFabricTypes()
      ]);
      setCategories(cats);
      setCollections(cols);
      setWoodList(woods);
      setFabricList(fabs);
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

  // Add Image URL
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
                  <option value="Three Seater Sofa">Three Seater Sofa</option>
                  <option value="Two Seater Sofa">Two Seater Sofa</option>
                  <option value="Single Seater Sofa">Single Seater Sofa</option>
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
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">Product Photography Gallery</h3>
              <p className="text-neutral-500 mt-0.5">
                Add multiple high-resolution photos. The first image will be used as the primary cover photo across the storefront.
              </p>
            </div>

            {/* Add Image URL Field */}
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
                className="px-4 py-2 bg-neutral-900 text-white font-semibold rounded-lg hover:bg-black transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Image
              </button>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((imgUrl, idx) => (
                <div key={idx} className="relative group border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50 shadow-sm aspect-[4/5] flex flex-col">
                  <img
                    src={imgUrl}
                    alt={"Product image " + (idx + 1)}
                    className="w-full h-full object-cover"
                  />

                  {/* Cover Badge */}
                  {idx === 0 && (
                    <div className="absolute top-2 left-2 bg-black/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-sm">
                      Cover Photo
                    </div>
                  )}

                  {/* Image Action Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetCoverImage(idx)}
                        className="px-2 py-1 bg-white text-black text-[10px] font-semibold rounded shadow hover:bg-neutral-100 transition-colors"
                        title="Set as Main Cover Photo"
                      >
                        Set Cover
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
              ))}
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
