import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBanner } from "@/components/shared/cta-banner";
import { db } from "@/lib/db/store";
import {
  Zap,
  Cpu,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingDown,
  Layers,
  ThermometerSnowflake,
  Activity,
  Sliders,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Direct-Current Architecture & Thermodynamic Engineering",
  description:
    "Explore Flash Solar's sub-60V native direct-current microgrid architecture. Eliminates multi-stage DC-AC-DC conversion losses for 99.98% bus efficiency.",
};

export default function EngineeringPage() {
  const stages = db.getEngineeringStages().filter((s) => s.status === "PUBLISHED");

  return (
    <div className="min-h-screen flex flex-col bg-midnight-950 font-sans selection:bg-gold-500 selection:text-midnight-950">
      <Header />

      <main className="flex-1">
        <PageHero
          eyebrow="Thermodynamic Power Architecture"
          title="Direct-Current Microgrid Engineering"
          subtitle="Conventional AC solar systems waste 15% to 28% of energy converting solar DC to AC and back to DC for battery storage. Flash Solar eliminates inverter losses with a native sub-60V direct-current bus."
          breadcrumbs={[{ label: "DC Engineering" }]}
          primaryCta={{ label: "Consult an Electrical Engineer", href: "/enquiry" }}
          secondaryCta={{ label: "Compare System Specifications", href: "/specifications" }}
          badgeText="Class 2 Touch-Safe Sub-60V"
          stats={[
            { label: "Conversion Loss", value: "0%", subtext: "Zero round-trip inverter conversion" },
            { label: "Bus Efficiency", value: "99.98%", subtext: "Solid copper busbar distribution" },
            { label: "Nominal Bus", value: "48V DC", subtext: "Safe extra-low voltage (SELV)" },
            { label: "Cycle Life", value: "6,000+", subtext: "Deep discharge endurance" },
          ]}
        />

        {/* 1. Thermodynamic Comparison: DC Native vs Traditional AC */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono text-gold-400 uppercase tracking-widest block">
              Thermodynamic Efficiency Audit
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-ivory-100 tracking-tight">
              Why Inverting to AC Is Structurally Inefficient
            </h2>
            <p className="text-sm sm:text-base text-ivory-300">
              Solar panels produce DC electricity. Batteries store DC electricity. Modern heat pumps, LED lighting, and electronics run internally on DC. Conventional solar forces two redundant inversion cycles.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Conventional AC System Card */}
            <div className="bg-midnight-900/60 border border-red-500/30 rounded-2xl p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-red-500/10 text-red-400 border border-red-500/20">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Conventional High-Loss Architecture</span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-ivory-100">
                  Traditional AC Solar Microgrid
                </h3>
                <p className="text-sm text-ivory-400 leading-relaxed">
                  Solar DC power is inverted into 230V AC, then rectified back to DC to charge the battery bank, and inverted a second time for household appliances.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-midnight-950/80 border border-midnight-800 text-xs">
                    <span className="text-ivory-300">Solar Inverter Stage 1</span>
                    <span className="text-red-400 font-mono font-semibold">-4% to -8% loss</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-midnight-950/80 border border-midnight-800 text-xs">
                    <span className="text-ivory-300">AC-to-DC Charger Stage 2</span>
                    <span className="text-red-400 font-mono font-semibold">-6% to -10% loss</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-midnight-950/80 border border-midnight-800 text-xs">
                    <span className="text-ivory-300">Battery Inverter Stage 3</span>
                    <span className="text-red-400 font-mono font-semibold">-5% to -10% loss</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-midnight-800 flex items-center justify-between">
                <span className="text-xs uppercase font-mono text-ivory-400">Total System Energy Loss:</span>
                <span className="text-xl font-serif font-bold text-red-400">15% – 28% Lost as Heat</span>
              </div>
            </div>

            {/* Flash Solar DC Native System Card */}
            <div className="bg-gradient-to-br from-midnight-900 to-midnight-850 border border-gold-500/50 rounded-2xl p-8 flex flex-col justify-between space-y-6 shadow-goldGlow">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-gold-500/20 text-gold-400 border border-gold-500/30">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Flash Solar Zero-Conversion Standard</span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-ivory-100">
                  Flash Direct-Current Architecture
                </h3>
                <p className="text-sm text-ivory-300 leading-relaxed">
                  Solar DC power flows straight to a common 48V DC bus, charging the Flash Power Wall directly and powering native DC equipment without intermediate conversion.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-midnight-950/80 border border-gold-500/20 text-xs">
                    <span className="text-ivory-200">Solar MPPT Direct to DC Bus</span>
                    <span className="text-gold-400 font-mono font-semibold">99.2% Efficiency</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-midnight-950/80 border border-gold-500/20 text-xs">
                    <span className="text-ivory-200">Flash Power Wall Direct Coupling</span>
                    <span className="text-gold-400 font-mono font-semibold">99.8% Efficiency</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-midnight-950/80 border border-gold-500/20 text-xs">
                    <span className="text-ivory-200">Native DC Appliances & BLDC Motors</span>
                    <span className="text-gold-400 font-mono font-semibold">Direct Native Power</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gold-500/30 flex items-center justify-between">
                <span className="text-xs uppercase font-mono text-ivory-300">Total System Energy Efficiency:</span>
                <span className="text-xl font-serif font-bold text-gold-400">99.0% Real-World Efficiency</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Interactive 5-Stage Direct-Current Journey */}
        <section className="py-16 sm:py-24 bg-midnight-900/50 border-t border-b border-midnight-700/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-mono text-gold-400 uppercase tracking-widest block">
                Engineering Process Flow
              </span>
              <h2 className="text-3xl font-serif font-bold text-ivory-100 tracking-tight">
                5-Stage Direct-Current Energy Flow
              </h2>
              <p className="text-sm text-ivory-400">
                From photovoltaic generation on the roof to solid-state lithium storage and native loads, explore each stage of the Flash Solar direct-current topology.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {stages.map((stg) => (
                <div
                  key={stg.id}
                  className="bg-midnight-900 border border-midnight-700/80 rounded-xl p-5 space-y-3 relative overflow-hidden group hover:border-gold-500/40 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-serif font-bold text-gold-400">
                      {String(stg.stageNumber).padStart(2, "0")}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-midnight-800 border border-midnight-700 flex items-center justify-center text-gold-400">
                      <Cpu className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-base font-serif font-bold text-ivory-100 group-hover:text-gold-400 transition-colors">
                    {stg.title}
                  </h3>

                  <p className="text-xs text-ivory-400 leading-relaxed">
                    {stg.description}
                  </p>

                  <div className="pt-2 border-t border-midnight-800 text-[11px] font-mono text-ivory-300">
                    <span className="text-gold-400">Voltage:</span> 48V DC Bus
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Safety Standard: Touch-Safe Sub-60V DC */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono text-gold-400 uppercase tracking-widest block">
                Class 2 Electrical Safety
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-ivory-100 tracking-tight leading-tight">
                Sub-60V Extra-Low Voltage: Elimination of High-Voltage Arc Hazards
              </h2>
              <p className="text-sm sm:text-base text-ivory-300 leading-relaxed">
                Conventional residential solar strings operate between 300V and 600V DC. At these voltages, direct-current creates self-sustaining plasma arcs that cannot extinguish on their own if insulation fails.
              </p>
              <p className="text-sm sm:text-base text-ivory-300 leading-relaxed">
                Flash Solar architectures standardize on 48V nominal (sub-60V maximum). By keeping voltage below the international Safety Extra-Low Voltage (SELV) threshold, fire risk is eliminated, conduit requirements are simplified, and system maintenance is touch-safe.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-ivory-200">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>SELV-compliant extra-low voltage bus (no lethal shock potential)</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-ivory-200">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Zero self-sustaining DC arc danger across all junctions</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-ivory-200">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Direct battery integration with automotive and telecom hardware</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-gradient-to-br from-midnight-900 to-midnight-850 border border-gold-500/30 rounded-2xl p-8 space-y-6 shadow-elevated">
              <h3 className="text-xl font-serif font-bold text-ivory-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gold-400" />
                <span>Electrical Engineering Safety Parameters</span>
              </h3>

              <div className="divide-y divide-midnight-800 text-xs">
                <div className="py-3 flex justify-between">
                  <span className="text-ivory-400 font-mono">Nominal Operating Voltage</span>
                  <span className="text-ivory-100 font-semibold font-mono">48.0 V – 51.2 V DC</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-ivory-400 font-mono">Maximum Float Voltage</span>
                  <span className="text-ivory-100 font-semibold font-mono">57.6 V DC (Below 60V SELV)</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-ivory-400 font-mono">Busbar Material</span>
                  <span className="text-ivory-100 font-semibold">Solid Tinned Electrolytic Copper (ETP)</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-ivory-400 font-mono">Thermal Dissipation</span>
                  <span className="text-ivory-100 font-semibold">Convection-cooled aluminium chassis</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-ivory-400 font-mono">BMS Communications</span>
                  <span className="text-ivory-100 font-semibold font-mono">CANBus 2.0B / RS485 / Modbus RTU</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/specifications"
                  className="w-full py-2.5 rounded-md bg-midnight-950 border border-gold-500/30 text-gold-400 hover:text-gold-300 text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Inspect Complete Hardware Matrix</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Global CTA Banner */}
        <CtaBanner
          eyebrow="Electrical Engineering Consultation"
          title="Review Your Project Single-Line Diagram with Flash Engineers"
          description="Send us your electrical load list or site plan to calculate DC busbar requirements, cable cross-sections, and battery sizing."
          primaryCtaText="Consult Our Engineering Team"
          primaryCtaHref="/enquiry"
          secondaryCtaText="Download Architecture Guide"
          secondaryCtaHref="/resources"
        />
      </main>

      <Footer />
    </div>
  );
}
