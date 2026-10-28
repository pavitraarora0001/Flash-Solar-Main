import * as React from "react";
import { Zap, ArrowRight, ShieldCheck, CheckCircle2, XCircle, Gauge } from "lucide-react";

export function DcEngineeringSection() {
  return (
    <section id="dc-engineering" className="bg-midnight-950 text-ivory-100 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-midnight-700/80">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Title */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-midnight-800 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5 text-gold-400" />
            <span>Architecture Deep Dive</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-ivory-100 tracking-tight leading-tight">
            Direct-Current Architecture: Eliminating the Double-Inversion Penalty.
          </h2>

          <p className="text-base sm:text-lg text-ivory-400 leading-relaxed">
            Standard residential solar installations generate Direct Current (DC), convert it to Alternating Current (AC) through an inverter, and then convert it back to Direct Current through appliance power supplies. Flash Solar eliminates this cycle.
          </p>
        </div>

        {/* Comparison Flowchart Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. Conventional AC System (Double Conversion) */}
          <div className="bg-midnight-900 border border-midnight-700/80 rounded-2xl p-7 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-midnight-800 pb-4">
              <div>
                <span className="text-xs font-mono text-red-400 uppercase tracking-wider block">Conventional Approach</span>
                <h3 className="text-xl font-heading font-bold text-ivory-100">Standard AC Solar Architecture</h3>
              </div>
              <span className="px-2.5 py-1 rounded bg-red-950/80 text-red-400 border border-red-800 text-xs font-mono">
                ~18% Thermal Loss
              </span>
            </div>

            <div className="space-y-4 text-xs font-mono text-ivory-300">
              <div className="p-3 bg-midnight-850 rounded border border-midnight-800 flex items-center justify-between">
                <span>1. Solar Panels Generate:</span>
                <span className="text-ivory-100 font-bold">DC Power (Direct Current)</span>
              </div>
              <div className="p-3 bg-red-950/30 rounded border border-red-900/60 flex items-center justify-between text-red-300">
                <span>2. Central Inverter Conversion:</span>
                <span className="font-bold">Loss: -8% to -12% (DC to AC)</span>
              </div>
              <div className="p-3 bg-midnight-850 rounded border border-midnight-800 flex items-center justify-between">
                <span>3. Premise Distribution:</span>
                <span className="text-ivory-100 font-bold">230V AC Wiring</span>
              </div>
              <div className="p-3 bg-red-950/30 rounded border border-red-900/60 flex items-center justify-between text-red-300">
                <span>4. Appliance Rectifier Conversion:</span>
                <span className="font-bold">Loss: -7% to -10% (AC back to DC)</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-ivory-400 border-t border-midnight-800 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>Requires oversized solar arrays and heavier cooling infrastructure to compensate.</span>
            </div>
          </div>

          {/* 2. Flash Solar DC Native Standard */}
          <div className="bg-midnight-850/90 border border-gold-500/40 rounded-2xl p-7 sm:p-8 space-y-6 shadow-goldGlow">
            <div className="flex items-center justify-between border-b border-midnight-700 pb-4">
              <div>
                <span className="text-xs font-mono text-gold-400 uppercase tracking-wider block">Flash Solar Standard</span>
                <h3 className="text-xl font-heading font-bold text-ivory-100">Pure Direct-Current Microgrid</h3>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold">
                Zero Inversion Loss
              </span>
            </div>

            <div className="space-y-4 text-xs font-mono text-ivory-200">
              <div className="p-3 bg-midnight-800 rounded border border-midnight-700 flex items-center justify-between">
                <span>1. Solar Panels Generate:</span>
                <span className="text-gold-400 font-bold">DC Power (Direct Current)</span>
              </div>
              <div className="p-3 bg-emerald-950/30 rounded border border-emerald-900/60 flex items-center justify-between text-emerald-300">
                <span>2. MPPT Charge Management:</span>
                <span className="font-bold">Loss: Minimal (~1.5% switching)</span>
              </div>
              <div className="p-3 bg-midnight-800 rounded border border-midnight-700 flex items-center justify-between">
                <span>3. Battery Bank Storage:</span>
                <span className="text-ivory-100 font-bold">Direct 48V DC Lithium Bus</span>
              </div>
              <div className="p-3 bg-emerald-950/30 rounded border border-emerald-900/60 flex items-center justify-between text-emerald-300">
                <span>4. Direct Brushless DC Loads:</span>
                <span className="font-bold">Zero Inverter Required (Direct Run)</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-ivory-300 border-t border-midnight-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
              <span>100% of usable battery energy flows straight to DC brushless motors and LED arrays.</span>
            </div>
          </div>
        </div>

        {/* Technical Advantages Callout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-6 rounded-xl bg-midnight-900 border border-midnight-700 space-y-2">
            <span className="text-xs font-mono text-gold-400 uppercase">1. Low-Voltage Safety</span>
            <h4 className="text-base font-heading font-bold text-ivory-100">Safe 48V Operating Bus</h4>
            <p className="text-xs text-ivory-400 leading-relaxed">
              Maintains sub-60V DC thresholds, dramatically lowering electrocution risk and simplifying indoor installation safety codes.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-midnight-900 border border-midnight-700 space-y-2">
            <span className="text-xs font-mono text-gold-400 uppercase">2. Thermal Stability</span>
            <h4 className="text-base font-heading font-bold text-ivory-100">Lower Operating Heat</h4>
            <p className="text-xs text-ivory-400 leading-relaxed">
              Without the continuous heat produced by heavy central inverters, equipment lifecycle increases and cooling energy drops.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-midnight-900 border border-midnight-700 space-y-2">
            <span className="text-xs font-mono text-gold-400 uppercase">3. Inductive Load Handling</span>
            <h4 className="text-base font-heading font-bold text-ivory-100">DC Brushless Motor Efficiency</h4>
            <p className="text-xs text-ivory-400 leading-relaxed">
              Brushless DC (BLDC) ceiling fans and refrigeration compressors consume up to 60% less energy than legacy AC induction units.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

