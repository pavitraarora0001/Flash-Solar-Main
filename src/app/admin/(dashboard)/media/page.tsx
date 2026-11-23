"use client";

import * as React from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Filter,
  Trash2,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  FileText,
  Film,
  Folder,
  Layers,
} from "lucide-react";
import { DBMediaAsset } from "@/lib/db/store";

const CATEGORIES = [
  "All",
  "Homepage",
  "Products",
  "Solar Installation",
  "Battery Storage",
  "Engineering",
  "Applications",
  "Blog",
  "Logos",
  "Documents",
];

export default function MediaLibraryPage() {
  const [assets, setAssets] = React.useState<DBMediaAsset[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedAsset, setSelectedAsset] = React.useState<DBMediaAsset | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = React.useState(false);
  const [uploadFile, setUploadFile] = React.useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = React.useState("Solar Installation");
  const [uploadAltText, setUploadAltText] = React.useState("");

  const fetchAssets = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/media?category=${encodeURIComponent(selectedCategory)}`);
      const data = await res.json();
      if (data.success) {
        setAssets(data.assets);
      }
    } catch {
      setMessage({ type: "error", text: "Failed to load media assets." });
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  React.useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleCopyUrl = (asset: DBMediaAsset) => {
    navigator.clipboard.writeText(asset.fileUrl);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("category", uploadCategory);
    formData.append("altText", uploadAltText || uploadFile.name);

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: `File "${uploadFile.name}" uploaded successfully.` });
        setUploadModalOpen(false);
        setUploadFile(null);
        setUploadAltText("");
        fetchAssets();
      } else {
        setMessage({ type: "error", text: data.error || "Upload failed." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error occurred while uploading file." });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAsset = async (id: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) return;

    try {
      const res = await fetch(`/api/media?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: `Asset "${filename}" deleted.` });
        if (selectedAsset?.id === id) setSelectedAsset(null);
        fetchAssets();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to delete asset." });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to delete asset." });
    }
  };

  const filteredAssets = assets.filter((a) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.filename.toLowerCase().includes(q) ||
      (a.altText && a.altText.toLowerCase().includes(q)) ||
      a.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-midnight-800">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-ivory-100 flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-gold-400" />
            <span>Enterprise Media & Asset Library</span>
          </h2>
          <p className="text-xs text-ivory-400 mt-1">
            Secure asset repository supporting JPG, PNG, WebP, SVG, and PDF documents. Assign high-resolution photography to products, stages, and pages.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-midnight-950 font-bold text-xs shadow-goldGlow transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Media Asset</span>
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

      {/* Categories Horizontal Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? "bg-gold-500 text-midnight-950 font-bold shadow"
                : "bg-midnight-900 border border-midnight-800 text-ivory-300 hover:text-white hover:bg-midnight-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search and Metadata Filter Bar */}
      <div className="bg-midnight-900 border border-midnight-800 p-4 rounded-2xl flex items-center justify-between gap-4 shadow-md">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-ivory-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media by filename, alt text, or category..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-midnight-950 border border-midnight-700 text-ivory-100 text-xs focus:outline-none focus:border-gold-500"
          />
        </div>

        <span className="text-xs font-mono text-ivory-400">
          Showing {filteredAssets.length} assets
        </span>
      </div>

      {/* Media Grid & Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Asset Cards Grid */}
        <div className={`${selectedAsset ? "lg:col-span-8" : "lg:col-span-12"}`}>
          {loading ? (
            <div className="p-12 text-center text-ivory-400 text-xs font-mono">
              Loading asset library...
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="p-12 text-center bg-midnight-900 border border-midnight-800 rounded-2xl text-ivory-400 text-xs">
              No media assets found. Click &quot;Upload Media Asset&quot; to add new photographs or diagrams.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredAssets.map((asset) => {
                const isSelected = selectedAsset?.id === asset.id;
                const isImg = asset.mimeType.startsWith("image/");
                const isPdf = asset.mimeType === "application/pdf";

                return (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className={`group bg-midnight-900 border rounded-2xl overflow-hidden cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-gold-500 ring-2 ring-gold-500/30 shadow-goldGlow"
                        : "border-midnight-800 hover:border-midnight-700 hover:bg-midnight-850"
                    }`}
                  >
                    {/* Media Preview Box */}
                    <div className="relative w-full h-36 bg-midnight-950 flex items-center justify-center overflow-hidden">
                      {isImg ? (
                        <Image
                          src={asset.fileUrl}
                          alt={asset.altText || asset.filename}
                          fill
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : isPdf ? (
                        <FileText className="w-10 h-10 text-rose-400" />
                      ) : (
                        <Film className="w-10 h-10 text-blue-400" />
                      )}

                      <span className="absolute bottom-2 left-2 text-[9px] font-mono bg-midnight-950/90 text-ivory-300 px-1.5 py-0.5 rounded">
                        {asset.category}
                      </span>
                    </div>

                    {/* Metadata Footer */}
                    <div className="p-3">
                      <span className="text-xs font-semibold text-ivory-100 block truncate" title={asset.filename}>
                        {asset.filename}
                      </span>
                      <div className="flex items-center justify-between text-[10px] text-ivory-400 mt-1 font-mono">
                        <span>{(asset.sizeBytes / 1024).toFixed(0)} KB</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyUrl(asset);
                          }}
                          className="text-gold-400 hover:text-gold-300 flex items-center gap-0.5"
                          title="Copy asset URL"
                        >
                          {copiedId === asset.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Asset Details Inspector */}
        {selectedAsset && (
          <div className="lg:col-span-4 bg-midnight-900 border border-midnight-700 rounded-2xl p-5 space-y-4 shadow-2xl h-fit sticky top-6">
            <div className="flex items-center justify-between border-b border-midnight-800 pb-3">
              <h3 className="font-heading font-bold text-sm text-ivory-100">
                Asset Metadata Inspector
              </h3>
              <button
                onClick={() => setSelectedAsset(null)}
                className="text-ivory-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Preview */}
            <div className="relative w-full h-44 rounded-xl overflow-hidden bg-midnight-950 border border-midnight-800 flex items-center justify-center">
              {selectedAsset.mimeType.startsWith("image/") ? (
                <Image
                  src={selectedAsset.fileUrl}
                  alt={selectedAsset.altText || selectedAsset.filename}
                  fill
                  className="object-contain p-2"
                />
              ) : (
                <FileText className="w-12 h-12 text-rose-400" />
              )}
            </div>

            {/* Properties */}
            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-[10px] font-mono text-ivory-400 uppercase block">Filename</span>
                <span className="text-ivory-100 font-semibold break-all">{selectedAsset.filename}</span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-ivory-400 uppercase block">Public Asset URL</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <input
                    type="text"
                    readOnly
                    value={selectedAsset.fileUrl}
                    className="w-full px-2 py-1 bg-midnight-950 border border-midnight-700 rounded text-ivory-200 text-xs font-mono select-all"
                  />
                  <button
                    onClick={() => handleCopyUrl(selectedAsset)}
                    className="p-1.5 rounded bg-midnight-800 hover:bg-midnight-700 text-gold-400"
                    title="Copy URL"
                  >
                    {copiedId === selectedAsset.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <div>
                  <span className="text-[10px] text-ivory-400 uppercase block">Category</span>
                  <span className="text-gold-400">{selectedAsset.category}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ivory-400 uppercase block">File Size</span>
                  <span className="text-ivory-200">{(selectedAsset.sizeBytes / 1024).toFixed(1)} KB</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-ivory-400 uppercase block">Alt Text (Accessibility & SEO)</span>
                <span className="text-ivory-200 italic">{selectedAsset.altText || "No alt text set"}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-midnight-800 flex items-center justify-between">
              <a
                href={selectedAsset.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-gold-400 hover:underline font-semibold"
              >
                View Full Size
              </a>

              <button
                onClick={() => handleDeleteAsset(selectedAsset.id, selectedAsset.filename)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-midnight-900 border border-midnight-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-midnight-800 pb-3">
              <h3 className="font-heading font-bold text-sm text-ivory-100 flex items-center gap-2">
                <Upload className="w-4 h-4 text-gold-400" />
                <span>Upload New Media Asset</span>
              </h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-ivory-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-ivory-300 font-semibold">Select File (JPG, PNG, WebP, SVG, PDF)</label>
                <input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  required
                  accept=".jpg,.jpeg,.png,.webp,.svg,.pdf,.mp4"
                  className="w-full text-xs text-ivory-300 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-midnight-800 file:text-gold-400 hover:file:bg-midnight-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-ivory-300 font-semibold">Asset Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                >
                  {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-ivory-300 font-semibold">Descriptive Alt Text</label>
                <input
                  type="text"
                  value={uploadAltText}
                  onChange={(e) => setUploadAltText(e.target.value)}
                  placeholder="e.g. Flash Power Wall Installation at Oxford Laboratory"
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-midnight-800">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-midnight-800 text-ivory-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-midnight-950 font-bold transition-colors disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload File"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
