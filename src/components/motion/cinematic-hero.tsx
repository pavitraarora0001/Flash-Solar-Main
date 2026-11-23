"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sliders, ChevronDown, CheckCircle2, Zap, Shield, Battery, SunMedium } from "lucide-react";
import { BenchmarkPanel } from "../marketing/benchmark-panel";

export function CinematicHero() {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax and slow subtle zoom on background
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.8], [0.65, 0.2]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const benefits = [
    { label: "Double Inversion Waste Eliminated", icon: Zap },
    { label: "Native 48V Low-Voltage Safety", icon: Shield },
    { label: "LiFePO4 Modular Architecture", icon: Battery },
    { label: "High Continuous Duty Cycle", icon: SunMedium },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] lg:min-h-screen bg-midnight-950 text-ivory-100 flex flex-col justify-center pt-24 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 border-b border-midnight-700/80 overflow-hidden"
    >
      {/* Background Cinematic Energy Facility with slow subtle zoom */}
      <motion.div
        style={{ scale: bgScale, opacity: bgOpacity }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <Image
          src="/images/hero-solar.jpg"
          alt="Industrial Battery Energy Storage Facility at Golden Hour"
          fill
          priority
          className="object-cover object-center mix-blend-luminosity brightness-90 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-midnight-950 via-midnight-950/85 to-midnight-950/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-transparent to-midnight-950/80" />
      </motion.div>

      {/* SVG Animated Technical Energy-Flow Linework */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-[1] opacity-35"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M -100,200 L 400,200 L 700,500 L 1600,500"
          stroke="#F2B33F"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="6,8"
          initial={{ pathOffset: 0 }}
          animate={{ pathOffset: 1 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M 200,-50 L 200,350 L 550,700"
          stroke="#10B981"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="4,6"
          initial={{ pathOffset: 0 }}
          animate={{ pathOffset: -1 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      <div className="max-w-7xl mx-auto w-full relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Staggered Editorial Headline & Motion CTAs */}
          <motion.div
            style={{ y: textY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-7"
          >
            {/* Small Outlined Gold Eyebrow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-500/50 bg-midnight-900/80 text-gold-400 text-xs font-semibold uppercase tracking-wider shadow-sm backdrop-blur-sm"
            >
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
              <span>Next-Generation Energy Resilience</span>
            </motion.div>

            {/* Large Editorial Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-ivory-100 leading-[1.12]"
            >
              Engineered for{" "}
              <span className="text-gold-500 relative inline-block">
                Zero-Loss
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
                  className="absolute left-0 bottom-1 w-full h-[3px] bg-gradient-to-r from-gold-500 to-gold-400 origin-left"
                />
              </span>{" "}
              Solar Storage.
            </motion.h1>

            {/* Supporting Engineering Copy */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7 }}
              className="text-base sm:text-lg text-ivory-400 max-w-2xl leading-relaxed"
            >
              Advanced energy storage architecture and direct-current microgrid systems engineered for dependable, efficient power. Eliminating unnecessary AC/DC conversion cycles preserves up to 22% more usable energy from every kilowatt-hour.
            </motion.p>

            {/* Action Buttons with Magnetic-Style Hover */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="pt-2 flex flex-col sm:flex-row gap-4"
            >
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="#energy-challenge"
                className="inline-flex justify-center items-center gap-2.5 px-7 py-4 rounded-md bg-gold-500 hover:bg-gold-600 text-midnight-950 font-semibold text-sm transition-colors shadow-goldGlow focus:outline-none focus:ring-2 focus:ring-gold-400"
              >
                <span>View Core Systems</span>
                <ArrowRight className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="#dc-journey"
                className="inline-flex justify-center items-center gap-2.5 px-7 py-4 rounded-md bg-midnight-900/90 hover:bg-midnight-800 text-ivory-200 hover:text-white font-medium text-sm transition-colors border border-midnight-700 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <Sliders className="w-4 h-4 text-gold-400" />
                <span>Technical Framework</span>
              </motion.a>
            </motion.div>

            {/* Compact Benefits Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.8 }}
              className="pt-6 border-t border-midnight-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-ivory-300"
            >
              {benefits.map((b) => (
                <div key={b.label} className="flex items-center gap-2.5 bg-midnight-900/60 backdrop-blur-sm p-2.5 rounded-md border border-midnight-800">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  <span className="font-medium text-ivory-200">{b.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column: Floating Benchmark Panel with Staggered Entrance */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <BenchmarkPanel />
          </motion.div>
        </div>
      </div>

      {/* Subtle Continuous Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-ivory-400 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
      >
        <a href="#energy-challenge" className="flex flex-col items-center gap-1 focus:outline-none">
          <span className="text-[10px] uppercase font-mono tracking-widest text-gold-400">EXPLORE ARCHITECTURE</span>
          <ChevronDown className="w-4 h-4 text-gold-400" />
        </a>
      </motion.div>
    </section>
  );
}
