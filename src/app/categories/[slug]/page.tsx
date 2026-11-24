import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBanner } from "@/components/shared/cta-banner";
import { db } from "@/lib/db/store";
import { ArrowRight, Sliders, Zap, CheckCircle2 } from "lucide-react";

interface CategoryPageProps {
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
  const categories = db.getProductCategories();
  return categories.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = db.getProductCategories().find((c) => c.slug === params.slug);
  if (!category) return { title: "Category Not Found" };
  return {
    title: `${category.name} | Systems & Hardware`,
    description: category.description,
  };
}

export default function CategoryDetailPage({ params }: CategoryPageProps) {
  const category = db.getProductCategories().find((c) => c.slug === params.slug);
  if (!category) notFound();

  const products = db.getProducts().filter((p) => p.categoryId === category.id && p.status === "PUBLISHED");
  const allCategories = db.getProductCategories();

  return (
    <div className="min-h-screen flex flex-col bg-midnight-950 font-sans selection:bg-gold-500 selection:text-midnight-950">
      <Header />

      <main className="flex-1">
        <PageHero
          eyebrow="Product Architecture Category"
          title={category.name}
          subtitle={category.description}
          breadcrumbs={[
            { label: "Core Systems", href: "/products" },
            { label: category.name },
          ]}
          primaryCta={{ label: "Request Category Sizing", href: "/enquiry" }}
          secondaryCta={{ label: "Spec Matrix", href: "/specifications" }}
          badgeText={`${products.length} Verified Systems`}
        />

        {/* Category switcher */}
        <section className="bg-midnight-900 border-b border-midnight-700/60 py-4 px-4 sticky top-20 z-30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-2">
              <Link
                href="/products"
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-midnight-800 text-ivory-300 hover:text-white border border-midnight-700 transition-colors"
              >
                All Systems
              </Link>
              {allCategories.map((c) => {
                const active = c.id === category.id;
                return (
                  <Link
                    key={c.id}
                    href={`/categories/${c.slug}`}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                      active
                        ? "bg-gold-500 text-midnight-950 shadow-sm"
                        : "bg-midnight-800 text-ivory-300 hover:text-white border border-midnight-700"
                    }`}
                  >
                    {c.name}
                  </Link>
                );
              })}
            </div>
            <Link
              href="/specifications"
              className="text-xs text-gold-400 hover:text-gold-300 font-medium inline-flex items-center gap-1 shrink-0"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Full Comparison Matrix →</span>
            </Link>
          </div>
        </section>

        {/* Products in this category */}
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
                  <div className="relative h-64 bg-midnight-950 flex items-center justify-center p-6 border-b border-midnight-700/60 overflow-hidden">
                    <div className="relative w-full h-full">
                      <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h2 className="text-xl font-serif font-bold text-ivory-100 group-hover:text-gold-400 transition-colors">
                        {product.name}
                      </h2>
                      <p className="text-xs text-ivory-400 mt-2 line-clamp-2 leading-relaxed">
                        {product.summary}
                      </p>
                    </div>

                    <div className="bg-midnight-950/70 border border-midnight-750 rounded-lg p-3 grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(specs).slice(0, 4).map(([key, value]) => (
                        <div key={key} className="space-y-0.5">
                          <span className="text-[10px] text-ivory-400 font-mono uppercase tracking-wider block">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <span className="text-xs font-semibold text-ivory-200 truncate block">
                            {String(value)}
                          </span>
                        </div>
                      ))}
                    </div>

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

        <CtaBanner
          eyebrow={category.name}
          title={`Deploy ${category.name} for Your Site`}
          description="Speak with our electrical engineering team to design custom distribution topology and sizing."
          primaryCtaText="Request Sizing"
          primaryCtaHref="/enquiry"
          secondaryCtaText="View All Products"
          secondaryCtaHref="/products"
        />
      </main>

      <Footer />
    </div>
  );
}
