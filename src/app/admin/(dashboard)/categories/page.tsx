"use client";

import * as React from "react";
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  Layers,
} from "lucide-react";

interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  displayOrder: number;
}

export default function ProductCategoriesPage() {
  const [categories, setCategories] = React.useState<ProductCategory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [editCategory, setEditCategory] = React.useState<ProductCategory | null>(null);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  React.useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch {
      setMessage({ type: "error", text: "Failed to load product categories." });
    } finally {
      setLoading(false);
    }
  }

  const handleOpenNew = () => {
    setEditCategory({
      id: `cat_${Date.now()}`,
      slug: "",
      name: "",
      description: "",
      displayOrder: categories.length + 1,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCategory) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editCategory),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: `Category "${editCategory.name}" saved successfully.` });
        setEditCategory(null);
        fetchCategories();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save category." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: `Category "${name}" deleted.` });
        fetchCategories();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to delete category." });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to delete category." });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-midnight-800">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-ivory-100 flex items-center gap-2.5">
            <FolderTree className="w-6 h-6 text-gold-400" />
            <span>Product Categories</span>
          </h2>
          <p className="text-xs text-ivory-400 mt-1">
            Organize energy storage systems, direct-current architectures, and solar solutions into technical classification tiers.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-midnight-950 font-bold text-xs shadow-goldGlow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
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

      {/* Categories Table */}
      <div className="bg-midnight-900 border border-midnight-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-midnight-800 flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase text-ivory-400">
            Active Product Taxonomies ({categories.length})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-midnight-950/80 text-ivory-400 font-mono text-[10px] uppercase border-b border-midnight-800">
              <tr>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Slug Identifier</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-midnight-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-ivory-400">Loading categories...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-ivory-400">No categories found. Click &quot;Add New Category&quot; above.</td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-midnight-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-gold-400 font-bold">
                      {cat.displayOrder}
                    </td>
                    <td className="py-3 px-4 font-semibold text-ivory-100 flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-gold-400" />
                      <span>{cat.name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-ivory-400">
                      {cat.slug}
                    </td>
                    <td className="py-3 px-4 text-ivory-300 max-w-sm truncate">
                      {cat.description || "—"}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setEditCategory(cat)}
                        className="p-1.5 rounded hover:bg-midnight-800 text-ivory-300 hover:text-white"
                        title="Edit Category"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 rounded hover:bg-rose-500/10 text-rose-400 hover:text-rose-300"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Edit Modal */}
      {editCategory && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-midnight-900 border border-midnight-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-midnight-800 pb-3">
              <h3 className="font-heading font-bold text-sm text-ivory-100">
                {editCategory.slug ? "Edit Category" : "New Category"}
              </h3>
              <button
                onClick={() => setEditCategory(null)}
                className="text-ivory-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-ivory-300 font-semibold">Category Name</label>
                <input
                  type="text"
                  value={editCategory.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = editCategory.slug ? editCategory.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                    setEditCategory({ ...editCategory, name, slug });
                  }}
                  required
                  placeholder="e.g. Battery Energy Storage Systems"
                  className="w-full px-3 py-2 rounded bg-midnight-950 border border-midnight-700 text-ivory-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-ivory-300 font-semibold">Slug Identifier</label>
                <input
                  type="text"
                  value={editCategory.slug}
                  onChange={(e) => setEditCategory({ ...editCategory, slug: e.target.value })}
                  required
                  placeholder="e.g. energy-storage"
                  className="w-full px-3 py-2 rounded bg-midnight-950 border border-midnight-700 text-ivory-100 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-ivory-300 font-semibold">Description</label>
                <textarea
                  rows={3}
                  value={editCategory.description || ""}
                  onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
                  placeholder="Brief summary of systems categorized under this tier..."
                  className="w-full px-3 py-2 rounded bg-midnight-950 border border-midnight-700 text-ivory-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-ivory-300 font-semibold">Display Order</label>
                <input
                  type="number"
                  value={editCategory.displayOrder}
                  onChange={(e) => setEditCategory({ ...editCategory, displayOrder: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded bg-midnight-950 border border-midnight-700 text-ivory-100 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-midnight-800">
                <button
                  type="button"
                  onClick={() => setEditCategory(null)}
                  className="px-4 py-2 rounded bg-midnight-800 text-ivory-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded bg-gold-500 hover:bg-gold-600 text-midnight-950 font-bold"
                >
                  {saving ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
