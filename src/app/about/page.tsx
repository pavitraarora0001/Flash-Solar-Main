import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBanner } from "@/components/shared/cta-banner";
import { db } from "@/lib/db/store";
import {
  ShieldCheck,
  Zap,
  Cpu,
  CheckCircle2,
  Building2,
  Award,
  Globe2,
  Factory,
  Sliders,
  Quote,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Flash Solar | Engineering Philosophy & Heritage",
  description:
    "Learn about Flash Solar's clean energy storage mission, our thermodynamic direct-current engineering philosophy, and our manufacturing testing standards.",
};

export default function AboutPage() {
  const testimonials = db.getTestimonials().filter((t) => t.isPublished !== false);

  const pillars = [
    {
      icon: Cpu,
      title: "Direct-Current Architecture",
      description: "Eliminating the thermodynamic folly of converting DC solar to AC and back to DC. Our sub-60V native bus delivers 99.98% transmission efficiency.",
    },
    {
      icon: ShieldCheck,
      title: "Class 2 Touch-Safe Engineering",
      description: "Operating strictly under the 60V DC international safety threshold eliminates hazardous arc flashes, making residential microgrids genuinely touch-safe.",
    },
    {
      icon: Factory,
      title: "100% Factory Acceptance Tested",
      description: "Every single Flash Power Wall undergoes a 72-hour thermal stress test and cell impedance balancing cycle at our production facility before dispatch.",
    },
    {
      icon: Globe2,
      title: "Engineered for Tropical Climates",
      description: "Born and tested in Rajasthan, India, our passive convection cooling and thermal dissipation architecture reliably handles 55°C ambient temperatures.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-midnight-950 font-sans selection:bg-gold-500 selection:text-midnight-950">
      <Header />

      <main className="flex-1">
        <PageHero
          eyebrow="Engineering Philosophy & Heritage"
          title="Architects of Direct-Current Clean Energy"
          subtitle="Flash Solar was founded on a singular electrical engineering conviction: that modern clean energy systems should operate natively in direct current, eliminating wasteful inverter conversion stages."
          breadcrumbs={[{ label: "About Flash Solar" }]}
          primaryCta={{ label: "Contact Engineering Desk", href: "/contact" }}
          secondaryCta={{ label: "Explore Hardware Catalog", href: "/products" }}
          badgeText="Rajasthan Engineering HQ"
          stats={[
            { label: "Founded", value: "2019", subtext: "Engineering innovation" },
            { label: "Cell Chemistry", value: "LiFePO4", subtext: "Zero-cobalt stability" },
            { label: "Cycle Endurance", value: "6,000+", subtext: "80% DoD retention" },
            { label: "Testing Standard", value: "100% FAT", subtext: "Rigorous factory testing" },
          ]}
        />

        {/* Vision & Mission Section */}
        <section id="vision" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-mono text-gold-400 uppercase tracking-widest block">
                The Thermodynamic Imperative
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-ivory-100 tracking-tight leading-tight">
                Why We Built Flash Solar
              </h2>
              <p className="text-sm sm:text-base text-ivory-300 leading-relaxed">
                For decades, solar energy has been burdened by legacy 230V alternating-current architecture. Solar panels naturally generate direct current (DC). Batteries store direct current. Yet conventional installations invert DC to AC, then rectify it back to DC, squandering between 15% and 28% of generated power as wasted heat.
              </p>
              <p className="text-sm sm:text-base text-ivory-300 leading-relaxed">
                Flash Solar was created to challenge this convention. By establishing an elegant sub-60V direct-current microgrid, we allow solar panels to charge the Flash Power Wall and power native DC loads with near-zero thermodynamic loss.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-6 text-sm text-ivory-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                  <span>Sub-60V Class 2 Safety</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                  <span>Automotive-Grade Prismatic Cells</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                  <span>Independent Off-Grid Resilience</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-midnight-900 border border-gold-500/30 rounded-2xl p-8 space-y-6 shadow-elevated">
              <div className="relative h-64 w-full bg-midnight-950 rounded-xl overflow-hidden p-4 flex items-center justify-center">
                <Image
                  src="/images/solar-photovoltaic-generation.jpg"
                  alt="Flash Solar High-Efficiency Photovoltaic Generation"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-serif font-bold text-ivory-100">
                  Global Clean Energy Infrastructure
                </h3>
                <p className="text-xs text-ivory-400 leading-relaxed">
                  Headquartered in Kumher, Bharatpur, Rajasthan, our engineering and assembly operations adhere strictly to international electrical engineering standards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Core Pillars */}
        <section className="py-16 sm:py-24 bg-midnight-900/40 border-t border-b border-midnight-700/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-mono text-gold-400 uppercase tracking-widest block">
                Engineering Integrity
              </span>
              <h2 className="text-3xl font-serif font-bold text-ivory-100 tracking-tight">
                Our Four Engineering Pillars
              </h2>
              <p className="text-sm text-ivory-400">
                Principles that guide every component, busbar dimension, and BMS firmware algorithm we build.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pillars.map((pil, idx) => {
                const Icon = pil.icon;
                return (
                  <div
                    key={idx}
                    className="bg-midnight-900 border border-midnight-700/80 rounded-xl p-6 space-y-4 hover:border-gold-500/40 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-midnight-800 border border-gold-500/30 flex items-center justify-center text-gold-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-ivory-100">
                      {pil.title}
                    </h3>
                    <p className="text-xs text-ivory-400 leading-relaxed">
                      {pil.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-mono text-gold-400 uppercase tracking-widest block">
                Verified Field Feedback
              </span>
              <h2 className="text-3xl font-serif font-bold text-ivory-100 tracking-tight">
                What Engineers Say About Flash Solar
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-midnight-900 border border-midnight-700/80 rounded-2xl p-7 flex flex-col justify-between space-y-6 shadow-card"
                >
                  <div className="space-y-4">
                    <Quote className="w-8 h-8 text-gold-500/40" />
                    <p className="text-xs sm:text-sm text-ivory-300 leading-relaxed italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 border-t border-midnight-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-serif font-bold text-ivory-100">
                        {t.authorName}
                      </h4>
                      <p className="text-[11px] font-mono text-ivory-400">
                        {t.authorTitle ? `${t.authorTitle}, ` : ""}{t.company}
                      </p>
                    </div>
                    {t.rating && (
                      <span className="text-xs text-gold-400 font-mono">
                        ★ {t.rating}.0
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Global CTA Banner */}
        <CtaBanner
          eyebrow="Direct Engineering Consultation"
          title="Collaborate With Flash Solar Engineers"
          description="Whether you are an architect designing an off-grid residence or a contractor retrofitting commercial BESS storage, our team provides full electrical engineering support."
          primaryCtaText="Consult With Our Team"
          primaryCtaHref="/contact"
          secondaryCtaText="Explore Core Systems"
          secondaryCtaHref="/products"
        />
      </main>

      <Footer />
    </div>
  );
}
