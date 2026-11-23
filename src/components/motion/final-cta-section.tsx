"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Mail } from "lucide-react";

export function FinalCtaSection() {
  return (
    <section className="relative bg-midnight-950 text-ivory-100 py-32 px-4 sm:px-6 lg:px-8 border-b border-midnight-700/80 overflow-hidden">
      {/* Background Cinematic Visual with Dark Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/hero-solar.jpg"
          alt="Large-scale Industrial Energy Storage Facility"
          fill
          className="object-cover object-center filter grayscale contrast-125 opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-midnight-950/90 to-midnight-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,179,63,0.12),transparent_70%)]" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-midnight-900 border border-gold-500/40 text-gold-400 text-xs font-semibold uppercase tracking-widest shadow-sm"
        >
          <ShieldCheck className="w-4 h-4 text-gold-400" />
          <span>ENGINEERING CONSULTATION &amp; TENDERS</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="text-4xl sm:text-6xl font-heading font-extrabold text-ivory-100 tracking-tight leading-tight"
        >
          Build a More <span className="text-gold-500">Intelligent</span> Energy Future.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-base sm:text-xl text-ivory-400 max-w-2xl mx-auto leading-relaxed"
        >
          Explore the possibilities of high-efficiency energy storage and direct-current power architecture. Speak directly with our electrical engineering team.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <a
            href="#enquiry"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md bg-gold-500 hover:bg-gold-600 text-midnight-950 font-semibold text-base transition-colors shadow-goldGlow focus:outline-none focus:ring-2 focus:ring-gold-400"
          >
            <span>Discuss Your Project</span>
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="mailto:info@flashsolar.org"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md bg-midnight-900 hover:bg-midnight-850 text-ivory-200 hover:text-white font-medium text-base border border-midnight-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <Mail className="w-4 h-4 text-gold-400" />
            <span>info@flashsolar.org</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
