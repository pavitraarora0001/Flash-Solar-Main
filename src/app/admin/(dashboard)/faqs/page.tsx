"use client";

import * as React from "react";
import {
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { DBFAQ } from "@/lib/db/store";

const CATEGORIES = [
  "DC Engineering",
  "Flash Power Wall",
  "Hybrid AC Solar",
  "Warranty & Maintenance",
  "Installation & Sizing",
];

export default function FAQManagementPage() {
  const [faqs, setFaqs] = React.useState<DBFAQ[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editFaq, setEditFaq] = React.useState<DBFAQ | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchFaqs = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/faqs");
      const data = await res.json();
      if (data.success) {
        setFaqs(data.faqs);
      }
    } catch {
      setMessage({ type: "error", text: "Failed to load FAQs." });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const handleOpenNew = () => {
    setEditFaq({
      id: `faq_${Date.now()}`,
      category: "DC Engineering",
      question: "",
      answer: "",
      displayOrder: faqs.length + 1,
      isPublished: true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFaq) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFaq),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "FAQ saved and updated on public site." });
        setEditFaq(null);
        fetchFaqs();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error saving FAQ." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      const res = await fetch(`/api/faqs?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "FAQ deleted." });
        fetchFaqs();
      }
    } catch {
      setMessage({ type: "error", text: "Failed to delete FAQ." });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-midnight-800">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-ivory-100 flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-gold-400" />
            <span>Engineering FAQs Management</span>
          </h2>
          <p className="text-xs text-ivory-400 mt-1">
            Maintain technical Q&amp;A on direct-current benefits, battery lifespan, warranty terms, and SELV touch-safe standards.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-midnight-950 font-bold text-xs shadow-goldGlow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
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

      {/* FAQs List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-ivory-400 text-xs font-mono">
            Loading technical FAQs...
          </div>
        ) : faqs.length === 0 ? (
          <div className="p-12 text-center bg-midnight-900 border border-midnight-800 rounded-2xl text-ivory-400 text-xs">
            No FAQs recorded. Click &quot;Add New FAQ&quot; above to create technical answers.
          </div>
        ) : (
          faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-midnight-900 border border-midnight-800 rounded-2xl p-5 space-y-3 shadow-lg hover:border-gold-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-gold-400 bg-gold-500/10 border border-gold-500/30 px-2 py-0.5 rounded font-bold">
                    {faq.category}
                  </span>
                  <span className="text-[10px] font-mono text-ivory-400">Order #{faq.displayOrder}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditFaq(JSON.parse(JSON.stringify(faq)))}
                    className="p-1.5 rounded hover:bg-midnight-800 text-ivory-300 hover:text-white"
                  >
                    <Edit className="w-3.5 h-3.5 text-gold-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="p-1.5 rounded hover:bg-rose-500/10 text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h4 className="font-heading font-bold text-sm text-ivory-100">
                {faq.question}
              </h4>

              <p className="text-xs text-ivory-300 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editFaq && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-midnight-900 border border-midnight-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-xs"
          >
            <div className="flex items-center justify-between border-b border-midnight-800 pb-3">
              <h3 className="font-heading font-bold text-sm text-ivory-100">
                {editFaq.question ? "Edit Technical FAQ" : "New Technical FAQ"}
              </h3>
              <button
                type="button"
                onClick={() => setEditFaq(null)}
                className="text-ivory-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-ivory-300 font-semibold">Category</label>
              <select
                value={editFaq.category}
                onChange={(e) => setEditFaq({ ...editFaq, category: e.target.value })}
                className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-ivory-300 font-semibold">Question</label>
              <input
                type="text"
                value={editFaq.question}
                onChange={(e) => setEditFaq({ ...editFaq, question: e.target.value })}
                required
                placeholder="e.g. Can Flash Power Wall operate off-grid without utility power?"
                className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-ivory-300 font-semibold">Answer Explanation</label>
              <textarea
                rows={4}
                value={editFaq.answer}
                onChange={(e) => setEditFaq({ ...editFaq, answer: e.target.value })}
                required
                placeholder="Clear engineering answer providing exact parameters..."
                className="w-full p-2.5 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-ivory-300 font-semibold">Display Order</label>
                <input
                  type="number"
                  value={editFaq.displayOrder}
                  onChange={(e) => setEditFaq({ ...editFaq, displayOrder: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-ivory-300">
                  <input
                    type="checkbox"
                    checked={editFaq.isPublished}
                    onChange={(e) => setEditFaq({ ...editFaq, isPublished: e.target.checked })}
                    className="rounded border-midnight-700 bg-midnight-950 text-gold-500"
                  />
                  <span>Published on Public FAQ</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-midnight-800">
              <button
                type="button"
                onClick={() => setEditFaq(null)}
                className="px-4 py-2 rounded-lg bg-midnight-800 text-ivory-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-midnight-950 font-bold"
              >
                {saving ? "Saving..." : "Save FAQ"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
