import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBanner } from "@/components/shared/cta-banner";
import { ShieldCheck, Award, CheckCircle2, Clock, BatteryCharging, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Warranty & Performance Guarantee Framework",
  description:
    "Official Flash Solar 10-year manufacturer warranty, 6,000-cycle endurance guarantee, and battery cell retention commitments.",
};

export default function WarrantyPage() {
  const commitments = [
    {
      title: "10-Year Comprehensive Hardware Warranty",
      description: "Flash Solar warrants the Flash Power Wall enclosure, internal solid-state busbars, power terminals, and structural components against manufacturing defects for a full 120 calendar months from commissioning.",
    },
    {
      title: "6,000 Cycle / 80% Capacity Retention Guarantee",
      description: "Our Tier-1 Lithium Iron Phosphate (LiFePO4) prismatic cells are guaranteed to retain at least 80% of nominal usable energy capacity for 6,000 equivalent full cycles or 10 years, whichever occurs first, when operated within specified thermal parameters.",
    },
    {
      title: "Active BMS & Firmware Support",
      description: "The Flash Solar Battery Management System (BMS) includes 10 years of ongoing firmware telemetry security updates and remote diagnostic assistance.",
    },
    {
      title: "Thermal Tolerance Verification",
      description: "Coverage remains fully valid across extreme tropical ambient temperatures ranging from -20°C up to +55°C, supported by passive aluminium convection cooling.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-midnight-950 font-sans selection:bg-gold-500 selection:text-midnight-950">
      <Header />

      <main className="flex-1">
        <PageHero
          eyebrow="Flash Solar Quality Assurance"
          title="Warranty & Performance Guarantee"
          subtitle="Engineered for long-duration cyclic endurance. Every Flash Solar battery system is protected by our transparent 10-year manufacturer warranty and 6,000-cycle retention guarantee."
          breadcrumbs={[{ label: "Warranty Framework" }]}
          primaryCta={{ label: "Register a Product", href: "/contact" }}
          secondaryCta={{ label: "View Technical Datasheets", href: "/resources" }}
          badgeText="10-Year Manufacturer Commitment"
          stats={[
            { label: "Hardware Warranty", value: "10 Years", subtext: "Full manufacturer coverage" },
            { label: "Cycle Guarantee", value: "6,000 Cycles", subtext: "To 80% capacity retention" },
            { label: "Cell Chemistry", value: "LiFePO4", subtext: "Non-combustible stability" },
            { label: "Operating Window", value: "-20°C / +55°C", subtext: "Tropical climate validated" },
          ]}
        />

        {/* Commitments Section */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono text-gold-400 uppercase tracking-widest block">
              Contractual Assurance
            </span>
            <h2 className="text-3xl font-serif font-bold text-ivory-100 tracking-tight">
              Four Core Warranty Commitments
            </h2>
            <p className="text-sm text-ivory-400">
              Clear, uncompromised terms designed to provide asset security for residential owners, telecom operators, and commercial facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {commitments.map((c, idx) => (
              <div
                key={idx}
                className="bg-midnight-900 border border-midnight-700/80 rounded-2xl p-8 space-y-4 shadow-card"
              >
                <div className="w-10 h-10 rounded-lg bg-midnight-800 border border-gold-500/30 flex items-center justify-center text-gold-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-serif font-bold text-ivory-100">
                  {c.title}
                </h3>
                <p className="text-sm text-ivory-300 leading-relaxed">
                  {c.description}
                </p>
              </div>
            ))}
          </div>

          {/* Warranty Claim Procedure */}
          <div className="bg-gradient-to-br from-midnight-900 to-midnight-850 border border-gold-500/30 rounded-2xl p-8 sm:p-12 space-y-6 shadow-elevated">
            <div className="space-y-2">
              <span className="text-xs font-mono text-gold-400 uppercase tracking-widest block">
                Claims Protocol
              </span>
              <h3 className="text-2xl font-serif font-bold text-ivory-100">
                How to Initiate a Technical Warranty Review
              </h3>
              <p className="text-xs sm:text-sm text-ivory-300 leading-relaxed max-w-3xl">
                In the rare event that a Flash Solar battery bank displays cell voltage deviation exceeding 50mV or capacity degradation outside guaranteed bounds, follow our rapid 3-step claim protocol:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="p-4 rounded-xl bg-midnight-950/80 border border-midnight-800 space-y-2">
                <span className="text-gold-400 font-mono font-bold text-sm">Step 01</span>
                <strong className="text-ivory-200 block text-xs">Export BMS Diagnostic Log</strong>
                <p className="text-[11px] text-ivory-400 leading-normal">
                  Connect via RS485/CANBus or the Flash Solar mobile telemetry app to export cell history.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-midnight-950/80 border border-midnight-800 space-y-2">
                <span className="text-gold-400 font-mono font-bold text-sm">Step 02</span>
                <strong className="text-ivory-200 block text-xs">Email Engineering Support</strong>
                <p className="text-[11px] text-ivory-400 leading-normal">
                  Send logs and system serial number to <span className="font-mono text-gold-400">info@flashsolar.org</span>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-midnight-950/80 border border-midnight-800 space-y-2">
                <span className="text-gold-400 font-mono font-bold text-sm">Step 03</span>
                <strong className="text-ivory-200 block text-xs">Dispatch or Component Swap</strong>
                <p className="text-[11px] text-ivory-400 leading-normal">
                  Verified claims receive direct replacement BMS modules or battery cell modules within 5 business days.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Global CTA Banner */}
        <CtaBanner
          eyebrow="Certified Performance"
          title="Ready to Deploy Flash Solar Energy Hardware?"
          description="Speak with our team to obtain certified datasheets, warranty terms, and load calculations."
          primaryCtaText="Contact Engineering Desk"
          primaryCtaHref="/contact"
          secondaryCtaText="Inspect Specifications"
          secondaryCtaHref="/specifications"
        />
      </main>

      <Footer />
    </div>
  );
}
