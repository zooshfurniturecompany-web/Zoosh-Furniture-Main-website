"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  PlusCircle,
  Search,
  Filter,
  Package,
  Edit,
  Trash2,
  Copy,
  Archive,
  Eye,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  Save,
  Check,
  RotateCcw,
  SlidersHorizontal,
  GripVertical,
  Loader2
} from "lucide-react";
import { adminDb, AdminProduct, Category, Collection } from "@/lib/admin-db";

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(val);
};

function AdminProductsContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "reorder" ? "reorder" : "table";

  const [mode, setMode] = useState<"table" | "reorder">(initialMode);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [reorderList, setReorderList] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [orderSavedSuccess, setOrderSavedSuccess] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [collectionFilter, setCollectionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("order");

  // Reference lists
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    loadData();
  }, [categoryFilter, collectionFilter, statusFilter, sort]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, cols, prods] = await Promise.all([
        adminDb.getCategories(),
        adminDb.getCollections(),
        adminDb.getProducts({
          search,
          category: categoryFilter,
          collection: collectionFilter,
          status: statusFilter,
          sort
        })
      ]);
      setCategories(cats);
      setCollections(cols);
      setProducts(prods);

      // Also get complete master product list for reorder mode
      const allMaster = await adminDb.getProducts({ sort: "order" });
      setReorderList(allMaster);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleTogglePublish = async (id: string) => {
    await adminDb.togglePublish(id);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this product?")) {
      await adminDb.deleteProduct(id);
      loadData();
    }
  };

  const handleDuplicate = async (id: string) => {
    await adminDb.duplicateProduct(id);
    loadData();
  };

  // Reorder Functions
  const moveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= reorderList.length) return;
    const updated = [...reorderList];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setReorderList(updated);
    setHasUnsavedChanges(true);
  };

  const moveToPosition = (fromIndex: number, targetPosition: number) => {
    const clamped = Math.max(1, Math.min(targetPosition, reorderList.length));
    moveItem(fromIndex, clamped - 1);
  };

  const handleSaveOrder = async () => {
    setIsSavingOrder(true);
    try {
      const orderedIds = reorderList.map((p) => p.id);
      await adminDb.reorderProducts(orderedIds);
      setHasUnsavedChanges(false);
      setOrderSavedSuccess(true);
      setTimeout(() => setOrderSavedSuccess(false), 3000);
      loadData();
    } catch (err) {
      console.error("Failed to save product order:", err);
      alert("Failed to save product order. Please try again.");
    } finally {
      setIsSavingOrder(false);
    }
  };

  // Quick single-item order adjustment in table view
  const handleQuickShift = async (id: string, delta: number) => {
    const list = [...products];
    const currentIndex = list.findIndex((p) => p.id === id);
    if (currentIndex === -1) return;
    const targetIndex = currentIndex + delta;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const [item] = list.splice(currentIndex, 1);
    list.splice(targetIndex, 0, item);
    
    const orderedIds = list.map((p) => p.id);
    await adminDb.reorderProducts(orderedIds);
    loadData();
  };

  // Pagination slice for Table View
  const totalPages = Math.ceil(products.length / pageSize) || 1;
  const paginatedProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Filtered list in reorder mode
  const filteredReorderList = reorderList.filter((p) => {
    if (categoryFilter !== "all" && p.category_name.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 tracking-tight">
            Product Catalog & Ordering
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-1">
            Manage product details, pricing, and exact display order on the storefront and homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Switcher Tabs */}
          <div className="inline-flex items-center p-1 bg-neutral-100 rounded-lg border border-neutral-200 text-xs">
            <button
              type="button"
              onClick={() => setMode("table")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                mode === "table"
                  ? "bg-white text-black shadow-xs font-semibold"
                  : "text-neutral-500 hover:text-black"
              }`}
            >
              Table View
            </button>
            <button
              type="button"
              onClick={() => setMode("reorder")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                mode === "reorder"
                  ? "bg-white text-black shadow-xs font-semibold"
                  : "text-neutral-500 hover:text-black"
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Reorder Catalog</span>
              {hasUnsavedChanges && (
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              )}
            </button>
          </div>

          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Success Banner */}
      {orderSavedSuccess && (
        <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Product display order successfully updated and published to the live website!</span>
          </div>
        </div>
      )}

      {/* =========================================================
          MODE 1: REORDER CATALOG (DRAG & DROP / DIRECT POSITIONING)
          ========================================================= */}
      {mode === "reorder" ? (
        <div className="space-y-4">
          {/* Reorder Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
              <span className="font-semibold text-neutral-800 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-neutral-500" />
                Filter list:
              </span>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700 font-medium focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="all">All Categories ({reorderList.length} items)</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>

              {/* Quick Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Filter by name/SKU..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              {hasUnsavedChanges && (
                <span className="text-xs text-amber-600 font-medium">
                  Unsaved position changes
                </span>
              )}
              <button
                type="button"
                onClick={handleSaveOrder}
                disabled={isSavingOrder || !hasUnsavedChanges}
                className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 disabled:opacity-50 transition-all shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingOrder ? "Saving..." : "Save & Publish Order"}</span>
              </button>
            </div>
          </div>

          {/* Reorder List Card */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 space-y-3">
            <div className="text-xs text-neutral-500 pb-2 border-b border-neutral-100 flex items-center justify-between">
              <span>
                Use the arrows or type a target rank number to position which products appear first on the homepage and catalog.
              </span>
              <span className="font-semibold text-neutral-700">
                Total Products: {filteredReorderList.length}
              </span>
            </div>

            <div className="space-y-2 divide-y divide-neutral-100">
              {filteredReorderList.map((product, index) => {
                const coverImg = product.images?.[0] || "/images/products/sf001-1.jpg";
                const masterIndex = reorderList.findIndex((p) => p.id === product.id);
                const displayRank = masterIndex + 1;

                return (
                  <div
                    key={product.id}
                    className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 rounded-lg hover:bg-neutral-50/80 transition-colors border border-transparent hover:border-neutral-200"
                  >
                    {/* Left: Rank Badge + Thumbnail + Product Info */}
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      {/* Rank Position Badge */}
                      <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex flex-col items-center justify-center shrink-0 shadow-xs">
                        <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-mono">Rank</span>
                        <span className="text-sm font-bold font-mono leading-none">#{displayRank}</span>
                      </div>

                      {/* Thumbnail */}
                      <div className="w-12 h-14 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                        <img
                          src={coverImg}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Name & SKU */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-neutral-900 text-sm truncate">
                            {product.name}
                          </h4>
                          {product.featured && (
                            <span className="inline-flex text-[9px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.5 rounded">
                              Featured
                            </span>
                          )}
                          <span className={`inline-flex text-[9px] px-1.5 py-0.5 rounded font-medium ${
                            product.status === "published"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-neutral-100 text-neutral-600"
                          }`}>
                            {product.status}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 flex items-center gap-2 mt-0.5">
                          <span className="font-mono">{product.sku}</span>
                          <span>•</span>
                          <span>{product.category_name}</span>
                          <span>•</span>
                          <span className="font-semibold text-neutral-900">{formatCurrency(product.price)}</span>
                        </p>
                      </div>
                    </div>

                    {/* Right: Quick Action Controls */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                      {/* Direct Move to # Input */}
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 bg-neutral-100 px-2.5 py-1.5 rounded-lg border border-neutral-200">
                        <span>Move to #:</span>
                        <input
                          type="number"
                          min={1}
                          max={reorderList.length}
                          defaultValue={displayRank}
                          key={displayRank}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const val = parseInt((e.target as HTMLInputElement).value, 10);
                              if (!isNaN(val)) moveToPosition(masterIndex, val);
                            }
                          }}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val) && val !== displayRank) {
                              moveToPosition(masterIndex, val);
                            }
                          }}
                          className="w-12 text-center font-mono font-bold text-neutral-900 bg-white border border-neutral-300 rounded py-0.5 text-xs focus:outline-none focus:border-black"
                        />
                      </div>

                      {/* Move Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveItem(masterIndex, 0)}
                          disabled={masterIndex === 0}
                          className="p-2 border border-neutral-200 rounded-lg hover:bg-neutral-100 disabled:opacity-30 transition-colors text-neutral-700"
                          title="Move to Very Top (#1)"
                        >
                          <ChevronsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(masterIndex, masterIndex - 1)}
                          disabled={masterIndex === 0}
                          className="p-2 border border-neutral-200 rounded-lg hover:bg-neutral-100 disabled:opacity-30 transition-colors text-neutral-700"
                          title="Move Up One Spot"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(masterIndex, masterIndex + 1)}
                          disabled={masterIndex === reorderList.length - 1}
                          className="p-2 border border-neutral-200 rounded-lg hover:bg-neutral-100 disabled:opacity-30 transition-colors text-neutral-700"
                          title="Move Down One Spot"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(masterIndex, reorderList.length - 1)}
                          disabled={masterIndex === reorderList.length - 1}
                          className="p-2 border border-neutral-200 rounded-lg hover:bg-neutral-100 disabled:opacity-30 transition-colors text-neutral-700"
                          title="Move to Very Bottom"
                        >
                          <ChevronsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================
            MODE 2: STANDARD TABLE VIEW WITH ORDER COLUMN
            ========================================================= */
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
              <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by name, SKU, wood, or category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all"
                />
              </form>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto text-xs">
                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700 font-medium focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>

                {/* Collection Filter */}
                <select
                  value={collectionFilter}
                  onChange={(e) => { setCollectionFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700 font-medium focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="all">All Collections</option>
                  {collections.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700 font-medium focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published Only</option>
                  <option value="draft">Drafts Only</option>
                  <option value="archived">Archived</option>
                </select>

                {/* Sort */}
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700 font-medium focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="order">Custom Order (Rank)</option>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="sku-asc">SKU A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-50/80 border-b border-neutral-100 text-neutral-500 uppercase tracking-wider font-semibold">
                    <th className="py-3.5 px-4 w-20 text-center">Rank #</th>
                    <th className="py-3.5 px-4">Item & Dimensions</th>
                    <th className="py-3.5 px-4">SKU</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Wood Species</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-neutral-400">
                        <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        No products found matching your search or filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((p, index) => {
                      const coverImg = p.images?.[0] || "/images/catalog/page_14_img_00.webp";
                      const globalIndex = (currentPage - 1) * pageSize + index;
                      const displayOrder = typeof p.display_order === "number" ? p.display_order : globalIndex + 1;

                      return (
                        <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                          {/* Order Rank Badge & Shift */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="inline-flex items-center gap-1">
                              <span className="font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-1 rounded text-xs">
                                #{displayOrder}
                              </span>
                              <div className="flex flex-col">
                                <button
                                  type="button"
                                  onClick={() => handleQuickShift(p.id, -1)}
                                  disabled={globalIndex === 0}
                                  className="text-neutral-400 hover:text-black disabled:opacity-20 transition-colors"
                                  title="Move Up"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleQuickShift(p.id, 1)}
                                  disabled={globalIndex === products.length - 1}
                                  className="text-neutral-400 hover:text-black disabled:opacity-20 transition-colors"
                                  title="Move Down"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </td>

                          {/* Thumbnail & Title */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-14 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                                <img
                                  src={coverImg}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <p className="font-semibold text-neutral-900 line-clamp-1">{p.name}</p>
                                  {p.featured && (
                                    <span className="inline-flex items-center text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.2 rounded">
                                      Featured
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-neutral-400 line-clamp-1">{p.dimensions}</p>
                              </div>
                            </div>
                          </td>

                          {/* SKU */}
                          <td className="py-3.5 px-4 font-mono font-medium text-neutral-600">
                            {p.sku}
                          </td>

                          {/* Category */}
                          <td className="py-3.5 px-4 text-neutral-600">
                            {p.category_name}
                          </td>

                          {/* Material */}
                          <td className="py-3.5 px-4 text-neutral-600">
                            <span className="line-clamp-1">{p.material}</span>
                          </td>

                          {/* Price */}
                          <td className="py-3.5 px-4 font-semibold text-neutral-900">
                            {p.display_price ? formatCurrency(p.price) : "Price on Request"}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleTogglePublish(p.id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                                p.status === "published"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                  : p.status === "draft"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                                  : "bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200"
                              }`}
                              title="Click to toggle publish/draft"
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                p.status === "published" ? "bg-emerald-500" : p.status === "draft" ? "bg-amber-500" : "bg-neutral-400"
                              }`}></span>
                              {p.status === "published" ? "Published" : p.status === "draft" ? "Draft" : "Archived"}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={"/products/" + p.slug}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 text-neutral-400 hover:text-black rounded hover:bg-neutral-100 transition-colors"
                                title="View on Storefront"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                              <Link
                                href={"/admin/products/" + p.id + "/edit"}
                                className="p-1.5 text-neutral-600 hover:text-black rounded hover:bg-neutral-100 transition-colors"
                                title="Edit Product"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                onClick={() => handleDuplicate(p.id)}
                                className="p-1.5 text-neutral-400 hover:text-black rounded hover:bg-neutral-100 transition-colors"
                                title="Duplicate Product"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(p.id)}
                                className="p-1.5 text-neutral-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
              <span>
                Showing {paginatedProducts.length} of {products.length} products
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 border border-neutral-200 rounded hover:bg-neutral-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 border border-neutral-200 rounded hover:bg-neutral-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px] text-xs text-neutral-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading products catalog...</span>
        </div>
      }
    >
      <AdminProductsContent />
    </Suspense>
  );
}
