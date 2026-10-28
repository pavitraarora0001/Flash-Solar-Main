"use client";

import * as React from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function FaqSection() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const faqs = [
    {
      q: "What is the primary engineering difference between Flash DC House and conventional AC solar?",
      a: "Conventional solar systems generate Direct Current (DC), invert it to 230V Alternating Current (AC) using a central inverter, and then consumer appliances (like LED lights, laptops, brushless fans, and electronics) convert it back to DC via internal rectifiers. This double conversion typically wastes 15% to 22% of solar power as heat. The Flash DC House uses a native direct-current bus (12V, 24V, or 48V) to feed DC brushless appliances straight from the battery, achieving zero inverter conversion loss.",
    },
    {
      q: "Can the Flash Power Wall integrate with standard 230V hybrid AC inverters?",
      a: "Yes. While Flash Solar champions direct DC microgrids for maximum efficiency, the Flash Power Wall operates on a standard 48V/51.2V DC low-voltage battery bus. It can seamlessly integrate with compatible pure sine-wave hybrid inverters for properties with existing AC premise wiring.",
    },
    {
      q: "Why does Flash Solar standardize exclusively on Lithium Iron Phosphate (LiFePO4)?",
      a: "LiFePO4 is the safest, most chemically stable lithium battery chemistry available. Unlike standard NMC (nickel-manganese-cobalt) cells, LiFePO4 will not undergo thermal runaway under high ambient temperatures, supports deep depth of discharge (up to 90% usable), and offers thousands of reliable charge/discharge cycles.",
    },
    {
      q: "What if a household has high-power AC appliances like a microwave or electric oven?",
      a: "In a Flash DC House installation, high-draw AC appliances can either remain connected to the primary utility grid or be served by a dedicated, switchable auxiliary pure sine-wave inverter that only activates when those specific appliances run, preventing continuous phantom inverter standby drain.",
    },
    {
      q: "How does Flash Solar verify electrical load sizing before quoting?",
      a: "Our engineering desk calculates continuous wattage, starting inductive surge requirements (such as compressor motors), and total daily Watt-hours (Wh). We derate battery capacity according to local ambient temperatures and realistic peak sun hours, ensuring the installed system reliably supports your loads.",
    },
  ];

  return (
    <section className="bg-midnight-900 text-ivory-100 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-midnight-700/80">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-midnight-800 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5 text-gold-400" />
            <span>Technical Clarifications</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-ivory-100 tracking-tight">
            Frequently Asked Engineering Questions
          </h2>
          <p className="text-sm sm:text-base text-ivory-400 max-w-2xl mx-auto leading-relaxed">
            Direct, factual answers regarding system voltages, conversion efficiency, and energy storage architectures.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="bg-midnight-950/80 border border-midnight-700 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-heading font-bold text-ivory-100">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gold-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-ivory-400 leading-relaxed border-t border-midnight-800/80">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

