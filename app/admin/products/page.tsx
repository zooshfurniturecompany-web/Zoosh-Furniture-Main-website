"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  ArrowUpDown
} from "lucide-react";
import { adminDb, AdminProduct, Category, Collection } from "@/lib/admin-db";

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(val);
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [collectionFilter, setCollectionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("newest");

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

  const handleArchive = async (id: string) => {
    if (confirm("Are you sure you want to archive this product?")) {
      await adminDb.archiveProduct(id);
      loadData();
    }
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

  // Pagination slice
  const totalPages = Math.ceil(products.length / pageSize) || 1;
  const paginatedProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 tracking-tight">
            Product Catalog
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-1">
            Manage, publish, and customize all handcrafted furniture pieces for zoosh.in
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Add Product
        </Link>
      </div>

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
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No products found matching your search or filters.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const coverImg = p.images?.[0] || "/images/catalog/page_14_img_00.webp";
                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
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
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1.5 border border-neutral-200 rounded hover:bg-neutral-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-1.5 border border-neutral-200 rounded hover:bg-neutral-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
