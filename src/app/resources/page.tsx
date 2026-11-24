import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBanner } from "@/components/shared/cta-banner";
import { db } from "@/lib/db/store";
import {
  FileText,
  Download,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Cpu,
  Layers,
  FileCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Technical Resources, Datasheets & Architecture Guides",
  description:
    "Official Flash Solar technical datasheets, direct-current microgrid schematics, electrical whitepapers, and installation guides for certified engineers.",
};

export default function ResourcesPage() {
  const resources = db.getResources().filter((r) => r.status === "PUBLISHED");

  const categories = [
    { label: "All Resources", count: resources.length },
    { label: "Datasheets", count: resources.filter((r) => r.resourceType === "DATASHEET").length },
    { label: "Whitepapers", count: resources.filter((r) => r.resourceType === "WHITEPAPER").length },
    { label: "Manuals", count: resources.filter((r) => r.resourceType === "MANUAL").length },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-midnight-950 font-sans selection:bg-gold-500 selection:text-midnight-950">
      <Header />

      <main className="flex-1">
        <PageHero
          eyebrow="Engineering Documentation Desk"
          title="Technical Documentation & Datasheets"
          subtitle="Download certified electrical datasheets, discharge curve profiles, single-line diagrams, and DC microgrid whitepapers prepared by Flash Solar electrical architects."
          breadcrumbs={[{ label: "Resources" }]}
          primaryCta={{ label: "Request Custom Schematics", href: "/enquiry" }}
          secondaryCta={{ label: "View Specification Matrix", href: "/specifications" }}
          badgeText="Official Engineering Publications"
          stats={[
            { label: "Documentation", value: "Verified", subtext: "Factory certified specs" },
            { label: "Format", value: "PDF & CAD", subtext: "Direct engineering downloads" },
            { label: "Access Level", value: "Open Public", subtext: "Free technical access" },
            { label: "Updates", value: "Quarterly", subtext: "Rev 2026.4 current" },
          ]}
        />

        {/* Resources Grid Section */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-midnight-800 pb-6">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              {categories.map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                    idx === 0
                      ? "bg-gold-500 text-midnight-950 font-semibold"
                      : "bg-midnight-900 text-ivory-300 hover:text-white border border-midnight-750"
                  }`}
                >
                  {c.label} ({c.count})
                </button>
              ))}
            </div>

            <span className="text-xs font-mono text-ivory-400">
              Showing {resources.length} Verified Engineering Documents
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((res) => (
              <div
                key={res.id}
                className="bg-midnight-900 border border-midnight-700/80 hover:border-gold-500/40 rounded-xl p-6 flex flex-col justify-between space-y-5 transition-all duration-300 group shadow-card hover:shadow-elevated"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-medium uppercase bg-midnight-800 border border-midnight-700 text-gold-400">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{res.resourceType}</span>
                    </span>
                    <span className="text-[11px] font-mono text-ivory-400">
                      {res.fileSize}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-ivory-100 group-hover:text-gold-400 transition-colors">
                    {res.title}
                  </h3>

                  <p className="text-xs text-ivory-400 leading-relaxed line-clamp-3">
                    {res.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-midnight-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-ivory-400">
                    Downloads: <strong className="text-ivory-200">{res.downloadCount}</strong>
                  </span>

                  <a
                    href={res.fileUrl}
                    download
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-midnight-800 hover:bg-gold-500 hover:text-midnight-950 text-gold-400 border border-gold-500/30 text-xs font-medium transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Global CTA Banner */}
        <CtaBanner
          eyebrow="Custom Engineering Schematics"
          title="Require Specific Electrical Single-Line Diagrams?"
          description="We generate project-specific CAD schematics, wire gauge sizing reports, and protection coordination curves for authorized contractors."
          primaryCtaText="Contact Engineering Support"
          primaryCtaHref="/enquiry"
          secondaryCtaText="Compare Specifications"
          secondaryCtaHref="/specifications"
        />
      </main>

      <Footer />
    </div>
  );
}
