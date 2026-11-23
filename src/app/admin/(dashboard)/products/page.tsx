"use client";

import * as React from "react";
import Image from "next/image";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sliders,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { DBProduct, DBProductCategory } from "@/lib/db/store";

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<DBProduct[]>([]);
  const [categories, setCategories] = React.useState<DBProductCategory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedProduct, setSelectedProduct] = React.useState<DBProduct | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [modalTab, setModalTab] = React.useState<"basic" | "specs" | "features" | "media" | "seo">("basic");
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("ALL");
  const [statusFilter, setStatusFilter] = React.useState("ALL");

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [pRes, cRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);
      const pData = await pRes.json();
      const cData = await cRes.json();
      if (pData.success) setProducts(pData.products);
      if (cData.success) setCategories(cData.categories);
    } catch (err) {
      console.error("Failed to load products/categories:", err);
      setMessage({ type: "error", text: "Failed to load product catalog data." });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

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
        setMessage({ type: "success", text: `Product "${product.name}" status updated to ${newStatus}.` });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to update product status." });
    }
  };

  const handleOpenCreate = () => {
    const newProd: DBProduct = {
      id: `prod_${Date.now()}`,
      name: "",
      slug: "",
      sku: `FS-${Date.now().toString().slice(-4)}`,
      categoryId: categories[0]?.id || "cat_storage",
      summary: "",
      description: "",
      status: "DRAFT",
      featured: false,
      displayOrder: products.length + 1,
      specifications: {
        "Nominal Operating Bus": "51.2 V DC",
        "Battery Chemistry": "Lithium Iron Phosphate (LiFePO4)",
        "Depth of Discharge": "90%",
        "Cycle Endurance": "6,000+ Cycles",
        "Round-Trip Efficiency": ">95%",
      },
      features: [
        "High-density modular energy storage",
        "Direct compatibility with Flash DC bus",
        "Integrated dual-redundant active BMS",
      ],
      galleryImages: ["/images/flash-power-wall.jpg"],
      datasheetUrl: "/docs/flash-power-wall-datasheet.pdf",
      metaTitle: "",
      metaDescription: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSelectedProduct(newProd);
    setModalTab("basic");
    setIsEditing(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setSaving(true);
    setMessage(null);

    try {
      const isNew = !products.some((p) => p.id === selectedProduct.id);
      const url = isNew ? "/api/products" : `/api/products/${selectedProduct.id}`;
      const method = isNew ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedProduct),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: `Product "${selectedProduct.name}" saved and synced with public catalog.` });
        setIsEditing(false);
        setSelectedProduct(null);
        fetchData();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save product." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error saving product." });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: `Product "${name}" deleted.` });
        fetchData();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to delete product." });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to delete product." });
    }
  };

  // Specification management
  const handleAddSpecRow = () => {
    if (!selectedProduct) return;
    setSelectedProduct({
      ...selectedProduct,
      specifications: {
        ...selectedProduct.specifications,
        [`Parameter ${Object.keys(selectedProduct.specifications).length + 1}`]: "Value",
      },
    });
  };

  const handleRemoveSpecKey = (keyToRemove: string) => {
    if (!selectedProduct) return;
    const nextSpecs = { ...selectedProduct.specifications };
    delete nextSpecs[keyToRemove];
    setSelectedProduct({ ...selectedProduct, specifications: nextSpecs });
  };

  const handleUpdateSpec = (oldKey: string, newKey: string, value: string) => {
    if (!selectedProduct) return;
    const nextSpecs: Record<string, string> = {};
    for (const [k, v] of Object.entries(selectedProduct.specifications)) {
      if (k === oldKey) {
        nextSpecs[newKey] = value;
      } else {
        nextSpecs[k] = v;
      }
    }
    setSelectedProduct({ ...selectedProduct, specifications: nextSpecs });
  };

  // Feature list management
  const handleAddFeature = () => {
    if (!selectedProduct) return;
    setSelectedProduct({
      ...selectedProduct,
      features: [...selectedProduct.features, "New engineering capability"],
    });
  };

  const handleUpdateFeature = (index: number, val: string) => {
    if (!selectedProduct) return;
    const nextF = [...selectedProduct.features];
    nextF[index] = val;
    setSelectedProduct({ ...selectedProduct, features: nextF });
  };

  const handleRemoveFeature = (index: number) => {
    if (!selectedProduct) return;
    const nextF = [...selectedProduct.features];
    nextF.splice(index, 1);
    setSelectedProduct({ ...selectedProduct, features: nextF });
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === "ALL" || p.categoryId === categoryFilter;
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-midnight-800">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-ivory-100 flex items-center gap-2.5">
            <Package className="w-6 h-6 text-gold-400" />
            <span>Product Catalog CMS</span>
          </h2>
          <p className="text-xs text-ivory-400 mt-1">
            Engineered battery systems, direct-current microgrid architectures, and hybrid solar hardware with dynamic specifications.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-midnight-950 font-bold text-xs shadow-goldGlow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add System / Product</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-3 border ${
            message.type === "success"
              ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-200"
              : "bg-rose-950/60 border-rose-500/40 text-rose-200"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-midnight-900 border border-midnight-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-ivory-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title, SKU, or specs..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-midnight-950 border border-midnight-700 text-ivory-100 text-xs placeholder:text-ivory-500 focus:outline-none focus:border-gold-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-ivory-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-midnight-950 border border-midnight-700 text-ivory-200 text-xs"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-midnight-950 border border-midnight-700 text-ivory-200 text-xs font-mono"
          >
            <option value="ALL">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="p-12 text-center text-ivory-400 text-xs font-mono">
          Loading hardware catalog...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-midnight-900 border border-midnight-800 rounded-2xl text-ivory-400 text-xs">
          No products matched your search or filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const category = categories.find((c) => c.id === product.categoryId);
            const mainImg = product.galleryImages?.[0] || "/images/flash-power-wall.jpg";

            return (
              <div
                key={product.id}
                className="bg-midnight-900 border border-midnight-800 hover:border-gold-500/40 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition-all group"
              >
                <div>
                  {/* Image container */}
                  <div className="relative w-full h-44 bg-midnight-950 border-b border-midnight-800 overflow-hidden">
                    <Image
                      src={mainImg}
                      alt={product.name}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-transparent to-transparent opacity-80" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="font-mono text-[9px] font-bold bg-midnight-950/90 text-gold-400 border border-gold-500/40 px-2 py-0.5 rounded shadow">
                        {product.sku || "FS-PROD"}
                      </span>
                      {product.featured && (
                        <span className="bg-amber-500 text-midnight-950 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" /> Featured
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => handleToggleStatus(product)}
                        className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border shadow transition-colors ${
                          product.status === "PUBLISHED"
                            ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/50"
                            : "bg-midnight-900/90 text-ivory-400 border-midnight-700"
                        }`}
                      >
                        {product.status}
                      </button>
                    </div>

                    <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center text-[10px] text-ivory-300 font-mono">
                      <span>{category?.name || "Energy Storage"}</span>
                      <span>{Object.keys(product.specifications || {}).length} Parameters</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-heading font-extrabold text-ivory-100 group-hover:text-gold-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-ivory-400 line-clamp-2 leading-relaxed">
                      {product.summary}
                    </p>

                    {/* Quick Specs Highlight */}
                    <div className="pt-3 border-t border-midnight-800/80 space-y-1.5 text-xs">
                      {Object.entries(product.specifications || {}).slice(0, 3).map(([key, val]) => (
                        <div key={key} className="flex justify-between text-[11px]">
                          <span className="text-ivory-400 truncate max-w-[140px]">{key}:</span>
                          <span className="font-mono font-semibold text-ivory-200 truncate max-w-[120px]">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-midnight-800/80 bg-midnight-950/50 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-ivory-500">
                    /{product.slug}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedProduct(JSON.parse(JSON.stringify(product)));
                        setModalTab("basic");
                        setIsEditing(true);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-midnight-800 hover:bg-midnight-700 text-ivory-200 text-xs font-medium border border-midnight-700 transition-colors"
                      title="Edit Product"
                    >
                      <Edit className="w-3.5 h-3.5 text-gold-400" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Comprehensive Product Edit / Creation Modal */}
      {isEditing && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleSaveProduct}
            className="bg-midnight-900 border border-midnight-700 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Modal Top Header */}
            <div className="p-5 border-b border-midnight-800 flex items-center justify-between bg-midnight-950/60">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 font-bold block">
                  Product Editor
                </span>
                <h3 className="text-lg font-heading font-bold text-ivory-100">
                  {selectedProduct.name || "New Energy System"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedProduct(null);
                }}
                className="p-1.5 rounded-md text-ivory-400 hover:text-white hover:bg-midnight-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-midnight-800 bg-midnight-950/30 px-5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setModalTab("basic")}
                className={`py-3 px-3 border-b-2 transition-colors ${
                  modalTab === "basic" ? "border-gold-500 text-gold-400" : "border-transparent text-ivory-400 hover:text-ivory-200"
                }`}
              >
                Basic Info
              </button>
              <button
                type="button"
                onClick={() => setModalTab("specs")}
                className={`py-3 px-3 border-b-2 transition-colors ${
                  modalTab === "specs" ? "border-gold-500 text-gold-400" : "border-transparent text-ivory-400 hover:text-ivory-200"
                }`}
              >
                Specifications ({Object.keys(selectedProduct.specifications || {}).length})
              </button>
              <button
                type="button"
                onClick={() => setModalTab("features")}
                className={`py-3 px-3 border-b-2 transition-colors ${
                  modalTab === "features" ? "border-gold-500 text-gold-400" : "border-transparent text-ivory-400 hover:text-ivory-200"
                }`}
              >
                Features ({selectedProduct.features?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setModalTab("media")}
                className={`py-3 px-3 border-b-2 transition-colors ${
                  modalTab === "media" ? "border-gold-500 text-gold-400" : "border-transparent text-ivory-400 hover:text-ivory-200"
                }`}
              >
                Media & Downloads
              </button>
              <button
                type="button"
                onClick={() => setModalTab("seo")}
                className={`py-3 px-3 border-b-2 transition-colors ${
                  modalTab === "seo" ? "border-gold-500 text-gold-400" : "border-transparent text-ivory-400 hover:text-ivory-200"
                }`}
              >
                SEO & Meta
              </button>
            </div>

            {/* Modal Tab Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {/* TAB 1: BASIC INFO */}
              {modalTab === "basic" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-ivory-300 font-semibold">Product Name</label>
                      <input
                        type="text"
                        value={selectedProduct.name}
                        onChange={(e) => {
                          const name = e.target.value;
                          const slug = selectedProduct.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                          setSelectedProduct({ ...selectedProduct, name, slug });
                        }}
                        required
                        placeholder="e.g. Flash Power Wall"
                        className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-ivory-300 font-semibold">Slug Identifier</label>
                      <input
                        type="text"
                        value={selectedProduct.slug}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, slug: e.target.value })}
                        required
                        className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-ivory-300 font-semibold">SKU / Model Code</label>
                      <input
                        type="text"
                        value={selectedProduct.sku || ""}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, sku: e.target.value })}
                        className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-ivory-300 font-semibold">Category</label>
                      <select
                        value={selectedProduct.categoryId}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, categoryId: e.target.value })}
                        className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-ivory-300 font-semibold">Publishing Status</label>
                      <select
                        value={selectedProduct.status}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, status: e.target.value as "PUBLISHED" | "DRAFT" })}
                        className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 font-mono"
                      >
                        <option value="PUBLISHED">PUBLISHED</option>
                        <option value="DRAFT">DRAFT</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-ivory-300">
                      <input
                        type="checkbox"
                        checked={selectedProduct.featured}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, featured: e.target.checked })}
                        className="rounded border-midnight-700 bg-midnight-950 text-gold-500"
                      />
                      <span>Feature on Homepage Showcase</span>
                    </label>
                  </div>

                  <div className="space-y-1">
                    <label className="text-ivory-300 font-semibold">Summary Headline (Short)</label>
                    <input
                      type="text"
                      value={selectedProduct.summary}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, summary: e.target.value })}
                      required
                      placeholder="Brief 1-sentence engineering elevator pitch..."
                      className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-ivory-300 font-semibold">Full Technical & Engineering Description</label>
                    <textarea
                      rows={5}
                      value={selectedProduct.description}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                      required
                      placeholder="Comprehensive architectural description..."
                      className="w-full p-3 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: SPECIFICATIONS */}
              {modalTab === "specs" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-ivory-100">
                        Configurable Technical Specifications Matrix
                      </h4>
                      <p className="text-ivory-400 text-[11px]">
                        Add, modify or delete physical, electrical, and thermal parameters without touching React components.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSpecRow}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gold-500/20 text-gold-400 border border-gold-500/30 hover:bg-gold-500/30 font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Parameter</span>
                    </button>
                  </div>

                  <div className="space-y-2 border border-midnight-800 rounded-xl p-3 bg-midnight-950/40">
                    {Object.entries(selectedProduct.specifications || {}).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-2">
                        <input
                          type="text"
                          defaultValue={key}
                          onBlur={(e) => {
                            if (e.target.value && e.target.value !== key) {
                              handleUpdateSpec(key, e.target.value, val);
                            }
                          }}
                          placeholder="Parameter Name"
                          className="w-1/2 px-3 py-2 bg-midnight-950 border border-midnight-700 rounded text-ivory-200"
                        />
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => handleUpdateSpec(key, key, e.target.value)}
                          placeholder="Value"
                          className="w-1/2 px-3 py-2 bg-midnight-950 border border-midnight-700 rounded text-ivory-100 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecKey(key)}
                          className="p-2 text-rose-400 hover:bg-rose-500/10 rounded"
                          title="Remove Parameter"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: FEATURES */}
              {modalTab === "features" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-ivory-100">
                        Key Features & Architectural Pillars
                      </h4>
                      <p className="text-ivory-400 text-[11px]">
                        Bullet highlights presented on public product showcase and specification sheets.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gold-500/20 text-gold-400 border border-gold-500/30 hover:bg-gold-500/30 font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Feature</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {selectedProduct.features?.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-gold-400 font-mono text-[10px] w-5 text-right font-bold">{idx + 1}.</span>
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                          className="flex-1 px-3 py-2 bg-midnight-950 border border-midnight-700 rounded text-ivory-100"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="p-2 text-rose-400 hover:bg-rose-500/10 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: MEDIA & DOWNLOADS */}
              {modalTab === "media" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-ivory-300 font-semibold">Primary Product Image URL</label>
                    <input
                      type="text"
                      value={selectedProduct.galleryImages?.[0] || ""}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, galleryImages: [e.target.value] })}
                      placeholder="/images/flash-power-wall.jpg"
                      className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 font-mono"
                    />
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedProduct({ ...selectedProduct, galleryImages: ["/images/flash-power-wall.jpg"] })}
                        className="text-[10px] text-gold-400 hover:underline font-mono"
                      >
                        Set to Power Wall Photo
                      </button>
                      <span className="text-midnight-700">•</span>
                      <button
                        type="button"
                        onClick={() => setSelectedProduct({ ...selectedProduct, galleryImages: ["/images/solar-photovoltaic-generation.jpg"] })}
                        className="text-[10px] text-gold-400 hover:underline font-mono"
                      >
                        Set to Solar Farm Photo
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-ivory-300 font-semibold">Product Datasheet PDF URL</label>
                    <input
                      type="text"
                      value={selectedProduct.datasheetUrl || ""}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, datasheetUrl: e.target.value })}
                      placeholder="/docs/flash-power-wall-datasheet.pdf"
                      className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 font-mono"
                    />
                    <span className="text-[10px] text-ivory-400">
                      Public visitors can download this technical sheet directly from the showcase.
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 5: SEO */}
              {modalTab === "seo" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-ivory-300 font-semibold">SEO Meta Title</label>
                    <input
                      type="text"
                      value={selectedProduct.metaTitle || ""}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, metaTitle: e.target.value })}
                      placeholder="Flash Power Wall | 51.2V LiFePO4 Energy Storage"
                      className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-ivory-300 font-semibold">SEO Meta Description</label>
                    <textarea
                      rows={3}
                      value={selectedProduct.metaDescription || ""}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, metaDescription: e.target.value })}
                      placeholder="Comprehensive search engine snippet..."
                      className="w-full p-3 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 leading-relaxed"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-midnight-800 bg-midnight-950/80 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedProduct(null);
                }}
                className="px-4 py-2 rounded-lg bg-midnight-800 text-ivory-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-midnight-950 font-bold transition-colors shadow-goldGlow disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving Product..." : "Save Product"}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
