"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm from "../../product-form";
import { adminDb, AdminProduct } from "@/lib/admin-db";

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (id) {
        const found = await adminDb.getProductById(id);
        setProduct(found);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-xs text-neutral-400">Loading product details...</div>;
  }

  if (!product) {
    return <div className="p-8 text-center text-xs text-red-500">Product not found.</div>;
  }

  return <ProductForm initialData={product} isEdit={true} />;
}
