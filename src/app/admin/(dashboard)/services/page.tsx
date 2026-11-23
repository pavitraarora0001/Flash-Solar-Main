"use client";

import * as React from "react";
import {
  Wrench,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Save,
  Layers,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react";
import { DBService } from "@/lib/db/store";
import { PublishStatus } from "@prisma/client";

export default function AdminServicesPage() {
  const [services, setServices] = React.useState<DBService[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState<Partial<DBService> | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchServices = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/services");
      const data = await res.json();
      if (data.success) {
        setServices(data.services || []);
      }
    } catch (err) {
      console.error("Failed to load services:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleOpenCreate = () => {
    setEditingService({
      id: `srv_${Date.now()}`,
      title: "",
      slug: "",
      categoryId: "cat_engineering",
      summary: "",
      description: "",
      iconName: "Wrench",
      status: PublishStatus.PUBLISHED,
      displayOrder: services.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (srv: DBService) => {
    setEditingService({ ...srv });
    setModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete engineering service "${title}"?`)) return;
    try {
      const res = await fetch(`/api/services?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: `Service "${title}" deleted successfully.`, type: "success" });
        fetchServices();
      } else {
        setMessage({ text: data.error || "Failed to delete service", type: "error" });
      }
    } catch {
      setMessage({ text: "Network error deleting service", type: "error" });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title || !editingService?.slug) {
      setMessage({ text: "Title and slug are required.", type: "error" });
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingService),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: "Engineering service saved successfully.", type: "success" });
        setModalOpen(false);
        setEditingService(null);
        fetchServices();
      } else {
        setMessage({ text: data.error || "Failed to save service", type: "error" });
      }
    } catch {
      setMessage({ text: "Failed to persist service changes", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const filtered = services.filter((srv) => {
    const matchesSearch =
      srv.title.toLowerCase().includes(search.toLowerCase()) ||
      srv.summary.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || srv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-midnight-800">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-ivory-100 tracking-tight flex items-center gap-2">
            <Wrench className="w-6 h-6 text-gold-400" />
            <span>Engineering &amp; Turnkey Services</span>
          </h1>
          <p className="text-xs text-ivory-400 mt-1">
            Specialized electrical design, load profile simulations, microgrid installation, and commissioning.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-midnight-950 text-xs font-semibold shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Engineering Service</span>
        </button>
      </div>

      {/* Notifications */}
      {message && (
        <div
          className={`p-3 rounded-lg text-xs flex items-center justify-between border ${
            message.type === "success"
              ? "bg-emerald-950/80 border-emerald-800 text-emerald-200"
              : "bg-rose-950/80 border-rose-800 text-rose-200"
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-ivory-400 hover:text-ivory-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-midnight-900 border border-midnight-800 p-3 rounded-xl">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-ivory-400" />
          <input
            type="text"
            placeholder="Search engineering services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-midnight-950 border border-midnight-700 rounded-lg text-xs text-ivory-100 placeholder-ivory-400 focus:outline-none focus:border-gold-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-midnight-950 border border-midnight-700 rounded-lg text-xs text-ivory-200 focus:outline-none focus:border-gold-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length > 0 ? (
          filtered.map((srv) => (
            <div
              key={srv.id}
              className="bg-midnight-900 border border-midnight-800 rounded-xl p-5 shadow flex flex-col justify-between hover:border-midnight-700 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                        srv.status === "PUBLISHED"
                          ? "bg-emerald-950/80 text-emerald-400 border-emerald-800"
                          : srv.status === "DRAFT"
                          ? "bg-amber-950/80 text-amber-400 border-amber-800"
                          : "bg-midnight-950 text-ivory-400 border-midnight-800"
                      }`}
                    >
                      {srv.status}
                    </span>
                    <span className="text-[10px] font-mono text-ivory-400">
                      Order: {srv.displayOrder}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-heading font-bold text-ivory-100">{srv.title}</h3>
                  <p className="text-[11px] font-mono text-gold-400/80 mt-0.5">/{srv.slug}</p>
                </div>

                <p className="text-xs text-ivory-300 leading-relaxed">{srv.summary}</p>
                <div className="pt-2 border-t border-midnight-800/80">
                  <p className="text-[11px] text-ivory-400 line-clamp-3 leading-relaxed">
                    {srv.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-midnight-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-ivory-400">
                  ID: {srv.id.substring(0, 10)}...
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(srv)}
                    className="p-1.5 rounded hover:bg-midnight-800 text-ivory-300 hover:text-ivory-100 transition-colors"
                    title="Edit Service"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(srv.id, srv.title)}
                    className="p-1.5 rounded hover:bg-midnight-800 text-rose-400 hover:text-rose-300 transition-colors"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-ivory-400 bg-midnight-900 border border-midnight-800 rounded-xl">
            {loading ? "Loading engineering services..." : "No services found."}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && editingService && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-midnight-900 border border-midnight-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-midnight-800 sticky top-0 bg-midnight-900/95 backdrop-blur z-10">
              <h2 className="text-sm font-heading font-bold text-ivory-100 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-gold-400" />
                <span>
                  {editingService.id?.startsWith("srv_") && !services.find((s) => s.id === editingService.id)
                    ? "Add New Engineering Service"
                    : "Edit Engineering Service"}
                </span>
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-ivory-400 hover:text-ivory-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-ivory-300 font-semibold mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={editingService.title || ""}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                      setEditingService({ ...editingService, title, slug: editingService.slug || slug });
                    }}
                    className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                    placeholder="e.g. Turnkey BESS Commissioning"
                  />
                </div>
                <div>
                  <label className="block text-ivory-300 font-semibold mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={editingService.slug || ""}
                    onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                    placeholder="turnkey-bess-commissioning"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-ivory-300 font-semibold mb-1">Status</label>
                  <select
                    value={editingService.status || PublishStatus.PUBLISHED}
                    onChange={(e) =>
                      setEditingService({ ...editingService, status: e.target.value as PublishStatus })
                    }
                    className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                  >
                    <option value={PublishStatus.PUBLISHED}>Published</option>
                    <option value={PublishStatus.DRAFT}>Draft</option>
                    <option value={PublishStatus.ARCHIVED}>Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-ivory-300 font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingService.displayOrder || 1}
                    onChange={(e) =>
                      setEditingService({ ...editingService, displayOrder: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                  />
                </div>
                <div>
                  <label className="block text-ivory-300 font-semibold mb-1">Icon Identifier</label>
                  <input
                    type="text"
                    value={editingService.iconName || "Wrench"}
                    onChange={(e) => setEditingService({ ...editingService, iconName: e.target.value })}
                    className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                    placeholder="Wrench, Zap, Cpu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ivory-300 font-semibold mb-1">Summary / Executive Scope *</label>
                <textarea
                  rows={2}
                  required
                  value={editingService.summary || ""}
                  onChange={(e) => setEditingService({ ...editingService, summary: e.target.value })}
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                  placeholder="Concise overview of engineering value and operational deliverable..."
                />
              </div>

              <div>
                <label className="block text-ivory-300 font-semibold mb-1">Full Scope of Work &amp; Specifications *</label>
                <textarea
                  rows={4}
                  required
                  value={editingService.description || ""}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                  placeholder="Detailed technical deliverables, testing protocols, and standard operational procedures..."
                />
              </div>

              <div className="flex justify-end items-center gap-3 pt-4 border-t border-midnight-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-midnight-800 hover:bg-midnight-700 text-ivory-300 text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-midnight-950 text-xs font-semibold shadow transition-colors disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving..." : "Save Engineering Service"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
