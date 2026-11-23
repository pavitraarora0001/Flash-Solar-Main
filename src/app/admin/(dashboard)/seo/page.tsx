"use client";

import * as React from "react";
import {
  Search,
  Save,
  CheckCircle2,
  AlertCircle,
  Globe,
  Share2,
  FileCode,
  ExternalLink,
} from "lucide-react";

interface SEOPageItem {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  ogImageUrl?: string;
}

interface SEOData {
  siteName: string;
  defaultTitle: string;
  defaultDescription: string;
  canonicalUrl: string;
  robotsIndex: boolean;
  sitemapUrl: string;
  pages: SEOPageItem[];
}

export default function SEOManagementPage() {
  const [seo, setSeo] = React.useState<SEOData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [selectedSlug, setSelectedSlug] = React.useState("home");
  const [selectedMetaTitle, setSelectedMetaTitle] = React.useState("");
  const [selectedMetaDesc, setSelectedMetaDesc] = React.useState("");
  const [selectedOgImage, setSelectedOgImage] = React.useState("");
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  React.useEffect(() => {
    fetchSEO();
  }, []);

  async function fetchSEO() {
    setLoading(true);
    try {
      const res = await fetch("/api/seo");
      const data = await res.json();
      if (data.success && data.seo) {
        setSeo(data.seo);
        const home = data.seo.pages.find((p: SEOPageItem) => p.slug === "home") || data.seo.pages[0];
        if (home) {
          setSelectedSlug(home.slug);
          setSelectedMetaTitle(home.metaTitle);
          setSelectedMetaDesc(home.metaDescription);
          setSelectedOgImage(home.ogImageUrl || "/images/solar-photovoltaic-generation.jpg");
        }
      }
    } catch {
      setMessage({ type: "error", text: "Failed to load SEO configuration." });
    } finally {
      setLoading(false);
    }
  }

  const handleSelectPage = (slug: string) => {
    setSelectedSlug(slug);
    const p = seo?.pages.find((item) => item.slug === slug);
    if (p) {
      setSelectedMetaTitle(p.metaTitle);
      setSelectedMetaDesc(p.metaDescription);
      setSelectedOgImage(p.ogImageUrl || "/images/solar-photovoltaic-generation.jpg");
    }
  };

  const handleSaveSEO = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: selectedSlug,
          metaTitle: selectedMetaTitle,
          metaDescription: selectedMetaDesc,
          ogImageUrl: selectedOgImage,
          defaultTitle: selectedSlug === "home" ? selectedMetaTitle : undefined,
          defaultDescription: selectedSlug === "home" ? selectedMetaDesc : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: `SEO metadata for "/${selectedSlug === "home" ? "" : selectedSlug}" saved successfully.` });
        fetchSEO();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save SEO." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-ivory-300">
        <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-mono">Loading SEO Engine &amp; Sitemaps...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-midnight-800">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-ivory-100 flex items-center gap-2.5">
            <Search className="w-6 h-6 text-gold-400" />
            <span>Search Engine Optimization (SEO &amp; AEO) Manager</span>
          </h2>
          <p className="text-xs text-ivory-400 mt-1">
            Configure OpenGraph social sharing tags, canonical URLs, search engine snippets, and XML sitemaps across all public routes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/sitemap.xml"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-midnight-900 border border-midnight-700 text-xs font-mono text-ivory-300 hover:text-gold-400 transition-colors"
          >
            <span>Live sitemap.xml</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pages Selector Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-ivory-400 font-bold px-1">
            Select Route / Page
          </h3>
          <div className="bg-midnight-900 border border-midnight-800 rounded-2xl p-2 space-y-1">
            {seo?.pages.map((p) => {
              const isSelected = selectedSlug === p.slug;
              return (
                <button
                  key={p.slug}
                  onClick={() => handleSelectPage(p.slug)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                    isSelected
                      ? "bg-gold-500/20 text-gold-400 border border-gold-500/40 font-semibold"
                      : "text-ivory-300 hover:text-white hover:bg-midnight-800/60"
                  }`}
                >
                  <div className="truncate">
                    <span className="block font-semibold text-ivory-100">{p.title}</span>
                    <span className="text-[10px] font-mono text-gold-400">/{p.slug === "home" ? "" : p.slug}</span>
                  </div>
                  <Globe className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-gold-400" : "text-ivory-500"}`} />
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-midnight-900 border border-midnight-800 text-[11px] text-ivory-400 space-y-2">
            <span className="font-bold text-ivory-200 block">Structured Data Status:</span>
            <p>
              Schema.org Organization &amp; Product microdata are automatically injected into the HTML HEAD for all published catalog entries.
            </p>
          </div>
        </div>

        {/* SEO Editor Form */}
        <div className="lg:col-span-8 bg-midnight-900 border border-midnight-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <form onSubmit={handleSaveSEO} className="space-y-5 text-xs">
            <div className="border-b border-midnight-800 pb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 font-bold block">
                Metadata Settings for Route: /{selectedSlug === "home" ? "" : selectedSlug}
              </span>
              <h3 className="text-base font-heading font-bold text-ivory-100">
                Search Engine Snippet &amp; Social Card
              </h3>
            </div>

            <div className="space-y-1">
              <label className="text-ivory-300 font-semibold">Page Title (Meta Title)</label>
              <input
                type="text"
                value={selectedMetaTitle}
                onChange={(e) => setSelectedMetaTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-midnight-950 border border-midnight-700 text-ivory-100 text-xs focus:outline-none focus:border-gold-500"
              />
              <span className="text-[10px] text-ivory-400">
                Recommended length: 50-60 characters ({selectedMetaTitle.length} characters)
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-ivory-300 font-semibold">Meta Description</label>
              <textarea
                rows={3}
                value={selectedMetaDesc}
                onChange={(e) => setSelectedMetaDesc(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-midnight-950 border border-midnight-700 text-ivory-100 text-xs leading-relaxed"
              />
              <span className="text-[10px] text-ivory-400">
                Recommended length: 150-160 characters ({selectedMetaDesc.length} characters)
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-ivory-300 font-semibold">Open Graph Image (Social Sharing)</label>
              <input
                type="text"
                value={selectedOgImage}
                onChange={(e) => setSelectedOgImage(e.target.value)}
                placeholder="/images/solar-photovoltaic-generation.jpg"
                className="w-full px-3.5 py-2.5 rounded-lg bg-midnight-950 border border-midnight-700 text-ivory-100 text-xs font-mono"
              />
            </div>

            {/* Google SERP Preview Box */}
            <div className="pt-3 border-t border-midnight-800 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-ivory-400 font-bold block">
                Google Search Results Preview (Desktop &amp; Mobile)
              </span>
              <div className="bg-midnight-950 p-4 rounded-xl border border-midnight-850 space-y-1 max-w-xl">
                <span className="text-[11px] text-emerald-400 font-mono block">
                  https://flashsolar.org{selectedSlug === "home" ? "" : `/${selectedSlug}`}
                </span>
                <h4 className="text-sm font-semibold text-blue-400 hover:underline cursor-pointer block">
                  {selectedMetaTitle || "Flash Solar"}
                </h4>
                <p className="text-xs text-ivory-300 leading-relaxed line-clamp-2">
                  {selectedMetaDesc || "High-efficiency direct-current clean energy architecture."}
                </p>
              </div>
            </div>

            {/* Submit Actions */}
            <div className="pt-4 border-t border-midnight-800 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-midnight-950 font-bold text-xs shadow-goldGlow transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving..." : "Save SEO Settings"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
