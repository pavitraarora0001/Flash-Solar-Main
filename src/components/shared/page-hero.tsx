"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sliders, ShieldCheck } from "lucide-react";
import { Breadcrumbs, BreadcrumbItem } from "./breadcrumbs";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
  primaryCta?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  };
  secondaryCta?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  };
  badgeText?: string;
  stats?: Array<{
    label: string;
    value: string;
    subtext?: string;
  }>;
}

export function PageHero({
  eyebrow = "Flash Solar Engineering",
  title,
  subtitle,
  breadcrumbs,
  primaryCta = { label: "Project Consultation", href: "/enquiry" },
  secondaryCta = { label: "View Specifications", href: "/specifications" },
  badgeText,
  stats,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-midnight-950 border-b border-midnight-700/60 pt-8 pb-16 sm:pt-12 sm:pb-20">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-gold-500/10 via-midnight-900/0 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-12 -left-20 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-midnight-800/40 rounded-full blur-3xl pointer-events-none" />

      {/* Technical grid backdrop subtle line */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb row */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6">
            {/* Eyebrow & Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wider uppercase bg-midnight-800/90 border border-gold-500/30 text-gold-400">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                <span>{eyebrow}</span>
              </span>
              {badgeText && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-midnight-800 border border-midnight-700 text-ivory-300">
                  {badgeText}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-ivory-100 tracking-tight leading-[1.12]">
              {title}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-base sm:text-lg text-ivory-300 max-w-3xl leading-relaxed">
                {subtitle}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {primaryCta && (
                <Link
                  href={primaryCta.href}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-midnight-950 font-semibold text-sm transition-all duration-200 shadow-goldGlow hover:shadow-none focus:outline-none focus:ring-2 focus:ring-gold-400"
                >
                  <span>{primaryCta.label}</span>
                  {primaryCta.icon || <ArrowRight className="w-4 h-4" />}
                </Link>
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-midnight-900/90 hover:bg-midnight-800 text-ivory-200 hover:text-white border border-gold-500/30 hover:border-gold-400 font-medium text-sm transition-all duration-200"
                >
                  {secondaryCta.icon || <Sliders className="w-4 h-4 text-gold-400" />}
                  <span>{secondaryCta.label}</span>
                </Link>
              )}
            </div>
          </div>

          {/* Optional Stats Column */}
          {stats && stats.length > 0 && (
            <div className="lg:col-span-4 grid grid-cols-2 gap-3.5">
              {stats.map((s, idx) => (
                <div
                  key={idx}
                  className="bg-midnight-900/80 border border-midnight-700/80 rounded-lg p-4 space-y-1 backdrop-blur-sm"
                >
                  <div className="text-xl sm:text-2xl font-serif font-bold text-gold-400">
                    {s.value}
                  </div>
                  <div className="text-xs font-semibold text-ivory-200 uppercase tracking-wider font-sans">
                    {s.label}
                  </div>
                  {s.subtext && (
                    <div className="text-[11px] text-ivory-400 leading-tight">
                      {s.subtext}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
