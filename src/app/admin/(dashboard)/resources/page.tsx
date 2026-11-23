"use client";

import * as React from "react";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Download,
} from "lucide-react";
import { DBTechnicalResource } from "@/lib/db/store";

const RESOURCE_TYPES = ["DATASHEET", "WHITEPAPER", "SIZING_GUIDE", "USER_MANUAL", "BROCHURE"];

export default function AdminResourcesPage() {
  const [resources, setResources] = React.useState<DBTechnicalResource[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editResource, setEditResource] = React.useState<DBTechnicalResource | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchResources = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/resources");
      const data = await res.json();
      if (data.success) {
        setResources(data.resources);
      }
    } catch {
      setMessage({ type: "error", text: "Failed to load technical resources." });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleOpenNew = () => {
    setEditResource({
      id: `res_${Date.now()}`,
      slug: "",
      title: "",
      resourceType: "DATASHEET",
      summary: "",
      fileUrl: "/docs/flash-power-wall-datasheet.pdf",
      fileSize: "2.4 MB",
      downloadCount: 0,
      status: "PUBLISHED",
      createdAt: new Date().toISOString(),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editResource) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editResource),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: `Resource "${editResource.title}" saved successfully.` });
        setEditResource(null);
        fetchResources();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save resource." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/resources?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Resource deleted." });
        fetchResources();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to delete resource." });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to delete resource." });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-midnight-800">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-ivory-100 flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-gold-400" />
            <span>Technical Resources &amp; Datasheet Management</span>
          </h2>
          <p className="text-xs text-ivory-400 mt-1">
            Maintain product datasheets, single-line engineering schematics, whitepapers, and installation documentation.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-midnight-950 font-bold text-xs shadow-goldGlow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Documentation Asset</span>
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

      {/* Resources Table */}
      <div className="bg-midnight-900 border border-midnight-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-midnight-800 flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase text-ivory-400">
            Active Technical Documentation ({resources.length})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-midnight-950/80 text-ivory-400 font-mono text-[10px] uppercase border-b border-midnight-800">
              <tr>
                <th className="py-3 px-4">Title &amp; Summary</th>
                <th className="py-3 px-4">Document Type</th>
                <th className="py-3 px-4">File Size</th>
                <th className="py-3 px-4">Downloads</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-midnight-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-ivory-400">Loading resources...</td>
                </tr>
              ) : resources.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-ivory-400">No resources found. Click &quot;Add Documentation Asset&quot; to upload one.</td>
                </tr>
              ) : (
                resources.map((res) => (
                  <tr key={res.id} className="hover:bg-midnight-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-ivory-100 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-gold-400" />
                        <span>{res.title}</span>
                      </div>
                      <div className="text-[11px] text-ivory-400 mt-0.5 max-w-sm truncate">{res.summary}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-ivory-300">{res.resourceType}</td>
                    <td className="py-3 px-4 font-mono text-ivory-400">{res.fileSize || "PDF"}</td>
                    <td className="py-3 px-4 font-mono font-bold text-gold-400">
                      {res.downloadCount}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                        res.status === "PUBLISHED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      }`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <a
                        href={res.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 p-1.5 rounded hover:bg-midnight-800 text-gold-400 hover:text-gold-300 text-xs font-mono"
                        title="View Asset"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => setEditResource(JSON.parse(JSON.stringify(res)))}
                        className="p-1.5 rounded hover:bg-midnight-800 text-ivory-300 hover:text-white"
                        title="Edit Resource"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(res.id, res.title)}
                        className="p-1.5 rounded hover:bg-rose-500/10 text-rose-400 hover:text-rose-300"
                        title="Delete Resource"
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

      {/* Edit Modal */}
      {editResource && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-midnight-900 border border-midnight-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-xs"
          >
            <div className="flex items-center justify-between border-b border-midnight-800 pb-3">
              <h3 className="font-heading font-bold text-sm text-ivory-100">
                {editResource.title ? `Edit Resource: ${editResource.title}` : "New Technical Resource"}
              </h3>
              <button
                type="button"
                onClick={() => setEditResource(null)}
                className="text-ivory-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-ivory-300 font-semibold">Document Title</label>
              <input
                type="text"
                value={editResource.title}
                onChange={(e) => {
                  const title = e.target.value;
                  const slug = editResource.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                  setEditResource({ ...editResource, title, slug });
                }}
                required
                placeholder="e.g. Flash Power Wall Installation Manual"
                className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-ivory-300 font-semibold">Slug Identifier</label>
                <input
                  type="text"
                  value={editResource.slug}
                  onChange={(e) => setEditResource({ ...editResource, slug: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-ivory-300 font-semibold">Resource Type</label>
                <select
                  value={editResource.resourceType}
                  onChange={(e) => setEditResource({ ...editResource, resourceType: e.target.value })}
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 font-mono"
                >
                  {RESOURCE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-ivory-300 font-semibold">File URL / Download Path</label>
                <input
                  type="text"
                  value={editResource.fileUrl}
                  onChange={(e) => setEditResource({ ...editResource, fileUrl: e.target.value })}
                  required
                  placeholder="/docs/manual.pdf"
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-ivory-300 font-semibold">File Size Description</label>
                <input
                  type="text"
                  value={editResource.fileSize || ""}
                  onChange={(e) => setEditResource({ ...editResource, fileSize: e.target.value })}
                  placeholder="e.g. 3.2 MB"
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-ivory-300 font-semibold">Summary / Description</label>
              <textarea
                rows={3}
                value={editResource.summary}
                onChange={(e) => setEditResource({ ...editResource, summary: e.target.value })}
                placeholder="Technical contents of this document..."
                className="w-full p-2.5 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-ivory-300 font-semibold">Publishing Status</label>
              <select
                value={editResource.status}
                onChange={(e) => setEditResource({ ...editResource, status: e.target.value as any })}
                className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 font-mono"
              >
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="DRAFT">DRAFT</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-midnight-800">
              <button
                type="button"
                onClick={() => setEditResource(null)}
                className="px-4 py-2 rounded-lg bg-midnight-800 text-ivory-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-midnight-950 font-bold"
              >
                {saving ? "Saving..." : "Save Documentation"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
