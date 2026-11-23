"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Cpu, ArrowUpRight, Gauge, Activity, BatteryCharging } from "lucide-react";

export function EngineeringPerformance() {
  const kpis = [
    {
      metric: "0%",
      label: "Inverter Conversion Loss",
      detail: "Pure direct-current microgrid bypasses central inverter thermal dissipation entirely.",
      badge: "Pure DC Native",
      color: "text-emerald-400",
      icon: Gauge,
    },
    {
      metric: ">95%",
      label: "Round-Trip Cell Efficiency",
      detail: "Coulombic efficiency of high-grade LiFePO4 cells during standard charging cycles.",
      badge: "Coulombic Yield",
      color: "text-gold-400",
      icon: BatteryCharging,
    },
    {
      metric: "<60V",
      label: "Touch-Safe Operating Bus",
      detail: "Sub-60V DC bus eliminates high-voltage AC electric shock and continuous arcing hazard.",
      badge: "Low-Voltage Safety",
      color: "text-blue-400",
      icon: ShieldCheck,
    },
    {
      metric: "6,000+",
      label: "Rated Charge Cycles",
      detail: "LiFePO4 cell longevity to 80% capacity retention under 25°C controlled operation.",
      badge: "Chemical Longevity",
      color: "text-purple-400",
      icon: Activity,
    },
  ];

  return (
    <section className="bg-midnight-900 text-ivory-100 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-midnight-700/80">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-midnight-800 border border-gold-500/40 text-gold-400 text-xs font-semibold uppercase tracking-widest">
            <Activity className="w-3.5 h-3.5 text-gold-400" />
            <span>Verified Engineering Benchmarks</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-ivory-100 tracking-tight leading-tight">
            Measurable Physical Performance.
          </h2>
          <p className="text-base sm:text-lg text-ivory-400 leading-relaxed">
            Flash Solar designs around real physical parameters, not fabricated commercial claims. Every figure below is substantiated by electrical engineering principles and battery chemistry standards.
          </p>
        </div>

        {/* 4 Performance KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="bg-midnight-950 border border-midnight-700/90 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-4 shadow-xl hover:border-gold-500/50 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-midnight-850 text-ivory-400 border border-midnight-750">
                      {kpi.badge}
                    </span>
                    <Icon className="w-5 h-5 text-gold-500/80" />
                  </div>

                  <span className={`text-4xl sm:text-5xl font-mono font-bold tracking-tight block ${kpi.color}`}>
                    {kpi.metric}
                  </span>

                  <h3 className="text-base font-heading font-bold text-ivory-100">
                    {kpi.label}
                  </h3>
                </div>

                <p className="text-xs text-ivory-400 leading-relaxed pt-2 border-t border-midnight-850">
                  {kpi.detail}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Qualification Footnote */}
        <div className="p-4 rounded-xl bg-midnight-950/80 border border-midnight-800 text-xs text-ivory-400 flex items-start gap-2.5 max-w-4xl">
          <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            <strong>Engineering Qualification:</strong> Round-trip efficiency and cycle longevity are based on cell manufacturer testing standards at nominal temperatures. Actual site performance varies with geographic solar insolation, ambient heat derating, and conductor wire gauge sizing.
          </span>
        </div>
      </div>
    </section>
  );
}
