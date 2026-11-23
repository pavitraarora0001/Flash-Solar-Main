"use client";

import * as React from "react";
import { Package, Plus, CheckCircle2, AlertCircle, Edit, Trash2, X, Save } from "lucide-react";
import { DBProduct } from "@/lib/db/store";

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<DBProduct[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedProduct, setSelectedProduct] = React.useState<DBProduct | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const fetchProducts = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleToggleStatus = async (product: DBProduct) => {
    const newStatus = product.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, status: newStatus } : p))
        );
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/products/${selectedProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedProduct),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === selectedProduct.id ? selectedProduct : p))
        );
        setIsEditing(false);
        setSelectedProduct(null);
      }
    } catch (err) {
      console.error("Failed to update product:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-midnight-800">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-ivory-100 tracking-tight">
            Product Catalog Management
          </h1>
          <p className="text-xs text-ivory-400 mt-1">
            Engineered battery systems, direct-current microgrid architecture, and inverter specifications.
          </p>
        </div>

        <button
          onClick={() => {
            const newProd: DBProduct = {
              id: `prod_${Date.now()}`,
              name: "New Solar Architecture",
              slug: `solar-arch-${Date.now().toString().slice(-4)}`,
              categoryId: "cat_storage",
              summary: "High efficiency clean energy system.",
              description: "Full architectural engineering description...",
              sku: "FS-NEW-01",
              status: "DRAFT" as const,
              featured: false,
              displayOrder: products.length + 1,
              specifications: { "Operating Voltage": "48V DC" },
              features: ["High efficiency", "Direct battery integration"],
              galleryImages: ["/images/power-wall.svg"],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            setSelectedProduct(newProd);
            setIsEditing(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-midnight-950 text-xs font-semibold transition-colors shadow"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add System / Product</span>
        </button>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-midnight-900 border border-midnight-800 rounded-xl p-5 shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] text-gold-400 uppercase tracking-wider">
                  {product.sku || "PROD-FS"}
                </span>
                <button
                  onClick={() => handleToggleStatus(product)}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-colors ${
                    product.status === "PUBLISHED"
                      ? "bg-emerald-950/80 text-emerald-300 border-emerald-800"
                      : "bg-midnight-800 text-ivory-400 border-midnight-700"
                  }`}
                >
                  {product.status}
                </button>
              </div>

              <h3 className="text-base font-heading font-bold text-ivory-100 mb-1.5">
                {product.name}
              </h3>
              <p className="text-xs text-ivory-400 line-clamp-2 leading-relaxed mb-4">
                {product.summary}
              </p>

              {/* Specs preview */}
              <div className="space-y-1.5 pt-3 border-t border-midnight-800 text-xs">
                {Object.entries(product.specifications).slice(0, 3).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-[11px]">
                    <span className="text-ivory-400">{key}:</span>
                    <span className="font-mono text-ivory-200">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-midnight-800 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedProduct(product);
                  setIsEditing(true);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-midnight-800 hover:bg-midnight-700 text-ivory-200 border border-midnight-700 text-xs transition-colors"
              >
                <Edit className="w-3.5 h-3.5 text-gold-400" />
                <span>Edit Specs</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Edit Modal */}
      {isEditing && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <form
            onSubmit={handleSaveProduct}
            className="bg-midnight-900 border border-midnight-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-midnight-800">
              <h3 className="text-lg font-heading font-bold text-ivory-100">
                Edit Product Specifications
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedProduct(null);
                }}
                className="p-1 rounded text-ivory-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-ivory-300 font-semibold mb-1">Product Name</label>
                <input
                  type="text"
                  value={selectedProduct.name}
                  onChange={(e) =>
                    setSelectedProduct({ ...selectedProduct, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>

              <div>
                <label className="block text-ivory-300 font-semibold mb-1">SKU / Identifier</label>
                <input
                  type="text"
                  value={selectedProduct.sku || ""}
                  onChange={(e) =>
                    setSelectedProduct({ ...selectedProduct, sku: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-ivory-300 font-semibold mb-1">Summary</label>
                <input
                  type="text"
                  value={selectedProduct.summary}
                  onChange={(e) =>
                    setSelectedProduct({ ...selectedProduct, summary: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>

              <div>
                <label className="block text-ivory-300 font-semibold mb-1">Full Engineering Description</label>
                <textarea
                  rows={4}
                  value={selectedProduct.description}
                  onChange={(e) =>
                    setSelectedProduct({ ...selectedProduct, description: e.target.value })
                  }
                  className="w-full p-3 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-midnight-800">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedProduct(null);
                }}
                className="px-4 py-2 rounded-lg bg-midnight-800 text-ivory-300 hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-midnight-950 font-semibold text-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? "Saving..." : "Save Product"}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
