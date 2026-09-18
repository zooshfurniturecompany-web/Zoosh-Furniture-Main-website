"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  PlusCircle,
  FolderTree,
  TreePine,
  CheckCircle2,
  Clock,
  ChevronRight,
  Edit,
  ExternalLink
} from "lucide-react";
import { adminDb, AdminProduct } from "@/lib/admin-db";

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(val);
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{
    totalProducts: number;
    publishedProducts: number;
    draftProducts: number;
    archivedProducts: number;
    featuredProducts: number;
    totalCategories: number;
    totalCollections: number;
    totalMaterials: number;
    recentProducts: AdminProduct[];
  }>({
    totalProducts: 0,
    publishedProducts: 0,
    draftProducts: 0,
    archivedProducts: 0,
    featuredProducts: 0,
    totalCategories: 0,
    totalCollections: 0,
    totalMaterials: 0,
    recentProducts: []
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await adminDb.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Dashboard stats error:", err);
    }
  };

  const handleTogglePublish = async (id: string) => {
    await adminDb.togglePublish(id);
    loadDashboard();
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 tracking-tight">
            Product Management Dashboard
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-1">
            Manage your live storefront catalog, inventory specifications, categories, and materials.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Create Product
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Products</span>
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-bold font-sans text-neutral-900">
              {stats.totalProducts}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-neutral-500">
            <span className="font-medium text-emerald-600">{stats.publishedProducts} live</span> on zoosh.in
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Published</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-bold font-sans text-emerald-600">
              {stats.publishedProducts}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500">
            Visible on public website
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Drafts & Staging</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-bold font-sans text-amber-600">
              {stats.draftProducts}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500">
            Hidden from public store
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Categories</span>
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
              <FolderTree className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-bold font-sans text-neutral-900">
              {stats.totalCategories}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500">
            {stats.totalCollections} curated collections
          </div>
        </div>
      </div>

      {/* Quick Access Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/products"
          className="group bg-white p-5 rounded-xl border border-neutral-200 hover:border-black transition-all shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 group-hover:bg-black group-hover:text-white transition-colors flex items-center justify-center text-neutral-800">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">Manage Catalog</h3>
              <p className="text-xs text-neutral-500">View, search and edit all products</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors" />
        </Link>

        <Link
          href="/admin/categories"
          className="group bg-white p-5 rounded-xl border border-neutral-200 hover:border-black transition-all shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 group-hover:bg-black group-hover:text-white transition-colors flex items-center justify-center text-neutral-800">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">Category Rooms</h3>
              <p className="text-xs text-neutral-500">Configure Living, Dining & Bedroom</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors" />
        </Link>

        <Link
          href="/admin/materials"
          className="group bg-white p-5 rounded-xl border border-neutral-200 hover:border-black transition-all shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 group-hover:bg-black group-hover:text-white transition-colors flex items-center justify-center text-neutral-800">
              <TreePine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">Wood & Fabrics</h3>
              <p className="text-xs text-neutral-500">Manage timber species and swatches</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors" />
        </Link>
      </div>

      {/* Recently Added Products Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">Recently Added Products</h2>
            <p className="text-xs text-neutral-500 mt-0.5">The latest furniture pieces added to the master inventory</p>
          </div>
          <Link
            href="/admin/products"
            className="text-xs font-semibold text-black hover:underline flex items-center gap-1"
          >
            View All ({stats.totalProducts}) <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-100 text-neutral-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Wood & Material</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {stats.recentProducts.map((p) => {
                const coverImg = p.images?.[0] || "/images/catalog/page_14_img_00.webp";
                return (
                  <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 rounded bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                          <img
                            src={coverImg}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900 line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-neutral-400">{p.dimensions}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-medium text-neutral-600">
                      {p.sku}
                    </td>

                    <td className="py-3 px-4 text-neutral-600">
                      {p.category_name}
                    </td>

                    <td className="py-3 px-4 text-neutral-600">
                      <span className="line-clamp-1">{p.material}</span>
                    </td>

                    <td className="py-3 px-4 font-semibold text-neutral-900">
                      {p.display_price ? formatCurrency(p.price) : "Price on Request"}
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleTogglePublish(p.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                          p.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : p.status === "draft"
                            ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                            : "bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200"
                        }`}
                        title="Click to toggle publish status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          p.status === "published" ? "bg-emerald-500" : p.status === "draft" ? "bg-amber-500" : "bg-neutral-400"
                        }`}></span>
                        {p.status === "published" ? "Published" : p.status === "draft" ? "Draft" : "Archived"}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
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
                          className="p-1.5 text-neutral-600 hover:text-black rounded hover:bg-neutral-100 transition-colors font-medium text-[11px] flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
