import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBanner } from "@/components/shared/cta-banner";
import { db } from "@/lib/db/store";
import {
  Wrench,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  BatteryCharging,
  Sliders,
  Activity,
  FileCheck2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Turnkey Clean Energy Solutions & Engineering Services",
  description:
    "Comprehensive turnkey engineering services from Flash Solar: residential DC microgrids, commercial BESS retrofitting, custom battery bank assembly, and thermodynamic load audits.",
};

export default function SolutionsPage() {
  const services = db.getServices().filter((s) => s.status === "PUBLISHED");

  const engineeringProcess = [
    {
      step: "01",
      title: "Load Profiling & Sizing Audit",
      description: "Hourly energy logging, peak surge calculation, and DC/AC branch segregation to optimize total storage requirements.",
    },
    {
      step: "02",
      title: "Single-Line Diagram (SLD) Design",
      description: "Electrical schematic drafting including breaker ratings, busbar dimensions, overcurrent protection, and BMS communication topology.",
    },
    {
      step: "03",
      title: "Factory Acceptance Testing (FAT)",
      description: "Pre-dispatch capacity cycling at our engineering facility, testing full discharge rate, cell balancing, and thermographic validation.",
    },
    {
      step: "04",
      title: "Turnkey Commissioning & Telemetry",
      description: "Onsite mechanical installation, CANBus synchronization, inverter pairing, and remote telemetry activation.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-midnight-950 font-sans selection:bg-gold-500 selection:text-midnight-950">
      <Header />

      <main className="flex-1">
        <PageHero
          eyebrow="Turnkey Engineering & Deployment"
          title="Engineered Clean Energy Solutions"
          subtitle="Beyond modular hardware, Flash Solar delivers turnkey electrical engineering, custom battery assembly, microgrid modernization, and preventative thermal diagnostics."
          breadcrumbs={[{ label: "Solutions" }]}
          primaryCta={{ label: "Request Solution Consultation", href: "/enquiry" }}
          secondaryCta={{ label: "View Hardware Matrix", href: "/specifications" }}
          badgeText="Full EPC & Engineering Support"
          stats={[
            { label: "Deployment Track", value: "Turnkey EPC", subtext: "Design to commissioning" },
            { label: "Engineering Heritage", value: "Rajasthan HQ", subtext: "Serving global microgrids" },
            { label: "Testing Standard", value: "100% FAT", subtext: "Factory acceptance tested" },
            { label: "Post-Commissioning", value: "10-Year SLA", subtext: "BMS diagnostics support" },
          ]}
        />

        {/* Services & Offerings Grid */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono text-gold-400 uppercase tracking-widest block">
              Core Engineering Capabilities
            </span>
            <h2 className="text-3xl font-serif font-bold text-ivory-100 tracking-tight">
              Turnkey Energy Services
            </h2>
            <p className="text-sm text-ivory-400">
              Tailored electrical infrastructure and energy storage solutions built to international IEC and IEEE standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="bg-midnight-900 border border-midnight-700/80 hover:border-gold-500/40 rounded-2xl p-8 space-y-5 transition-all duration-300 group shadow-card hover:shadow-elevated flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-midnight-800 border border-midnight-700 flex items-center justify-center text-gold-400 group-hover:scale-105 transition-transform">
                    <Wrench className="w-6 h-6" />
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-ivory-100 group-hover:text-gold-400 transition-colors">
                    {svc.title}
                  </h3>

                  <p className="text-sm text-ivory-300 leading-relaxed">
                    {svc.description || svc.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-midnight-800 flex items-center justify-between">
                  <span className="text-xs font-mono text-ivory-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
                    <span>Engineered SLA Support</span>
                  </span>

                  <Link
                    href={`/enquiry?service=${svc.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    <span>Request Proposal</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4-Step Engineering Process */}
        <section className="py-16 sm:py-24 bg-midnight-900/40 border-t border-b border-midnight-700/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-mono text-gold-400 uppercase tracking-widest block">
                Methodical Execution
              </span>
              <h2 className="text-3xl font-serif font-bold text-ivory-100 tracking-tight">
                Engineering & Deployment Methodology
              </h2>
              <p className="text-sm text-ivory-400">
                Every Flash Solar installation undergoes rigorous electrical modeling and factory acceptance testing prior to site deployment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {engineeringProcess.map((proc) => (
                <div
                  key={proc.step}
                  className="bg-midnight-900 border border-midnight-700/80 rounded-xl p-6 space-y-3 relative overflow-hidden"
                >
                  <span className="text-3xl font-serif font-bold text-gold-400/80 block">
                    {proc.step}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-ivory-100">
                    {proc.title}
                  </h3>
                  <p className="text-xs text-ivory-400 leading-relaxed">
                    {proc.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Global CTA Banner */}
        <CtaBanner
          eyebrow="Turnkey Project Engagement"
          title="Start Your Microgrid Engineering Assessment"
          description="Speak with our principal electrical architects to evaluate site conditions, calculate system capacity, and receive a formal technical proposal."
          primaryCtaText="Request Sizing Assessment"
          primaryCtaHref="/enquiry"
          secondaryCtaText="Explore Core Hardware"
          secondaryCtaHref="/products"
        />
      </main>

      <Footer />
    </div>
  );
}
