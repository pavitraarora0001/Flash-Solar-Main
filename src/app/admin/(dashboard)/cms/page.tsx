"use client";

import * as React from "react";
import {
  Globe,
  Layout,
  Eye,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  FileText,
  Sliders,
  Layers,
  ArrowUpDown,
} from "lucide-react";

interface PageSection {
  id: string;
  pageId: string;
  sectionKey: string;
  title: string;
  subtitle?: string;
  badge?: string;
  content: Record<string, unknown>;
  mediaUrl?: string;
  displayOrder: number;
  isVisible: boolean;
  status: string;
}

interface PageItem {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  status: string;
  metaTitle?: string;
  metaDescription?: string;
}

export default function WebsiteCMSPage() {
  const [activeTab, setActiveTab] = React.useState<"homepage" | "pages">("homepage");
  const [sections, setSections] = React.useState<PageSection[]>([]);
  const [pages, setPages] = React.useState<PageItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  // Selected section for editing
  const [selectedKey, setSelectedKey] = React.useState<string>("hero");
  const [editSection, setEditSection] = React.useState<PageSection | null>(null);

  // Selected page for editing
  const [selectedPage, setSelectedPage] = React.useState<PageItem | null>(null);

  React.useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [secRes, pagesRes] = await Promise.all([
        fetch("/api/cms/sections?slug=home"),
        fetch("/api/cms/pages"),
      ]);
      const secData = await secRes.json();
      const pagesData = await pagesRes.json();

      if (secData.success) {
        setSections(secData.sections);
        const hero = secData.sections.find((s: PageSection) => s.sectionKey === "hero") || secData.sections[0];
        if (hero) {
          setEditSection(JSON.parse(JSON.stringify(hero)));
          setSelectedKey(hero.sectionKey);
        }
      }
      if (pagesData.success) {
        setPages(pagesData.pages);
      }
    } catch (err) {
      console.error("Failed to load CMS data:", err);
      setMessage({ type: "error", text: "Failed to load content from database." });
    } finally {
      setLoading(false);
    }
  }

  const handleSelectSection = (key: string) => {
    setSelectedKey(key);
    const found = sections.find((s) => s.sectionKey === key);
    if (found) {
      setEditSection(JSON.parse(JSON.stringify(found)));
    } else {
      // create default template section
      setEditSection({
        id: `sec_${key}_${Date.now()}`,
        pageId: "pg_home",
        sectionKey: key,
        title: `Flash Solar ${key.toUpperCase()}`,
        subtitle: "High-efficiency direct-current clean energy architecture.",
        badge: "DC STANDARD",
        content: {},
        displayOrder: sections.length + 1,
        isVisible: true,
        status: "PUBLISHED",
      });
    }
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSection) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/cms/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editSection),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: `Section "${editSection.title}" saved and published successfully.` });
        fetchData();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save section." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error occurred while saving." });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPage) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/cms/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPage),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: `Page "${selectedPage.title}" updated successfully.` });
        fetchData();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update page." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setSaving(false);
    }
  };

  const homepageSectionKeys = [
    { key: "hero", label: "Hero Banner & Header", icon: Layout },
    { key: "benchmark", label: "Thermodynamic Benchmark", icon: Sliders },
    { key: "features", label: "Engineering Pillars", icon: Layers },
    { key: "showcase", label: "Flash Power Wall Showcase", icon: Sliders },
    { key: "engineering_journey", label: "DC Architecture Journey", icon: ArrowUpDown },
    { key: "applications", label: "Microgrid Applications", icon: Layers },
    { key: "resources", label: "Technical Resources", icon: FileText },
    { key: "testimonials", label: "Customer Validation", icon: Layout },
    { key: "faqs", label: "Engineering FAQs", icon: FileText },
    { key: "contact", label: "Engineering Sizing Desk", icon: Globe },
    { key: "footer", label: "Platform Footer", icon: Layout },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-ivory-300">
        <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-mono">Loading Website CMS Repository...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-midnight-800">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-ivory-100 flex items-center gap-2.5">
            <Globe className="w-6 h-6 text-gold-400" />
            <span>Website Visual CMS & Content Management</span>
          </h2>
          <p className="text-xs text-ivory-400 mt-1">
            Edit live public headlines, hero messaging, section order, visibility, and site pages without modifying source code.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-midnight-900 border border-midnight-700 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("homepage")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "homepage"
                ? "bg-gold-500 text-midnight-950 shadow"
                : "text-ivory-300 hover:text-white"
            }`}
          >
            Homepage Sections
          </button>
          <button
            onClick={() => setActiveTab("pages")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "pages"
                ? "bg-gold-500 text-midnight-950 shadow"
                : "text-ivory-300 hover:text-white"
            }`}
          >
            Site Pages ({pages.length})
          </button>
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

      {/* TAB 1: HOMEPAGE SECTIONS */}
      {activeTab === "homepage" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Section Selector Sidebar */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-ivory-400 font-bold px-1">
              Select Homepage Section
            </h3>
            <div className="bg-midnight-900/90 border border-midnight-800 rounded-2xl p-2 space-y-1">
              {homepageSectionKeys.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedKey === item.key;
                const existing = sections.find((s) => s.sectionKey === item.key);

                return (
                  <button
                    key={item.key}
                    onClick={() => handleSelectSection(item.key)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-gold-500/20 text-gold-400 border border-gold-500/40 font-semibold"
                        : "text-ivory-300 hover:text-white hover:bg-midnight-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isSelected ? "text-gold-400" : "text-ivory-400"}`} />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {existing && !existing.isVisible && (
                        <span className="text-[9px] font-mono bg-midnight-800 text-ivory-400 px-1.5 py-0.5 rounded">
                          HIDDEN
                        </span>
                      )}
                      <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? "text-gold-400" : "text-ivory-500"}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-midnight-900/60 border border-midnight-800/80 text-[11px] text-ivory-400 space-y-2">
              <span className="font-bold text-ivory-200 block">Motion & Design Guarantee:</span>
              <p>
                Editing section copy or imagery dynamically binds to React state while preserving all GSAP ScrollTrigger animations, smooth scrolling, and responsive styling.
              </p>
            </div>
          </div>

          {/* Section Editor Form */}
          <div className="lg:col-span-8">
            {editSection ? (
              <form onSubmit={handleSaveSection} className="bg-midnight-900 border border-midnight-800 rounded-2xl p-6 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-midnight-800 pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 font-bold block">
                      Editing Section: {editSection.sectionKey.toUpperCase()}
                    </span>
                    <h3 className="text-lg font-heading font-bold text-ivory-100">
                      {editSection.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-xs text-ivory-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editSection.isVisible}
                        onChange={(e) => setEditSection({ ...editSection, isVisible: e.target.checked })}
                        className="rounded border-midnight-700 bg-midnight-950 text-gold-500 focus:ring-gold-500/40"
                      />
                      <span>Visible on Site</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-ivory-300">Section Headline / Title</label>
                    <input
                      type="text"
                      value={editSection.title}
                      onChange={(e) => setEditSection({ ...editSection, title: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg bg-midnight-950 border border-midnight-700 text-ivory-100 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-ivory-300">Section Badge / Tag</label>
                    <input
                      type="text"
                      value={editSection.badge || ""}
                      onChange={(e) => setEditSection({ ...editSection, badge: e.target.value })}
                      placeholder="e.g. NEXT-GEN ARCHITECTURE"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-midnight-950 border border-midnight-700 text-ivory-100 text-xs focus:outline-none focus:border-gold-500 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ivory-300">Subtitle / Tagline</label>
                  <input
                    type="text"
                    value={editSection.subtitle || ""}
                    onChange={(e) => setEditSection({ ...editSection, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-midnight-950 border border-midnight-700 text-ivory-100 text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ivory-300">Background / Primary Image URL</label>
                  <input
                    type="text"
                    value={editSection.mediaUrl || ""}
                    onChange={(e) => setEditSection({ ...editSection, mediaUrl: e.target.value })}
                    placeholder="/images/solar-photovoltaic-generation.jpg"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-midnight-950 border border-midnight-700 text-ivory-100 text-xs focus:outline-none focus:border-gold-500 font-mono"
                  />
                  <span className="text-[10px] text-ivory-400">
                    You can select from images in the Media Library or paste a path.
                  </span>
                </div>

                {/* Hero Specific Fields */}
                {editSection.sectionKey === "hero" && (
                  <div className="pt-4 border-t border-midnight-800 space-y-4">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-gold-400 font-bold">
                      Hero Call-To-Action & Benchmark Settings
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-ivory-300">Primary CTA Button Label</label>
                        <input
                          type="text"
                          value={String(editSection.content?.primaryCtaText || "Explore DC Journey")}
                          onChange={(e) =>
                            setEditSection({
                              ...editSection,
                              content: { ...editSection.content, primaryCtaText: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-lg bg-midnight-950 border border-midnight-700 text-ivory-100 text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-ivory-300">Primary CTA Target Link</label>
                        <input
                          type="text"
                          value={String(editSection.content?.primaryCtaLink || "#dc-journey")}
                          onChange={(e) =>
                            setEditSection({
                              ...editSection,
                              content: { ...editSection.content, primaryCtaLink: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-lg bg-midnight-950 border border-midnight-700 text-ivory-100 text-xs font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-ivory-300">Secondary CTA Button Label</label>
                        <input
                          type="text"
                          value={String(editSection.content?.secondaryCtaText || "Consult Engineering Desk")}
                          onChange={(e) =>
                            setEditSection({
                              ...editSection,
                              content: { ...editSection.content, secondaryCtaText: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-lg bg-midnight-950 border border-midnight-700 text-ivory-100 text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-ivory-300">Secondary CTA Target Link</label>
                        <input
                          type="text"
                          value={String(editSection.content?.secondaryCtaLink || "#enquiry")}
                          onChange={(e) =>
                            setEditSection({
                              ...editSection,
                              content: { ...editSection.content, secondaryCtaLink: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-lg bg-midnight-950 border border-midnight-700 text-ivory-100 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-midnight-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-ivory-400 font-mono">
                      Order: {editSection.displayOrder}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-midnight-950 font-bold text-xs transition-colors shadow-goldGlow disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? "Publishing Changes..." : "Publish to Live Site"}</span>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="p-8 text-center bg-midnight-900 border border-midnight-800 rounded-2xl text-ivory-400 text-xs">
                Select a section on the left to begin editing.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SITE PAGES */}
      {activeTab === "pages" && (
        <div className="space-y-6">
          <div className="bg-midnight-900 border border-midnight-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-midnight-800 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-sm text-ivory-100">
                  Public Website Pages Directory
                </h3>
                <p className="text-xs text-ivory-400">
                  Manage publishing status, titles, and SEO meta tags for all system routes.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-midnight-950/80 text-ivory-400 font-mono text-[10px] uppercase border-b border-midnight-800">
                  <tr>
                    <th className="py-3 px-4">Page Title</th>
                    <th className="py-3 px-4">Route Slug</th>
                    <th className="py-3 px-4">Summary</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-midnight-800/60">
                  {pages.map((p) => (
                    <tr key={p.id} className="hover:bg-midnight-800/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-ivory-100">
                        {p.title}
                      </td>
                      <td className="py-3 px-4 font-mono text-gold-400">
                        /{p.slug === "home" ? "" : p.slug}
                      </td>
                      <td className="py-3 px-4 text-ivory-400 max-w-xs truncate">
                        {p.summary || "Standard system page"}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                          p.status === "PUBLISHED"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedPage(p)}
                          className="px-3 py-1 rounded bg-midnight-800 hover:bg-midnight-700 text-ivory-200 text-xs font-medium transition-colors"
                        >
                          Edit Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Page Edit Modal / Panel */}
          {selectedPage && (
            <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
              <div className="bg-midnight-900 border border-midnight-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-midnight-800 pb-3">
                  <h3 className="font-heading font-bold text-sm text-ivory-100">
                    Edit Page: {selectedPage.title}
                  </h3>
                  <button
                    onClick={() => setSelectedPage(null)}
                    className="text-ivory-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSavePage} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-ivory-300 font-semibold">Page Title</label>
                    <input
                      type="text"
                      value={selectedPage.title}
                      onChange={(e) => setSelectedPage({ ...selectedPage, title: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded bg-midnight-950 border border-midnight-700 text-ivory-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-ivory-300 font-semibold">Meta Title (SEO)</label>
                    <input
                      type="text"
                      value={selectedPage.metaTitle || ""}
                      onChange={(e) => setSelectedPage({ ...selectedPage, metaTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-midnight-950 border border-midnight-700 text-ivory-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-ivory-300 font-semibold">Meta Description (SEO)</label>
                    <textarea
                      rows={2}
                      value={selectedPage.metaDescription || ""}
                      onChange={(e) => setSelectedPage({ ...selectedPage, metaDescription: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-midnight-950 border border-midnight-700 text-ivory-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-ivory-300 font-semibold">Publishing Status</label>
                    <select
                      value={selectedPage.status}
                      onChange={(e) => setSelectedPage({ ...selectedPage, status: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-midnight-950 border border-midnight-700 text-ivory-100"
                    >
                      <option value="PUBLISHED">PUBLISHED</option>
                      <option value="DRAFT">DRAFT</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-midnight-800">
                    <button
                      type="button"
                      onClick={() => setSelectedPage(null)}
                      className="px-4 py-2 rounded bg-midnight-800 text-ivory-300 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 rounded bg-gold-500 hover:bg-gold-600 text-midnight-950 font-bold"
                    >
                      {saving ? "Saving..." : "Save Page"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
