"use client";

import * as React from "react";
import {
  Quote,
  Plus,
  Star,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit,
  ShieldCheck,
} from "lucide-react";
import { DBTestimonial } from "@/lib/db/store";

export default function TestimonialsManagementPage() {
  const [testimonials, setTestimonials] = React.useState<DBTestimonial[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editItem, setEditItem] = React.useState<DBTestimonial | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchTestimonials = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      if (data.success) {
        setTestimonials(data.testimonials);
      }
    } catch {
      setMessage({ type: "error", text: "Failed to load testimonials." });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleOpenNew = () => {
    setEditItem({
      id: `tst_${Date.now()}`,
      authorName: "",
      authorTitle: "Lead Energy Architect",
      company: "",
      quote: "",
      rating: 5,
      verified: true,
      isPublished: true,
      createdAt: new Date().toISOString(),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editItem),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Testimonial saved and updated on public site." });
        setEditItem(null);
        fetchTestimonials();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error saving testimonial." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/testimonials?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Testimonial deleted." });
        fetchTestimonials();
      }
    } catch {
      setMessage({ type: "error", text: "Failed to delete testimonial." });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-midnight-800">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-ivory-100 flex items-center gap-2.5">
            <Quote className="w-6 h-6 text-gold-400" />
            <span>Customer Testimonials &amp; Industry Endorsements</span>
          </h2>
          <p className="text-xs text-ivory-400 mt-1">
            Manage verified client testimonials, research laboratory validations, and microgrid engineering reviews displayed on the public site.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-midnight-950 font-bold text-xs shadow-goldGlow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
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

      {/* Testimonials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 p-12 text-center text-ivory-400 text-xs font-mono">
            Loading testimonials...
          </div>
        ) : testimonials.length === 0 ? (
          <div className="col-span-2 p-12 text-center bg-midnight-900 border border-midnight-800 rounded-2xl text-ivory-400 text-xs">
            No testimonials recorded. Click &quot;Add Testimonial&quot; above to add validation quotes.
          </div>
        ) : (
          testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-midnight-900 border border-midnight-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gold-400">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold-400" />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {t.verified && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    )}
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                      t.isPublished ? "bg-gold-500/10 text-gold-400 border border-gold-500/30" : "bg-midnight-800 text-ivory-400"
                    }`}>
                      {t.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-ivory-200 leading-relaxed italic">
                  &quot;{t.quote}&quot;
                </p>
              </div>

              <div className="pt-3 border-t border-midnight-800/80 flex items-center justify-between">
                <div>
                  <span className="font-heading font-bold text-xs text-ivory-100 block">
                    {t.authorName}
                  </span>
                  <span className="text-[10px] text-ivory-400 block">
                    {t.authorTitle ? `${t.authorTitle}, ` : ""}{t.company}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditItem(JSON.parse(JSON.stringify(t)))}
                    className="p-1.5 rounded hover:bg-midnight-800 text-ivory-300 hover:text-white"
                  >
                    <Edit className="w-3.5 h-3.5 text-gold-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-1.5 rounded hover:bg-rose-500/10 text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-midnight-900 border border-midnight-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-xs"
          >
            <div className="flex items-center justify-between border-b border-midnight-800 pb-3">
              <h3 className="font-heading font-bold text-sm text-ivory-100">
                {editItem.authorName ? `Edit Testimonial: ${editItem.authorName}` : "New Testimonial"}
              </h3>
              <button
                type="button"
                onClick={() => setEditItem(null)}
                className="text-ivory-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-ivory-300 font-semibold">Author Full Name</label>
                <input
                  type="text"
                  value={editItem.authorName}
                  onChange={(e) => setEditItem({ ...editItem, authorName: e.target.value })}
                  required
                  placeholder="e.g. Dr. Evelyn Reed"
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-ivory-300 font-semibold">Title / Role</label>
                <input
                  type="text"
                  value={editItem.authorTitle || ""}
                  onChange={(e) => setEditItem({ ...editItem, authorTitle: e.target.value })}
                  placeholder="e.g. Lead Microgrid Architect"
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-ivory-300 font-semibold">Company / Institution</label>
                <input
                  type="text"
                  value={editItem.company || ""}
                  onChange={(e) => setEditItem({ ...editItem, company: e.target.value })}
                  placeholder="e.g. Nordic Clean Energy Consortium"
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-ivory-300 font-semibold">Rating (1 to 5 Stars)</label>
                <select
                  value={editItem.rating}
                  onChange={(e) => setEditItem({ ...editItem, rating: parseInt(e.target.value) || 5 })}
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 font-mono"
                >
                  <option value={5}>5 Stars - Outstanding</option>
                  <option value={4}>4 Stars - Highly Recommended</option>
                  <option value={3}>3 Stars - Satisfactory</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-ivory-300 font-semibold">Quote Text</label>
              <textarea
                rows={4}
                value={editItem.quote}
                onChange={(e) => setEditItem({ ...editItem, quote: e.target.value })}
                required
                placeholder="Detailed testimonial content regarding system performance..."
                className="w-full p-2.5 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 leading-relaxed"
              />
            </div>

            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-ivory-300">
                <input
                  type="checkbox"
                  checked={editItem.verified}
                  onChange={(e) => setEditItem({ ...editItem, verified: e.target.checked })}
                  className="rounded border-midnight-700 bg-midnight-950 text-gold-500"
                />
                <span>Verified Client Badge</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-ivory-300">
                <input
                  type="checkbox"
                  checked={editItem.isPublished}
                  onChange={(e) => setEditItem({ ...editItem, isPublished: e.target.checked })}
                  className="rounded border-midnight-700 bg-midnight-950 text-gold-500"
                />
                <span>Publish on Public Site</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-midnight-800">
              <button
                type="button"
                onClick={() => setEditItem(null)}
                className="px-4 py-2 rounded-lg bg-midnight-800 text-ivory-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-midnight-950 font-bold"
              >
                {saving ? "Saving..." : "Save Testimonial"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
