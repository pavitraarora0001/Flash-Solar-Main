"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Building2, Home, Tractor, Radio, ArrowRight, Layers } from "lucide-react";

export function ApplicationsMotionSection() {
  const sectors = [
    {
      title: "Residential Microgrids",
      subtitle: "Pure DC Native & Hybrid Rooftop Solar",
      description:
        "Engineered for households seeking total autonomy from volatile electricity tariffs and frequent blackouts. Direct DC bus powers brushless ceiling fans, LED lighting, and cooling directly from Flash Power Wall storage.",
      image: "/images/dc-house.svg",
      icon: Home,
      tag: "Residential",
    },
    {
      title: "Commercial & Industrial BESS",
      subtitle: "Containerized Battery Energy Storage",
      description:
        "High-capacity modular storage designed for factories, cold storage warehouses, and enterprise campuses requiring high-demand peak shaving, diesel generator displacement, and three-phase uninterrupted power.",
      image: "/images/commercial-facility.svg",
      icon: Building2,
      tag: "Commercial / BESS",
    },
    {
      title: "Agricultural Solar Irrigation",
      subtitle: "Direct-Drive DC Water Pumping",
      description:
        "Eliminates generator fuel costs and utility hookup delays for agricultural farms. Solar arrays drive high-efficiency DC submersible well pumps directly without fragile inverters.",
      image: "/images/agricultural-solar.svg",
      icon: Tractor,
      tag: "Agricultural & Rural",
    },
    {
      title: "Telecom & Critical Infrastructure",
      subtitle: "48V DC Native Cellular Base Stations",
      description:
        "Telecom towers operate on 48V DC natively. Flash Solar systems couple directly to radio transmission hardware, providing weeks of silent battery autonomy in remote off-grid locations.",
      image: "/images/ac-house.svg",
      icon: Radio,
      tag: "Critical Telecom",
    },
  ];

  return (
    <section id="applications" className="bg-midnight-950 text-ivory-100 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-midnight-700/80">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-midnight-800 border border-gold-500/40 text-gold-400 text-xs font-semibold uppercase tracking-widest">
            <Layers className="w-3.5 h-3.5 text-gold-400" />
            <span>Deployment Sectors</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-ivory-100 tracking-tight leading-tight">
            Tailored Industry Topologies.
          </h2>
          <p className="text-base sm:text-lg text-ivory-400 leading-relaxed">
            Flash Solar architecture adapts across diverse operational environments, delivering reliable power independence from domestic residences to remote industrial infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sectors.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <motion.div
                key={sec.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="bg-midnight-900 border border-midnight-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-gold-500/50 transition-all duration-300"
              >
                {/* Visual Header */}
                <div className="relative h-60 sm:h-64 w-full bg-midnight-950 overflow-hidden border-b border-midnight-800">
                  <Image
                    src={sec.image}
                    alt={sec.title}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-midnight-900/90 backdrop-blur-md border border-midnight-700 px-3 py-1 rounded-full text-[10px] font-mono text-gold-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                    <span>{sec.tag}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-lg bg-midnight-800 text-gold-400 flex items-center justify-center border border-midnight-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-ivory-100">
                      {sec.title}
                    </h3>
                    <span className="text-xs font-mono text-gold-400 block">
                      {sec.subtitle}
                    </span>
                    <p className="text-xs sm:text-sm text-ivory-400 leading-relaxed pt-1">
                      {sec.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-midnight-800">
                    <a
                      href="#enquiry"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors"
                    >
                      <span>Inquire for {sec.title} Sizing</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
