"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { AlertTriangle, Zap, TrendingDown, ArrowRight } from "lucide-react";

export function EnergyChallengeSection() {
  const sectionRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Scroll-linked camera expansion and framing
  const imageScale = useTransform(scrollYProgress, [0.1, 0.6], [0.92, 1.05]);
  const imageOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0.4, 0.85]);
  const textOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.2, 0.5], [40, 0]);

  return (
    <section
      id="energy-challenge"
      ref={sectionRef}
      className="relative min-h-screen bg-midnight-950 text-ivory-100 flex items-center py-28 px-4 sm:px-6 lg:px-8 border-b border-midnight-700/80 overflow-hidden"
    >
      {/* Background Solar Field Expansion */}
      <motion.div
        style={{ scale: imageScale, opacity: imageOpacity }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <Image
          src="/images/hero-solar.jpg"
          alt="Expansive Solar Energy Field at Dusk"
          fill
          className="object-cover object-bottom filter grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-midnight-950/80 to-midnight-950" />
      </motion.div>

      {/* Camera-like Viewfinder Framing Overlays */}
      <div className="absolute inset-8 sm:inset-16 pointer-events-none z-[2] border border-midnight-700/40 rounded-3xl hidden md:block">
        <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-2 border-l-2 border-gold-500/80" />
        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-2 border-r-2 border-gold-500/80" />
        <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-2 border-l-2 border-gold-500/80" />
        <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-2 border-r-2 border-gold-500/80" />

        <div className="absolute top-4 left-6 font-mono text-[10px] text-ivory-400 tracking-widest uppercase">
          SYSTEM SCAN • THERMAL CONVERSION LOSSES
        </div>
        <div className="absolute bottom-4 right-6 font-mono text-[10px] text-gold-400 tracking-widest uppercase">
          CONVENTIONAL AC INVERSION INEFFICIENCY
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="max-w-3xl space-y-7"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/80 border border-red-800/80 text-red-400 text-xs font-semibold uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>The Centralized Solar Challenge</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-ivory-100 tracking-tight leading-tight">
            Up to <span className="text-red-400">22% of Solar Energy</span> is Wasted in Inversion Heat.
          </h2>

          <p className="text-base sm:text-lg text-ivory-300 leading-relaxed">
            Conventional solar systems are tethered to 19th-century alternating current grids. Direct-current power from solar panels is inverted to 230V AC, sent through home wiring, and then inverted back into DC by power bricks inside computers, LED lights, and brushless motors.
          </p>

          {/* Illuminating Technical Data Points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4">
            <div className="bg-midnight-900/90 border border-midnight-700/80 p-5 rounded-xl backdrop-blur-md">
              <span className="text-xs font-mono text-red-400 uppercase block mb-1">Inverter Penalty</span>
              <span className="text-2xl sm:text-3xl font-mono font-bold text-ivory-100 block">8% - 12%</span>
              <p className="text-xs text-ivory-400 mt-1">Thermal dissipation during DC to AC conversion.</p>
            </div>

            <div className="bg-midnight-900/90 border border-midnight-700/80 p-5 rounded-xl backdrop-blur-md">
              <span className="text-xs font-mono text-red-400 uppercase block mb-1">Rectifier Penalty</span>
              <span className="text-2xl sm:text-3xl font-mono font-bold text-ivory-100 block">7% - 10%</span>
              <p className="text-xs text-ivory-400 mt-1">Secondary losses converting AC back to DC for appliances.</p>
            </div>

            <div className="bg-midnight-900/90 border border-gold-500/50 p-5 rounded-xl backdrop-blur-md shadow-goldGlow">
              <span className="text-xs font-mono text-gold-400 uppercase block mb-1">Flash Solar Solution</span>
              <span className="text-2xl sm:text-3xl font-mono font-bold text-gold-400 block">0% Loss</span>
              <p className="text-xs text-ivory-300 mt-1">Pure direct-current native bus distribution.</p>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="#dc-journey"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors"
            >
              <span>Explore the Direct-Current Architecture Journey</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
