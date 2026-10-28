import * as React from "react";
import { Building2, Home, Tractor, FileText, Download, BookOpen, ArrowRight, Shield } from "lucide-react";

export function ApplicationsSection() {
  const sectors = [
    {
      title: "Residential Microgrids",
      description: "Complete off-grid and grid-resilient domestic power architectures running DC brushless fans, lighting, and Flash Power Wall storage without grid dependency.",
      icon: Home,
      tag: "Residential",
    },
    {
      title: "Commercial & Industrial Backup",
      description: "Three-phase high-capacity battery bank integration for telecom stations, cold storage, server infrastructure, and commercial facilities requiring zero millisecond downtime.",
      icon: Building2,
      tag: "Commercial / Industrial",
    },
    {
      title: "Agricultural & Remote Pumping",
      description: "Direct-drive solar DC water pumping and remote agricultural microgrids operating reliably in harsh rural environments without inverter failure points.",
      icon: Tractor,
      tag: "Agricultural & Rural",
    },
  ];

  const resources = [
    {
      title: "Flash Power Wall Engineering Datasheet",
      type: "Technical PDF • v2.4",
      summary: "Detailed electrical discharge curves, thermal operating limits, BMS communication protocols, and physical dimensions.",
    },
    {
      title: "Direct-Current House Architecture Guide",
      type: "Whitepaper • 18 Pages",
      summary: "System schematic for sub-60V DC residential distribution, wiring gauge tables, and BLDC motor load calculations.",
    },
    {
      title: "Battery Sizing & Derating Methodology",
      type: "Calculation Standard • PDF",
      summary: "Mathematical guidelines for sizing lithium storage capacity based on seasonal peak sun hours and local temperature swings.",
    },
  ];

  return (
    <section id="resources" className="bg-midnight-950 text-ivory-100 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-midnight-700/80">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Applications */}
        <div className="space-y-12">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold-400">
              Deployment Topologies
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-ivory-100 tracking-tight">
              Applications & Industry Deployments
            </h2>
            <p className="text-sm sm:text-base text-ivory-400 leading-relaxed">
              Engineered for extreme reliability across residential, commercial, and remote off-grid environments where grid instability or high tariff structures make self-sufficient power essential.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sectors.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="bg-midnight-900 border border-midnight-700 p-8 rounded-2xl flex flex-col justify-between space-y-6 hover:border-gold-500/40 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-midnight-800 text-gold-400 flex items-center justify-center border border-midnight-700">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-mono text-ivory-400 bg-midnight-850 px-2.5 py-1 rounded border border-midnight-750">
                        {s.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-heading font-bold text-ivory-100">
                      {s.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-ivory-400 leading-relaxed">
                      {s.description}
                    </p>
                  </div>

                  <a
                    href="#enquiry"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    <span>Request Sector Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resources & Documentation */}
        <div className="pt-12 border-t border-midnight-800 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-gold-400">
                Documentation & Standards
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-ivory-100">
                Engineering Resources & Standards
              </h3>
            </div>
            <a
              href="#enquiry"
              className="text-xs font-semibold text-gold-400 hover:text-gold-300 flex items-center gap-1.5"
            >
              <span>Request Full Documentation Suite</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((res) => (
              <div
                key={res.title}
                className="bg-midnight-900/60 border border-midnight-700/80 p-6 rounded-xl space-y-4 hover:bg-midnight-900 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gold-400 font-mono flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    <span>{res.type}</span>
                  </span>
                  <a href="#enquiry" className="text-ivory-400 hover:text-white p-1" title="Download Document">
                    <Download className="w-4 h-4" />
                  </a>
                </div>

                <h4 className="text-base font-heading font-bold text-ivory-100 leading-snug">
                  {res.title}
                </h4>

                <p className="text-xs text-ivory-400 leading-relaxed">
                  {res.summary}
                </p>

                <div className="pt-2">
                  <a
                    href="#enquiry"
                    className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:underline font-medium"
                  >
                    <span>Request Document Copy</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

