import * as React from "react";
import { BatteryCharging, Cpu, ArrowUpRight, Info } from "lucide-react";

export function BenchmarkPanel() {
  return (
    <div className="glass-panel-elevated rounded-xl p-7 text-ivory-100 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-midnight-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-midnight-850 border border-midnight-700 flex items-center justify-center text-gold-500 shadow-inner">
            <BatteryCharging className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-heading font-bold text-ivory-100 uppercase tracking-wider">
              System Benchmark
            </h3>
            <span className="text-xs text-ivory-400">Direct DC vs. Conventional AC</span>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-400 text-xs font-mono font-semibold border border-emerald-800">
            <span>+15% - 20%</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
          <span className="block text-[10px] text-ivory-400 mt-0.5">Est. System Yield</span>
        </div>
      </div>

      {/* Benchmark Metric Grid */}
      <div className="space-y-3.5 text-xs sm:text-sm">
        <div className="flex justify-between items-center py-1.5 border-b border-midnight-800/80">
          <span className="text-ivory-400">Inverter Inversion Loss:</span>
          <span className="font-mono text-emerald-400 font-semibold bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900/60">
            0% (Direct DC Native)
          </span>
        </div>

        <div className="flex justify-between items-center py-1.5 border-b border-midnight-800/80">
          <span className="text-ivory-400">Lithium Cell Architecture:</span>
          <span className="font-mono text-ivory-100 font-semibold">
            LiFePO4 Chemistry
          </span>
        </div>

        <div className="flex justify-between items-center py-1.5 border-b border-midnight-800/80">
          <span className="text-ivory-400">Standard Operating Bus:</span>
          <span className="font-mono text-gold-400 font-semibold">
            48V Low-Voltage Safe
          </span>
        </div>

        <div className="flex justify-between items-center py-1.5 border-b border-midnight-800/80">
          <span className="text-ivory-400">Continuous Load Delivery:</span>
          <span className="font-mono text-ivory-100 font-semibold">
            High Duty Cycle (1C / 0.5C)
          </span>
        </div>

        <div className="flex justify-between items-center py-1.5">
          <span className="text-ivory-400">Operating Temperature Derate:</span>
          <span className="font-mono text-ivory-200 font-semibold">
            -10°C to +55°C Nominal
          </span>
        </div>
      </div>

      {/* Data Integrity Footnote */}
      <div className="pt-2 text-[11px] text-ivory-400 border-t border-midnight-700/80 flex items-start gap-2 bg-midnight-950/60 p-3 rounded-lg border">
        <Info className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong>Data integrity note:</strong> Steady-state electrical model estimates. Real-world system yield depends on ambient thermal dissipation, conductor gauge, and continuous peak concurrent duty cycle.
        </span>
      </div>
    </div>
  );
}

