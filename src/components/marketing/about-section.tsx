import * as React from "react";
import { Zap, ShieldCheck, Cpu, Compass, CheckCircle2 } from "lucide-react";

export function AboutSection() {
  const principles = [
    {
      title: "Eliminating Wasteful Conversion",
      description: "Traditional solar setups waste substantial energy by converting DC to AC and back again. Our engineering focuses on native direct-current distribution to maximize usable power.",
    },
    {
      title: "Safe, Stable Lithium Chemistry",
      description: "We standardize exclusively on Lithium Iron Phosphate (LiFePO4) cell chemistry, offering extreme thermal stability, chemical safety, and multi-thousand cycle endurance.",
    },
    {
      title: "Decentralized Energy Independence",
      description: "Designing domestic and industrial microgrids that operate self-sufficiently, protecting homes and critical business operations from utility grid blackouts.",
    },
  ];

  return (
    <section id="about" className="bg-midnight-900 text-ivory-100 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-midnight-700/80">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-midnight-800 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest">
              <Compass className="w-3.5 h-3.5 text-gold-400" />
              <span>Engineering Philosophy</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-ivory-100 tracking-tight leading-tight">
              Pioneering High-Efficiency Energy Storage & DC Microgrids.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-ivory-400 leading-relaxed">
              <p>
                Flash Solar was established with a singular engineering focus: building electrical systems that minimize parasitic loss and maximize the autonomy of solar-generated power.
              </p>
              <p>
                By rethinking energy delivery from the cell chemistry up to appliance distribution, we deliver solutions that allow households and businesses to break free from fragile centralized grids. Whether through our wall-mounted Flash Power Wall or comprehensive Flash DC microgrids, our installations prioritize measurable electrical yield, safety, and operational longevity.
              </p>
            </div>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-midnight-850 border border-midnight-700 space-y-1">
                <span className="text-gold-400 font-heading font-bold text-lg">Direct DC Native</span>
                <p className="text-xs text-ivory-400">12V, 24V & 48V dedicated microgrid standards</p>
              </div>
              <div className="p-4 rounded-lg bg-midnight-850 border border-midnight-700 space-y-1">
                <span className="text-gold-400 font-heading font-bold text-lg">LiFePO4 Storage</span>
                <p className="text-xs text-ivory-400">Industrial cell architecture with integrated BMS</p>
              </div>
            </div>
          </div>

          {/* Right Principles */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-midnight-950 border border-midnight-700 p-8 rounded-2xl shadow-xl space-y-6">
              <h3 className="text-xl font-heading font-bold text-ivory-100 border-b border-midnight-800 pb-4">
                Core Engineering Tenets
              </h3>

              <div className="space-y-6">
                {principles.map((p, idx) => (
                  <div key={p.title} className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/40 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-heading font-bold text-ivory-200">
                        {p.title}
                      </h4>
                    </div>
                    <p className="text-xs text-ivory-400 leading-relaxed pl-7">
                      {p.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

