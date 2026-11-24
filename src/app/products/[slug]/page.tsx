import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBanner } from "@/components/shared/cta-banner";
import { db } from "@/lib/db/store";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Download,
  Sliders,
  Cpu,
  Zap,
  BatteryCharging,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

const PRODUCT_IMAGES: Record<string, string> = {
  "flash-power-wall": "/images/flash-power-wall.jpg",
  "flash-dc-house": "/images/dc-house.svg",
  "flash-ac-house": "/images/ac-house.svg",
  "flash-container-0537": "/images/commercial-facility.svg",
  "flash-container-3740": "/images/commercial-facility.svg",
  "flash-test-cell-500w": "/images/solar-photovoltaic-generation.jpg",
};

export async function generateStaticParams() {
  const products = db.getProducts();
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = db.getProductBySlug(params.slug);
  if (!product) {
    return { title: "Product Not Found" };
  }
  return {
    title: `${product.name} | Technical Specifications`,
    description: product.summary,
  };
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const product = db.getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }

  const category = db.getProductCategories().find((c) => c.id === product.categoryId);
  const imageSrc = PRODUCT_IMAGES[product.slug] || "/images/flash-power-wall.jpg";
  const allProducts = db.getProducts().filter((p) => p.slug !== product.slug && p.status === "PUBLISHED");
  const related = allProducts.slice(0, 3);
  const specs = product.specifications || {};

  return (
    <div className="min-h-screen flex flex-col bg-midnight-950 font-sans selection:bg-gold-500 selection:text-midnight-950">
      <Header />

      <main className="flex-1">
        {/* Page Hero */}
        <PageHero
          eyebrow={category?.name || "Flash Solar Hardware"}
          title={product.name}
          subtitle={product.summary}
          breadcrumbs={[
            { label: "Core Systems", href: "/products" },
            { label: product.name },
          ]}
          primaryCta={{
            label: "Request System Sizing",
            href: `/enquiry?product=${product.slug}`,
          }}
          secondaryCta={{
            label: "Download Datasheet",
            href: product.datasheetUrl || "/resources",
            icon: <Download className="w-4 h-4 text-gold-400" />,
          }}
          badgeText="Active Production"
        />

        {/* Technical Showcase Section */}
        <section className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Product Imagery Stage */}
            <div className="lg:col-span-6 space-y-6">
              <div className="relative h-96 sm:h-[480px] bg-gradient-to-br from-midnight-900 to-midnight-950 rounded-2xl border border-midnight-700/80 p-8 flex items-center justify-center overflow-hidden shadow-elevated">
                {/* Visual ambient halo */}
                <div className="absolute inset-0 bg-radial-gradient from-gold-500/10 via-transparent to-transparent pointer-events-none" />

                <div className="relative w-full h-full">
                  <Image
                    src={imageSrc}
                    alt={product.name}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                <div className="absolute bottom-4 left-4 bg-midnight-900/90 border border-midnight-700/80 px-3 py-1.5 rounded-lg text-xs font-mono text-gold-400 flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Integrated Smart BMS Protocol</span>
                </div>
              </div>

              {/* Fast Spec Callout Banner */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-midnight-900/90 border border-midnight-700/80 rounded-xl p-4 text-center">
                  <span className="text-[11px] font-mono uppercase text-ivory-400 block">Chemistry</span>
                  <strong className="text-base font-serif text-ivory-100 mt-1 block">LiFePO4</strong>
                </div>
                <div className="bg-midnight-900/90 border border-midnight-700/80 rounded-xl p-4 text-center">
                  <span className="text-[11px] font-mono uppercase text-ivory-400 block">Endurance</span>
                  <strong className="text-base font-serif text-gold-400 mt-1 block">6,000+ Cycles</strong>
                </div>
                <div className="bg-midnight-900/90 border border-midnight-700/80 rounded-xl p-4 text-center">
                  <span className="text-[11px] font-mono uppercase text-ivory-400 block">Efficiency</span>
                  <strong className="text-base font-serif text-ivory-100 mt-1 block">99.98%</strong>
                </div>
              </div>
            </div>

            {/* Right: Technical Information & Description */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-midnight-800 text-gold-400 border border-midnight-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>10-Year Comprehensive Warranty</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ivory-100">
                  Engineering Overview
                </h2>
                <div className="text-sm sm:text-base text-ivory-300 leading-relaxed space-y-4">
                  <p>{product.description}</p>
                </div>
              </div>

              {/* Engineering Features Checklist */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400 font-mono">
                    Architectural Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-lg bg-midnight-900/70 border border-midnight-750"
                      >
                        <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-ivory-200 leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Complete Specifications Matrix Table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400 font-mono">
                    Technical Specifications
                  </h3>
                  <Link
                    href="/specifications"
                    className="text-xs text-ivory-400 hover:text-gold-400 transition-colors inline-flex items-center gap-1"
                  >
                    <Sliders className="w-3 h-3" />
                    <span>Compare vs Other Models</span>
                  </Link>
                </div>

                <div className="border border-midnight-700/80 rounded-xl overflow-hidden bg-midnight-900/90 divide-y divide-midnight-800">
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-3 px-4 text-xs">
                      <span className="text-ivory-400 font-mono">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <span className="text-ivory-100 font-semibold text-right">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fast Direct Inquiries Action Box */}
              <div className="p-6 rounded-xl bg-midnight-900 border border-gold-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-base font-serif font-bold text-ivory-100">
                    Require Sizing or Wholesale Supply?
                  </h4>
                  <p className="text-xs text-ivory-400">
                    Get an instant proposal with load analysis for {product.name}.
                  </p>
                </div>
                <Link
                  href={`/enquiry?product=${product.slug}`}
                  className="px-5 py-2.5 rounded-md bg-gold-500 hover:bg-gold-600 text-midnight-950 font-semibold text-xs transition-colors shrink-0 shadow-sm"
                >
                  Configure System
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products Carousel */}
        {related.length > 0 && (
          <section className="py-16 bg-midnight-900/40 border-t border-midnight-700/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-gold-400 uppercase tracking-wider block">
                    Complementary Topologies
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-ivory-100 mt-1">
                    Related Hardware & Systems
                  </h2>
                </div>
                <Link
                  href="/products"
                  className="text-xs text-gold-400 hover:text-gold-300 font-medium inline-flex items-center gap-1"
                >
                  <span>View All Systems</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((rel) => {
                  const relImg = PRODUCT_IMAGES[rel.slug] || "/images/flash-power-wall.jpg";
                  return (
                    <Link
                      key={rel.id}
                      href={`/products/${rel.slug}`}
                      className="group bg-midnight-900 border border-midnight-700/80 hover:border-gold-500/40 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <div className="relative h-44 w-full mb-4 bg-midnight-950 rounded-lg p-3">
                        <Image
                          src={relImg}
                          alt={rel.name}
                          fill
                          className="object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-base font-serif font-bold text-ivory-100 group-hover:text-gold-400 transition-colors">
                          {rel.name}
                        </h3>
                        <p className="text-xs text-ivory-400 line-clamp-2">
                          {rel.summary}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-midnight-800 flex items-center justify-between text-xs text-gold-400">
                        <span>View Architecture</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Global CTA Banner */}
        <CtaBanner
          eyebrow="Direct-Current Engineering Support"
          title={`Deploy ${product.name} with Engineering Validation`}
          description="We provide comprehensive electrical single-line diagrams (SLD), battery sizing calculations, and factory acceptance testing documentation."
          primaryCtaText="Request Engineering Consultation"
          primaryCtaHref={`/enquiry?product=${product.slug}`}
          secondaryCtaText="View All Specifications"
          secondaryCtaHref="/specifications"
        />
      </main>

      <Footer />
    </div>
  );
}
