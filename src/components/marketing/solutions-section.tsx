import * as React from "react";
import { BatteryCharging, Zap, Sun, ShieldCheck, ArrowRight, Gauge, Layers, Wrench } from "lucide-react";

export function SolutionsSection() {
  const verifiedOfferings = [
    {
      title: "Flash Power Wall",
      category: "Battery Energy Storage Systems",
      description:
        "High-density lithium iron phosphate (LiFePO4) storage engineered for residential wall-mount and commercial parallel clusters, featuring integrated active BMS monitoring and high depth-of-discharge resilience.",
      specs: ["LiFePO4 Chemistry", "48V Low-Voltage Safe", "High Cycle Longevity", "Modular Scalability"],
      icon: BatteryCharging,
      badge: "Flagship Hardware",
      link: "#power-wall-specs",
    },
    {
      title: "Flash DC House",
      category: "Direct-Current Power Architecture",
      description:
        "A pure DC residential and commercial microgrid standard that distributes power at native 12V, 24V, and 48V direct-current buses. By powering brushless DC fans, LED lighting, and DC cooling directly, inverter losses are eliminated.",
      specs: ["Zero Inversion Conversion Loss", "Direct DC Cooling & Lighting", "Lower Thermal Dissipation", "Minimal Parasitic Drain"],
      icon: Zap,
      badge: "Zero-Loss Standard",
      link: "#dc-engineering",
    },
    {
      title: "Flash AC House",
      category: "Solar Microgrid Integration",
      description:
        "A hybrid alternating-current architecture designed for properties with existing 230V residential wiring. Combines pure sine-wave inverter topologies with Flash Solar battery banks and automatic grid synchronization.",
      specs: ["Standard 230V AC Distribution", "Pure Sine-Wave Output", "Automatic Transfer Switch", "Seamless Grid Fallback"],
      icon: Sun,
      badge: "Hybrid Architecture",
      link: "#specifications",
    },
    {
      title: "System Diagnostics & Engineering",
      category: "Energy Management & Monitoring",
      description:
        "Specialized electrical sizing verification, harmonic distortion analysis, thermal imaging diagnostics, and preventative maintenance for mission-critical solar and battery storage installations.",
      specs: ["Load Profile Analysis", "Thermal Derating Calculation", "Preventative Maintenance", "Conductor Sizing Audits"],
      icon: Gauge,
      badge: "Engineering Service",
      link: "#enquiry",
    },
  ];

  const enquiryCategories = [
    {
      title: "Solar Inverter Topologies",
      summary: "Pure sine wave hybrid and off-grid inverter platforms specified for custom voltage and continuous inductive load requirements.",
      icon: Layers,
      actionText: "Inquire for Inverter Sizing",
    },
    {
      title: "Commercial Battery Banks",
      summary: "High-capacity deep-cycle lithium bank configurations designed for telecom, agricultural, and commercial backup applications.",
      icon: Wrench,
      actionText: "Inquire for Battery Configurations",
    },
  ];

  return (
    <section id="solutions" className="bg-ivory-50 text-slate-900 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100/80 border border-gold-500/30 text-gold-600 text-xs font-semibold uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
            <span>Verified Offerings</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-slate-900 tracking-tight">
            Engineered Power Solutions
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Flash Solar manufactures and configures high-reliability energy storage architectures. Every solution is grounded in verified electrical engineering principles rather than unverified commercial claims.
          </p>
        </div>

        {/* 4 Core Verified Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {verifiedOfferings.map((solution) => {
            const Icon = solution.icon;
            return (
              <div
                key={solution.title}
                className="bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-9 shadow-card hover:shadow-elevated transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-midnight-900 text-gold-400 flex items-center justify-center shadow-md group-hover:bg-midnight-800 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {solution.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-gold-600 uppercase tracking-wider block mb-1">
                      {solution.category}
                    </span>
                    <h3 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">
                      {solution.title}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {solution.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                      Key Technical Parameters
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                      {solution.specs.map((spec) => (
                        <div key={spec} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={solution.link}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-midnight-900 hover:text-gold-600 transition-colors group-hover:translate-x-1 duration-200"
                  >
                    <span>Inspect System Architecture</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Supplementary Enquiry-Led Categories */}
        <div className="bg-midnight-900 text-ivory-100 rounded-2xl p-8 sm:p-10 border border-midnight-700 shadow-xl">
          <div className="max-w-3xl mb-8 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-400">
              Custom Engineering Portfolios
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-ivory-100">
              Enquiry-Led Component Integration
            </h3>
            <p className="text-sm text-ivory-400 leading-relaxed">
              For commercial projects requiring discrete inverter systems or modular deep-cycle battery banks, our engineering desk reviews custom technical requirements prior to component procurement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enquiryCategories.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-midnight-800/70 border border-midnight-700 p-6 rounded-xl flex flex-col justify-between space-y-4 hover:border-gold-500/50 transition-colors"
                >
                  <div className="space-y-2.5">
                    <div className="w-10 h-10 rounded-lg bg-midnight-750 flex items-center justify-center text-gold-400 border border-midnight-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-heading font-bold text-ivory-100">
                      {item.title}
                    </h4>
                    <p className="text-xs text-ivory-400 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                  <a
                    href="#enquiry"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors pt-2"
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

