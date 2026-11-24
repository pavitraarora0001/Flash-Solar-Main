import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBanner } from "@/components/shared/cta-banner";
import { db } from "@/lib/db/store";
import { ArrowRight, Sliders, Battery, Zap, Shield, CheckCircle2, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "Core Systems & Energy Storage Hardware",
  description:
    "Explore Flash Solar's clean energy storage systems: Flash Power Wall, Direct-Current House microgrids, Hybrid AC solutions, and industrial containerized storage.",
};

// Map product slugs to local optimized illustrations/photorealistic images
const PRODUCT_IMAGES: Record<string, string> = {
  "flash-power-wall": "/images/flash-power-wall.jpg",
  "flash-dc-house": "/images/dc-house.svg",
  "flash-ac-house": "/images/ac-house.svg",
  "flash-container-0537": "/images/commercial-facility.svg",
  "flash-container-3740": "/images/commercial-facility.svg",
  "flash-test-cell-500w": "/images/solar-photovoltaic-generation.jpg",
};

export default function ProductsPage() {
  const products = db.getProducts().filter((p) => p.status === "PUBLISHED");
  const categories = db.getProductCategories();

  return (
    <div className="min-h-screen flex flex-col bg-midnight-950 font-sans selection:bg-gold-500 selection:text-midnight-950">
      <Header />

      <main className="flex-1">
        {/* Page Hero */}
        <PageHero
          eyebrow="Hardware & Energy Storage Systems"
          title="Engineered Clean Power Systems"
          subtitle="Precision-engineered Lithium Iron Phosphate (LiFePO4) battery systems and direct-current microgrid architectures designed for continuous off-grid resilience and 99.98% efficiency."
          breadcrumbs={[{ label: "Core Systems" }]}
          primaryCta={{ label: "Request System Sizing", href: "/enquiry" }}
          secondaryCta={{ label: "Compare In Spec Matrix", href: "/specifications" }}
          badgeText="Tier-1 LiFePO4 Cells"
          stats={[
            { label: "Cycle Endurance", value: "6,000+", subtext: "80% DoD @ 25°C" },
            { label: "Bus Efficiency", value: "99.98%", subtext: "Zero-loss DC bus" },
            { label: "Safe Bus Voltage", value: "sub-60V", subtext: "Touch-safe DC architecture" },
            { label: "Cell Chemistry", value: "LiFePO4", subtext: "Zero cobalt, non-flammable" },
          ]}
        />

        {/* Category Pills Bar */}
        <section className="bg-midnight-900 border-b border-midnight-700/60 py-4 px-4 sticky top-20 z-30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-ivory-400 uppercase tracking-wider hidden sm:inline mr-2">
                Categories:
              </span>
              <Link
                href="/products"
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-gold-500 text-midnight-950 shadow-sm"
              >
                All Systems ({products.length})
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-midnight-800 text-ivory-300 hover:text-white hover:bg-midnight-750 border border-midnight-700 transition-colors whitespace-nowrap"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <Link
              href="/specifications"
              className="hidden md:inline-flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300 font-medium whitespace-nowrap"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Full Comparison Matrix →</span>
            </Link>
          </div>
        </section>

        {/* Product Catalog Grid */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const imageSrc = PRODUCT_IMAGES[product.slug] || "/images/flash-power-wall.jpg";
              const specs = product.specifications || {};

              return (
                <article
                  key={product.id}
                  className="bg-midnight-900/90 border border-midnight-700/80 hover:border-gold-500/50 rounded-xl overflow-hidden flex flex-col transition-all duration-300 group shadow-card hover:shadow-elevated hover:-translate-y-1"
                >
                  {/* Product Image Area */}
                  <div className="relative h-64 bg-midnight-950 flex items-center justify-center p-6 border-b border-midnight-700/60 overflow-hidden">
                    <div className="absolute top-3 left-3 z-10 flex gap-2">
                      {product.featured && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-gold-500/20 text-gold-400 border border-gold-500/30">
                          <Zap className="w-3 h-3" />
                          <span>Flagship</span>
                        </span>
                      )}
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-midnight-800/80 text-ivory-300 border border-midnight-700">
                        LiFePO4
                      </span>
                    </div>

                    <div className="relative w-full h-full">
                      <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h2 className="text-xl font-serif font-bold text-ivory-100 group-hover:text-gold-400 transition-colors">
                        {product.name}
                      </h2>
                      <p className="text-xs text-ivory-400 mt-2 line-clamp-2 leading-relaxed">
                        {product.summary}
                      </p>
                    </div>

                    {/* Spec Highlights Table */}
                    <div className="bg-midnight-950/70 border border-midnight-750 rounded-lg p-3 grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(specs).slice(0, 4).map(([key, value]) => (
                        <div key={key} className="space-y-0.5">
                          <span className="text-[10px] text-ivory-400 font-mono uppercase tracking-wider block">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <span className="text-xs font-semibold text-ivory-200 truncate block">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Features list */}
                    {product.features && product.features.length > 0 && (
                      <ul className="space-y-1.5 text-xs text-ivory-300">
                        {product.features.slice(0, 3).map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Action Link */}
                    <div className="pt-2 border-t border-midnight-800 flex items-center justify-between">
                      <Link
                        href={`/products/${product.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors"
                      >
                        <span>Technical Details</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>

                      <Link
                        href={`/enquiry?product=${product.slug}`}
                        className="text-xs text-ivory-400 hover:text-white transition-colors"
                      >
                        Quote Request →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Global CTA Banner */}
        <CtaBanner
          eyebrow="Custom Energy Architecture"
          title="Need a Bespoke Microgrid or High-Voltage Storage System?"
          description="Our electrical engineering team designs parallelized battery topologies, custom DC switchgear, and utility-scale containerized systems."
          primaryCtaText="Contact Engineering Desk"
          primaryCtaHref="/enquiry"
          secondaryCtaText="Explore Spec Matrix"
          secondaryCtaHref="/specifications"
        />
      </main>

      <Footer />
    </div>
  );
}
