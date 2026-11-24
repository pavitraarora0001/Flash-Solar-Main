import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBanner } from "@/components/shared/cta-banner";
import { db } from "@/lib/db/store";
import {
  Sliders,
  Download,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Technical Specification Matrix & Comparison",
  description:
    "Comprehensive engineering specifications and side-by-side comparison for Flash Solar Power Wall, Direct-Current House, Hybrid AC Solar, and Containerized Storage.",
};

export default function SpecificationsPage() {
  const products = db.getProducts().filter((p) => p.status === "PUBLISHED");

  // Collect all unique specification keys across products
  const specKeySet = new Set<string>();
  products.forEach((p) => {
    Object.keys(p.specifications || {}).forEach((k) => specKeySet.add(k));
  });
  const specKeys = Array.from(specKeySet);

  return (
    <div className="min-h-screen flex flex-col bg-midnight-950 font-sans selection:bg-gold-500 selection:text-midnight-950">
      <Header />

      <main className="flex-1">
        <PageHero
          eyebrow="Precision Electrical Specifications"
          title="Hardware Specification Matrix"
          subtitle="Side-by-side physical, electrical, and thermal parameters across all Flash Solar energy storage and direct-current microgrid models."
          breadcrumbs={[{ label: "Specifications" }]}
          primaryCta={{ label: "Request Customized Sizing", href: "/enquiry" }}
          secondaryCta={{ label: "Download Technical Datasheets", href: "/resources" }}
          badgeText="Verified Laboratory Benchmarks"
          stats={[
            { label: "Nominal Chemistry", value: "LiFePO4", subtext: "Automotive-grade prismatic cells" },
            { label: "Endurance Benchmark", value: "6,000+", subtext: "Cycles to 80% capacity retention" },
            { label: "Bus Voltage", value: "48V DC", subtext: "Safe extra-low voltage compliant" },
            { label: "Standard Warranty", value: "10 Years", subtext: "Comprehensive manufacturer guarantee" },
          ]}
        />

        {/* Comparison Matrix Table */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-gold-400 uppercase tracking-widest block">
                Side-by-Side Comparison
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ivory-100 mt-1">
                Electrical & Mechanical Architecture Matrix
              </h2>
            </div>

            <Link
              href="/resources"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-midnight-900 border border-gold-500/30 hover:border-gold-400 text-gold-400 text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Official Datasheets (PDF)</span>
            </Link>
          </div>

          {/* Responsive Comparison Table Container */}
          <div className="border border-midnight-700/80 rounded-2xl overflow-hidden bg-midnight-900 shadow-elevated overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[720px]">
              <thead>
                <tr className="bg-midnight-950 border-b border-midnight-700/80">
                  <th className="py-5 px-6 text-xs font-mono font-semibold uppercase tracking-wider text-ivory-400 w-1/4">
                    Engineering Parameter
                  </th>
                  {products.map((prod) => (
                    <th
                      key={prod.id}
                      className="py-5 px-6 text-sm font-serif font-bold text-ivory-100 border-l border-midnight-800 text-center"
                    >
                      <div className="space-y-1">
                        <span className="block">{prod.name}</span>
                        <span className="inline-block text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-midnight-800 text-gold-400 border border-midnight-700">
                          {prod.sku || "PROD-2026"}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-midnight-800/80 text-xs">
                {/* 1. Usable Energy / Capacity */}
                <tr className="hover:bg-midnight-850/60 transition-colors">
                  <td className="py-4 px-6 font-mono text-ivory-300 font-medium">
                    Usable Storage Capacity
                  </td>
                  {products.map((prod) => (
                    <td
                      key={prod.id}
                      className="py-4 px-6 text-ivory-200 text-center border-l border-midnight-800 font-semibold"
                    >
                      {prod.specifications?.capacity || "Configurable"}
                    </td>
                  ))}
                </tr>

                {/* 2. Nominal Voltage */}
                <tr className="hover:bg-midnight-850/60 transition-colors">
                  <td className="py-4 px-6 font-mono text-ivory-300 font-medium">
                    Nominal Voltage
                  </td>
                  {products.map((prod) => (
                    <td
                      key={prod.id}
                      className="py-4 px-6 text-ivory-200 text-center border-l border-midnight-800 font-mono"
                    >
                      {prod.specifications?.voltage || "48.0 V – 51.2 V"}
                    </td>
                  ))}
                </tr>

                {/* 3. Cycle Life */}
                <tr className="hover:bg-midnight-850/60 transition-colors">
                  <td className="py-4 px-6 font-mono text-ivory-300 font-medium">
                    Cycle Life (@ 80% DoD, 25°C)
                  </td>
                  {products.map((prod) => (
                    <td
                      key={prod.id}
                      className="py-4 px-6 text-gold-400 text-center border-l border-midnight-800 font-semibold font-mono"
                    >
                      {prod.specifications?.cycleLife || "6,000+ Cycles"}
                    </td>
                  ))}
                </tr>

                {/* 4. Cell Chemistry */}
                <tr className="hover:bg-midnight-850/60 transition-colors">
                  <td className="py-4 px-6 font-mono text-ivory-300 font-medium">
                    Cell Chemistry
                  </td>
                  {products.map((prod) => (
                    <td
                      key={prod.id}
                      className="py-4 px-6 text-ivory-200 text-center border-l border-midnight-800 font-medium"
                    >
                      {prod.specifications?.chemistry || "LiFePO4 (LFP)"}
                    </td>
                  ))}
                </tr>

                {/* 5. Round-Trip Efficiency */}
                <tr className="hover:bg-midnight-850/60 transition-colors">
                  <td className="py-4 px-6 font-mono text-ivory-300 font-medium">
                    Round-Trip Efficiency
                  </td>
                  {products.map((prod) => (
                    <td
                      key={prod.id}
                      className="py-4 px-6 text-ivory-200 text-center border-l border-midnight-800 font-mono font-semibold"
                    >
                      {prod.specifications?.efficiency || "99.0% (DC Native)"}
                    </td>
                  ))}
                </tr>

                {/* Remaining Dynamic Specs */}
                {specKeys.slice(0, 6).map((k) => (
                  <tr key={k} className="hover:bg-midnight-850/60 transition-colors">
                    <td className="py-4 px-6 font-mono text-ivory-400">
                      {k.replace(/([A-Z])/g, " $1").trim()}
                    </td>
                    {products.map((prod) => (
                      <td
                        key={prod.id}
                        className="py-4 px-6 text-ivory-300 text-center border-l border-midnight-800"
                      >
                        {prod.specifications?.[k] || "—"}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Action CTA Row */}
                <tr className="bg-midnight-950/90">
                  <td className="py-5 px-6 font-mono text-ivory-400 text-xs">
                    Procurement & Sizing
                  </td>
                  {products.map((prod) => (
                    <td key={prod.id} className="py-5 px-6 text-center border-l border-midnight-800">
                      <div className="flex flex-col gap-2 items-center justify-center">
                        <Link
                          href={`/products/${prod.slug}`}
                          className="px-3 py-1.5 rounded text-xs font-semibold text-ivory-100 hover:text-gold-400 transition-colors"
                        >
                          View Details →
                        </Link>
                        <Link
                          href={`/enquiry?product=${prod.slug}`}
                          className="px-4 py-1.5 rounded bg-gold-500 hover:bg-gold-600 text-midnight-950 font-semibold text-xs transition-colors shadow-sm"
                        >
                          Configure Sizing
                        </Link>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Global CTA Banner */}
        <CtaBanner
          eyebrow="Technical Sizing Assistance"
          title="Require Custom Voltage or Parallel Cluster Configuration?"
          description="Flash Solar engineers configure battery racks, DC breakers, and CANBus BMS integration for residential, agricultural, and industrial microgrids."
          primaryCtaText="Consult Our Electrical Engineers"
          primaryCtaHref="/enquiry"
          secondaryCtaText="Explore Core Systems"
          secondaryCtaHref="/products"
        />
      </main>

      <Footer />
    </div>
  );
}
