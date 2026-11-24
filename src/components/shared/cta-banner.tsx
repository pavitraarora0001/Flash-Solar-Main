"use client";

import Link from "next/link";
import { ArrowRight, PhoneCall, ShieldCheck, Sliders, Zap } from "lucide-react";

interface CtaBannerProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export function CtaBanner({
  eyebrow = "Next-Generation Clean Energy Architecture",
  title = "Ready to Engineer Your Clean Power System?",
  description = "Speak directly with our electrical engineering team to calculate load requirements, optimize DC bus voltage, or schedule an onsite sizing consultation.",
  primaryCtaText = "Request Technical Consultation",
  primaryCtaHref = "/enquiry",
  secondaryCtaText = "Explore Spec Matrix",
  secondaryCtaHref = "/specifications",
}: CtaBannerProps) {
  return (
    <section className="relative overflow-hidden bg-midnight-950 py-16 sm:py-20 border-t border-midnight-700/80">
      {/* Ambient background highlight */}
      <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 via-midnight-900/40 to-transparent pointer-events-none" />
      <div className="absolute -top-24 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-midnight-900 to-midnight-850 border border-gold-500/30 rounded-2xl p-8 sm:p-12 shadow-elevated relative overflow-hidden">
          {/* Subtle decorative grid */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-gold-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide uppercase bg-gold-500/10 border border-gold-500/20 text-gold-400">
              <Zap className="w-3.5 h-3.5" />
              <span>{eyebrow}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-ivory-100 tracking-tight leading-tight">
              {title}
            </h2>

            <p className="text-sm sm:text-base text-ivory-300 leading-relaxed max-w-2xl">
              {description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href={primaryCtaHref}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-midnight-950 font-semibold text-sm transition-all duration-200 shadow-goldGlow hover:shadow-none"
              >
                <span>{primaryCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={secondaryCtaHref}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-midnight-950/80 hover:bg-midnight-800 text-ivory-200 hover:text-white border border-gold-500/30 font-medium text-sm transition-all duration-200"
              >
                <Sliders className="w-4 h-4 text-gold-400" />
                <span>{secondaryCtaText}</span>
              </Link>

              <div className="hidden sm:flex items-center gap-2 text-xs text-ivory-400 pl-2">
                <PhoneCall className="w-4 h-4 text-gold-400" />
                <span>Hotline: <strong className="text-ivory-200 font-mono">+91 8824536524</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
