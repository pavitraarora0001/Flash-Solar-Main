"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BatteryCharging, Zap, Sun, ArrowRight, CheckCircle2, Sliders, ShieldCheck } from "lucide-react";

export function InteractiveProductShowcase() {
  const [selectedProduct, setSelectedProduct] = React.useState(0);

  const products = [
    {
      id: "power-wall",
      title: "Flash Power Wall",
      tagline: "Dedicated High-Density LiFePO4 Energy Storage",
      badge: "Core Hardware • 51.2V DC",
      image: "/images/flash-power-wall.jpg",
      isPhoto: true,
      summary:
        "Engineered for residential wall-mount and commercial parallel clustering. Standardizes on high-purity Lithium Iron Phosphate cells with multi-tier active BMS thermal protection.",
      specs: [
        { label: "Nominal Operating Bus", val: "51.2 V DC (48V Safe)" },
        { label: "Cell Chemistry", val: "LiFePO4 Lithium Iron" },
        { label: "Depth of Discharge", val: "Up to 90% Usable" },
        { label: "Cycle Endurance", val: "6,000+ Cycles @ 80% DoD" },
        { label: "Parallel Scalability", val: "Up to 8 Units Modular" },
        { label: "Mounting Architecture", val: "Wall-Mount / Rack Compatible" },
      ],
      features: [
        "Integrated dual-redundant BMS balancing",
        "Over-voltage and short-circuit instant isolation",
        "CAN / RS485 communication bus integration",
        "Compact footprint with zero liquid thermal maintenance",
      ],
      ctaText: "Request Power Wall Datasheet & Sizing",
    },
    {
      id: "dc-house",
      title: "Flash DC House",
      tagline: "The Zero-Loss Pure Direct-Current Microgrid",
      badge: "Microgrid Standard • 12V/24V/48V",
      image: "/images/dc-house.svg",
      summary:
        "A ground-up direct-current residential infrastructure that distributes power straight from solar panels and Flash Power Walls to DC appliances, completely bypassing the inverter conversion penalty.",
      specs: [
        { label: "Inverter Conversion Loss", val: "0% (Pure DC Native)" },
        { label: "Standard Bus Voltage", val: "Sub-60V DC Low-Voltage" },
        { label: "Supported End-Loads", val: "BLDC Fans, LED Arrays, DC Cooling" },
        { label: "Thermal Footprint", val: "Minimal (No Inverter Radiators)" },
        { label: "System Autonomy", val: "Extended +18% to +22% Range" },
        { label: "Safety Classification", val: "Class 2 Low-Voltage Safe" },
      ],
      features: [
        "Eliminates central inverter failure points",
        "Native power for brushless DC fan motors and refrigeration",
        "Dramatically reduced standby parasitic drain",
        "Simplified electrical safety codes for domestic wiring",
      ],
      ctaText: "Inquire for DC House Architectural Design",
    },
    {
      id: "ac-house",
      title: "Flash AC House",
      tagline: "Hybrid Alternating-Current Solar Resilience",
      badge: "Hybrid Standard • 230V AC",
      image: "/images/ac-house.svg",
      summary:
        "Designed for existing residential buildings with legacy 230V AC wiring. Combines pure sine-wave hybrid inverter topologies with Flash Solar battery banks for uninterrupted grid synchronization.",
      specs: [
        { label: "AC Distribution", val: "230V Single-Phase / 400V 3-Phase" },
        { label: "Waveform Quality", val: "<3% THD Pure Sine Wave" },
        { label: "Switchover Speed", val: "<10ms Automatic Transfer" },
        { label: "Battery Coupling", val: "Flash Power Wall Compatible" },
        { label: "Grid Interaction", val: "Export Limiting & Peak Shaving" },
        { label: "Backup Coverage", val: "Essential Circuits / Full Facility" },
      ],
      features: [
        "Full backward compatibility with existing home wiring",
        "Instant automatic transfer switch during utility grid cuts",
        "Smart solar priority charging with off-peak grid fallback",
        "High surge headroom for inductive AC motor starts",
      ],
      ctaText: "Inquire for AC Hybrid Integration",
    },
  ];

  const current = products[selectedProduct];

  return (
    <section id="products-showcase" className="bg-midnight-950 text-ivory-100 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-midnight-700/80">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-midnight-800 border border-gold-500/40 text-gold-400 text-xs font-semibold uppercase tracking-widest">
              <Sliders className="w-3.5 h-3.5 text-gold-400" />
              <span>Verified Hardware &amp; Systems</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-ivory-100 tracking-tight">
              Interactive Product Showcase
            </h2>
            <p className="text-sm sm:text-base text-ivory-400 leading-relaxed">
              Explore Flash Solar’s core storage architectures. Toggle between systems to compare technical specifications, electrical topology, and practical deployment applications.
            </p>
          </div>

          {/* Interactive System Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-midnight-900 border border-midnight-700 rounded-xl">
            {products.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setSelectedProduct(idx)}
                className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-500 ${
                  selectedProduct === idx
                    ? "bg-gold-500 text-midnight-950 shadow-goldGlow"
                    : "text-ivory-300 hover:text-white hover:bg-midnight-800"
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Pinned Showcase Card with Animation */}
        <div className="bg-midnight-900 border border-midnight-700 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
            >
              {/* Left Column: Product Specifications & Features */}
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-gold-400 uppercase tracking-widest block">
                    {current.badge}
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-heading font-extrabold text-ivory-100 tracking-tight">
                    {current.title}
                  </h3>
                  <p className="text-sm font-medium text-ivory-300">
                    {current.tagline}
                  </p>
                </div>

                <p className="text-sm text-ivory-400 leading-relaxed">
                  {current.summary}
                </p>

                {/* Technical Specifications Grid */}
                <div className="pt-2 border-t border-midnight-800">
                  <span className="text-xs font-mono font-bold text-ivory-300 uppercase tracking-wider block mb-3">
                    Technical Specifications Matrix
                  </span>
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    {current.specs.map((s) => (
                      <div key={s.label} className="p-2.5 bg-midnight-950/70 border border-midnight-800 rounded-lg">
                        <span className="text-[10px] text-ivory-400 block">{s.label}</span>
                        <span className="font-mono font-bold text-gold-400 mt-0.5 block">{s.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature Bullet Points */}
                <div className="space-y-2 pt-2">
                  {current.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs text-ivory-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <a
                    href="#enquiry"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-gold-500 hover:bg-gold-600 text-midnight-950 font-semibold text-xs transition-colors shadow-goldGlow"
                  >
                    <span>{current.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Right Column: Visual Component Presentation */}
              <div className="lg:col-span-6 relative">
                <div
                  className={`group relative w-full rounded-2xl overflow-hidden border border-midnight-700/80 bg-midnight-950 shadow-2xl transition-all duration-300 hover:border-gold-500/50 ${
                    current.isPhoto ? "h-80 sm:h-96 lg:h-[420px]" : "h-80 sm:h-96 flex items-center justify-center p-6"
                  }`}
                >
                  <Image
                    src={current.image}
                    alt={`${current.title} High Resolution Product Presentation`}
                    fill
                    className={`${
                      current.isPhoto
                        ? "object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        : "object-contain p-4"
                    }`}
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 45vw"
                  />

                  {current.isPhoto && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-midnight-950/80 via-transparent to-midnight-950/20 pointer-events-none" />

                      {/* Brand Overlay Badge in HTML */}
                      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-midnight-950/90 backdrop-blur-md border border-gold-500/30 px-3 py-1.5 rounded-lg shadow-lg">
                        <div className="relative w-5 h-5 rounded overflow-hidden">
                          <Image src="/images/logo.png" alt="Flash Solar Logo" width={20} height={20} className="object-contain" />
                        </div>
                        <span className="text-[11px] font-heading font-extrabold text-ivory-100 tracking-tight">
                          FLASH <span className="text-gold-400">SOLAR</span>
                        </span>
                        <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-semibold border-l border-midnight-700 pl-2">
                          ACTIVE HARDWARE
                        </span>
                      </div>
                    </>
                  )}

                  {/* Identification Badge */}
                  <div className="absolute bottom-4 right-4 bg-midnight-900/90 backdrop-blur-sm border border-midnight-700 px-3 py-1 rounded text-[10px] font-mono text-gold-400 shadow-md">
                    {current.isPhoto ? "AUTHENTIC FLASH POWER WALL • 51.2V DC" : "SYSTEM TOPOLOGY • ILLUSTRATIVE MAP"}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
