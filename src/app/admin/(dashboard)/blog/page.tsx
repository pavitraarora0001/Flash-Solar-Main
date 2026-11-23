"use client";

import * as React from "react";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  Calendar,
  Layers,
} from "lucide-react";
import { DBBlogPost, DBBlogCategory } from "@/lib/db/store";

export default function BlogManagementPage() {
  const [posts, setPosts] = React.useState<DBBlogPost[]>([]);
  const [categories, setCategories] = React.useState<DBBlogCategory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editPost, setEditPost] = React.useState<DBBlogPost | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchBlog = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/blog");
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
        setCategories(data.categories || []);
      }
    } catch {
      setMessage({ type: "error", text: "Failed to load blog articles." });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  const handleOpenNew = () => {
    setEditPost({
      id: `post_${Date.now()}`,
      categoryId: categories[0]?.id || "bcat_01",
      authorId: "usr_superadmin_01",
      authorName: "Flash Solar Engineering Desk",
      slug: "",
      title: "",
      excerpt: "",
      content: "## Engineering Overview\n\nDirect-current architectures optimize solar harvest...",
      status: "PUBLISHED",
      featuredImage: "/images/solar-photovoltaic-generation.jpg",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPost) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editPost),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: `Article "${editPost.title}" saved successfully.` });
        setEditPost(null);
        fetchBlog();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save article." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete article "${title}"?`)) return;

    try {
      const res = await fetch(`/api/blog?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Article deleted." });
        fetchBlog();
      }
    } catch {
      setMessage({ type: "error", text: "Failed to delete article." });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-midnight-800">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-ivory-100 flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-gold-400" />
            <span>Blog &amp; Technical Content Management</span>
          </h2>
          <p className="text-xs text-ivory-400 mt-1">
            Publish engineering articles, thermodynamic whitepapers, and clean energy industry analyses with Markdown styling and SEO controls.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-midnight-950 font-bold text-xs shadow-goldGlow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
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

      {/* Articles Table */}
      <div className="bg-midnight-900 border border-midnight-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-midnight-800 flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase text-ivory-400">
            Published &amp; Draft Articles ({posts.length})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-midnight-950/80 text-ivory-400 font-mono text-[10px] uppercase border-b border-midnight-800">
              <tr>
                <th className="py-3 px-4">Title &amp; Route</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Published Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-midnight-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-ivory-400">Loading articles...</td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-ivory-400">No articles found. Click &quot;Write New Article&quot; to publish your first post.</td>
                </tr>
              ) : (
                posts.map((post) => {
                  const cat = categories.find((c) => c.id === post.categoryId);
                  return (
                    <tr key={post.id} className="hover:bg-midnight-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-heading font-bold text-ivory-100 block">{post.title}</span>
                        <span className="text-[10px] font-mono text-gold-400">/blog/{post.slug}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-ivory-300">
                        {cat?.name || "DC Engineering"}
                      </td>
                      <td className="py-3 px-4 text-ivory-400">
                        {post.authorName || "Engineering Desk"}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                          post.status === "PUBLISHED"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-ivory-400 text-[11px]">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => setEditPost(JSON.parse(JSON.stringify(post)))}
                          className="p-1.5 rounded hover:bg-midnight-800 text-ivory-300 hover:text-white"
                          title="Edit Article"
                        >
                          <Edit className="w-3.5 h-3.5 text-gold-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          className="p-1.5 rounded hover:bg-rose-500/10 text-rose-400 hover:text-rose-300"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Article Edit / Write Modal */}
      {editPost && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-midnight-900 border border-midnight-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col p-6 space-y-4 shadow-2xl overflow-y-auto text-xs"
          >
            <div className="flex items-center justify-between border-b border-midnight-800 pb-3">
              <h3 className="font-heading font-bold text-sm text-ivory-100">
                {editPost.title ? `Edit Article: ${editPost.title}` : "Write New Technical Article"}
              </h3>
              <button
                type="button"
                onClick={() => setEditPost(null)}
                className="text-ivory-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-ivory-300 font-semibold">Article Title</label>
                <input
                  type="text"
                  value={editPost.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = editPost.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                    setEditPost({ ...editPost, title, slug });
                  }}
                  required
                  placeholder="e.g. Sub-60V DC Distribution Safety Standards"
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-ivory-300 font-semibold">Slug Identifier</label>
                <input
                  type="text"
                  value={editPost.slug}
                  onChange={(e) => setEditPost({ ...editPost, slug: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-ivory-300 font-semibold">Category</label>
                <select
                  value={editPost.categoryId}
                  onChange={(e) => setEditPost({ ...editPost, categoryId: e.target.value })}
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
                  value={editPost.status}
                  onChange={(e) => setEditPost({ ...editPost, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 font-mono"
                >
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="DRAFT">DRAFT</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-ivory-300 font-semibold">Featured Header Image URL</label>
              <input
                type="text"
                value={editPost.featuredImage || ""}
                onChange={(e) => setEditPost({ ...editPost, featuredImage: e.target.value })}
                placeholder="/images/solar-photovoltaic-generation.jpg"
                className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-ivory-300 font-semibold">Article Excerpt (Brief Summary)</label>
              <textarea
                rows={2}
                value={editPost.excerpt}
                onChange={(e) => setEditPost({ ...editPost, excerpt: e.target.value })}
                placeholder="Short lead paragraph summarizing the technical findings..."
                className="w-full p-2.5 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-ivory-300 font-semibold">Article Body (Markdown &amp; Rich Text)</label>
              <textarea
                rows={8}
                value={editPost.content}
                onChange={(e) => setEditPost({ ...editPost, content: e.target.value })}
                className="w-full p-3 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 font-mono leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-midnight-800">
              <button
                type="button"
                onClick={() => setEditPost(null)}
                className="px-4 py-2 rounded-lg bg-midnight-800 text-ivory-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-midnight-950 font-bold transition-colors shadow-goldGlow"
              >
                {saving ? "Saving..." : "Save & Publish Article"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
