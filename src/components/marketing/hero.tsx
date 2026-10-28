import * as React from "react";
import Image from "next/image";
import { ArrowRight, Shield, Zap, CheckCircle2, Sliders, Battery, SunMedium } from "lucide-react";
import { BenchmarkPanel } from "./benchmark-panel";

export function Hero() {
  const benefits = [
    { label: "Double Inversion Waste Eliminated", icon: Zap },
    { label: "Native 48V Low-Voltage Safety", icon: Shield },
    { label: "LiFePO4 Modular Architecture", icon: Battery },
    { label: "High Continuous Duty Cycle", icon: SunMedium },
  ];

  return (
    <section className="relative bg-midnight-900 text-ivory-100 pt-16 sm:pt-24 pb-20 sm:pb-32 px-4 sm:px-6 lg:px-8 border-b border-midnight-700/80 overflow-hidden">
      {/* Background Ambient Glow & Grid Linework */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(242,179,63,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#101f32_1px,transparent_1px),linear-gradient(to_bottom,#101f32_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Copy & CTAs */}
          <div className="lg:col-span-7 space-y-7">
            {/* Small Outlined Gold Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold-500/50 bg-midnight-800/80 text-gold-400 text-xs font-semibold uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
              <span>Next-Generation Energy Resilience</span>
            </div>

            {/* Large Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-ivory-100 leading-[1.12]">
              Engineered for{" "}
              <span className="text-gold-500 underline decoration-gold-500/30 decoration-wavy underline-offset-8">
                Zero-Loss
              </span>{" "}
              Solar Storage.
            </h1>

            {/* Supporting Engineering Copy */}
            <p className="text-base sm:text-lg text-ivory-400 max-w-2xl leading-relaxed">
              Flash Solar designs industrial-grade energy storage systems and direct-current microgrid architectures. By coupling high-density lithium storage directly to DC loads, we eliminate the 15% to 22% thermal and inversion waste typical of conventional AC systems.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <a
                href="#core-systems"
                className="inline-flex justify-center items-center gap-2.5 px-6 py-3.5 rounded-md bg-gold-500 hover:bg-gold-600 text-midnight-950 font-semibold text-sm transition-all duration-200 shadow-goldGlow hover:shadow-none focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-midnight-900"
              >
                <span>View Core Systems</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#dc-engineering"
                className="inline-flex justify-center items-center gap-2.5 px-6 py-3.5 rounded-md bg-midnight-800/80 hover:bg-midnight-750 text-ivory-200 hover:text-white font-medium text-sm transition-colors border border-midnight-700 focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <Sliders className="w-4 h-4 text-gold-400" />
                <span>Technical Framework</span>
              </a>
            </div>

            {/* Compact Benefits Row */}
            <div className="pt-6 border-t border-midnight-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-ivory-300">
              {benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.label} className="flex items-center gap-2.5 bg-midnight-850/60 p-2.5 rounded-md border border-midnight-800">
                    <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                    <span className="font-medium text-ivory-200">{b.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Industrial Facility Visual + Floating Benchmark Panel */}
          <div className="lg:col-span-5 relative">
            {/* Visual Container */}
            <div className="relative rounded-2xl overflow-hidden border border-midnight-700 shadow-2xl bg-midnight-950">
              <div className="relative h-64 sm:h-72 w-full">
                <Image
                  src="/images/hero-solar.jpg"
                  alt="Industrial Solar and Battery Energy Storage Facility"
                  fill
                  priority
                  className="object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-midnight-950/60 to-transparent" />
                
                {/* Visual Label Tag */}
                <div className="absolute top-4 left-4 bg-midnight-900/90 backdrop-blur-md border border-midnight-700 px-3 py-1 rounded text-[11px] text-ivory-300 font-mono flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span>Flash Solar Industrial Topology</span>
                </div>
              </div>

              {/* Benchmark Data Card Overlay */}
              <div className="p-4 sm:p-5 -mt-12 relative z-20">
                <BenchmarkPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

