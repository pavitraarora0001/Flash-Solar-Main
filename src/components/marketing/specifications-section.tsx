import * as React from "react";
import { Sliders, Download, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

export function SpecificationsSection() {
  const specRows = [
    {
      parameter: "Nominal Operating Voltage",
      powerWall: "48V / 51.2V DC Nominal",
      dcHouse: "12V, 24V, 48V Native Bus",
      acHouse: "230V Single-Phase / 400V 3-Phase",
    },
    {
      parameter: "Battery Cell Chemistry",
      powerWall: "Lithium Iron Phosphate (LiFePO4)",
      dcHouse: "LiFePO4 / Deep-Cycle Compatible",
      acHouse: "LiFePO4 High-Voltage / 48V Stack",
    },
    {
      parameter: "Depth of Discharge (DoD)",
      powerWall: "Up to 90% Usable Capacity",
      dcHouse: "85% - 90% Nominal",
      acHouse: "80% - 90% Configurable",
    },
    {
      parameter: "Conversion Efficiency",
      powerWall: ">95% Round-Trip Cell Efficiency",
      dcHouse: "Zero Inversion Loss (100% DC Bus)",
      acHouse: "88% - 93% Inverter Efficiency",
    },
    {
      parameter: "Integrated Protection (BMS)",
      powerWall: "Over-voltage, thermal cut-off, cell balancing",
      dcHouse: "DC Breaker & Over-current fuses",
      acHouse: "AC/DC Surge Protection & Grid Isolation",
    },
    {
      parameter: "Scalability / Clustering",
      powerWall: "Parallel connection up to 8 units",
      dcHouse: "Modular DC sub-panels",
      acHouse: "Multi-inverter synchronization",
    },
    {
      parameter: "Mounting & Physical Form",
      powerWall: "Wall-mount or floor-standing rack",
      dcHouse: "Premise DC bus distribution",
      acHouse: "Inverter enclosure & battery rack",
    },
  ];

  return (
    <section id="specifications" className="bg-midnight-900 text-ivory-100 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-midnight-700/80">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-midnight-800 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest">
              <Sliders className="w-3.5 h-3.5 text-gold-400" />
              <span>Engineering Matrix</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-ivory-100 tracking-tight">
              Technical Specifications
            </h2>
            <p className="text-sm sm:text-base text-ivory-400 leading-relaxed">
              Direct architectural comparison between the Flash Power Wall storage hardware, the Flash DC microgrid standard, and traditional AC hybrid installations.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <a
              href="#enquiry"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-midnight-800 hover:bg-midnight-750 text-gold-400 text-xs font-semibold border border-midnight-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Request System Datasheet (.pdf)</span>
            </a>
          </div>
        </div>

        {/* Specification Table */}
        <div className="rounded-2xl border border-midnight-700 bg-midnight-950 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-midnight-700 bg-midnight-850/80 text-ivory-200">
                  <th className="py-4 px-6 font-heading font-bold text-xs uppercase tracking-wider text-ivory-400">
                    Parameter
                  </th>
                  <th className="py-4 px-6 font-heading font-bold text-xs uppercase tracking-wider text-gold-400">
                    Flash Power Wall
                  </th>
                  <th className="py-4 px-6 font-heading font-bold text-xs uppercase tracking-wider text-emerald-400">
                    Flash DC House
                  </th>
                  <th className="py-4 px-6 font-heading font-bold text-xs uppercase tracking-wider text-ivory-300">
                    Flash AC House
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-midnight-800 text-ivory-300 font-sans">
                {specRows.map((row, idx) => (
                  <tr
                    key={row.parameter}
                    className={idx % 2 === 0 ? "bg-midnight-950/40" : "bg-midnight-900/40 hover:bg-midnight-850/50 transition-colors"}
                  >
                    <td className="py-4 px-6 font-medium text-ivory-200">
                      {row.parameter}
                    </td>
                    <td className="py-4 px-6 font-mono text-gold-400 font-medium">
                      {row.powerWall}
                    </td>
                    <td className="py-4 px-6 font-mono text-emerald-400 font-medium">
                      {row.dcHouse}
                    </td>
                    <td className="py-4 px-6 font-mono text-ivory-300">
                      {row.acHouse}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Bottom Qualification */}
          <div className="p-4 sm:p-5 bg-midnight-850 border-t border-midnight-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ivory-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-500 shrink-0" />
              <span>All specifications reflect standard continuous operation under rated ambient temperatures.</span>
            </div>
            <a
              href="#enquiry"
              className="inline-flex items-center gap-1.5 text-gold-400 hover:text-gold-300 font-medium font-sans"
            >
              <span>Custom installation sizing available</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

