"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Cpu, Battery, Network, Laptop, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

export function DcArchitectureJourney() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [dbStages, setDbStages] = React.useState<Array<{
    stageNumber: number;
    title: string;
    badge: string;
    description: string;
    imageUrl: string;
    voltageBus?: string;
    efficiencyMetric?: string;
  }> | null>(null);

  React.useEffect(() => {
    fetch("/api/engineering")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.stages) && d.stages.length >= 5) {
          setDbStages(d.stages);
        }
      })
      .catch(() => {});
  }, []);

  const rawSteps = [
    {
      id: "solar",
      title: "1. Solar Photovoltaic Generation",
      bus: "DC Output (High Voltage PV String)",
      efficiency: "100% Native Generation",
      icon: Sun,
      color: "text-amber-400",
      borderColor: "border-amber-500",
      image: "/images/solar-photovoltaic-generation.jpg",
      isPhoto: true,
      badge: "COMMERCIAL SOLAR FARM • 100% NATIVE DC GENERATION",
      alt: "High-Efficiency Commercial Solar Photovoltaic Farm at Golden Hour",
      description:
        "Solar arrays generate pure Direct Current (DC) electricity naturally from photon-electron excitation in crystalline silicon cells. No inversion is required at this stage.",
      metrics: { voltage: "120V - 450V DC", losses: "0.0%", state: "Active Inflow" },
    },
    {
      id: "mppt",
      title: "2. Maximum Power Point Tracking (MPPT)",
      bus: "DC Voltage Regulation & Buck Stage",
      efficiency: "98.5% Conversion Efficiency",
      icon: Cpu,
      color: "text-blue-400",
      borderColor: "border-blue-500",
      image: "/images/dc-house.svg",
      isPhoto: false,
      badge: "SOLID-STATE BUCK REGULATION ARCHITECTURE",
      alt: "Solid-State MPPT Controller Topology",
      description:
        "High-frequency solid-state MPPT controllers sweep optimal I-V curves continuously, stepping down string voltage directly to the 48V/51.2V battery bus with near-zero thermal loss.",
      metrics: { voltage: "48V - 51.2V DC", losses: "1.5%", state: "Voltage Matched" },
    },
    {
      id: "storage",
      title: "3. Flash Power Wall Storage",
      bus: "LiFePO4 Lithium Iron Phosphate Bus",
      efficiency: ">95% Round-Trip Coulombic",
      icon: Battery,
      color: "text-emerald-400",
      borderColor: "border-emerald-500",
      image: "/images/flash-power-wall.jpg",
      isPhoto: true,
      badge: "FLASH POWER WALL • 51.2V LIFEPO4 ENERGY STORAGE",
      alt: "Flash Power Wall Premium Lithium Iron Phosphate Battery Storage",
      description:
        "Direct chemical energy storage into modular LiFePO4 cells. Active BMS monitors individual cell voltages, temperature gradients, and state-of-charge with zero phantom AC standby drain.",
      metrics: { voltage: "51.2V Nominal", losses: "3.5%", state: "Full Buffer" },
    },
    {
      id: "distribution",
      title: "4. Direct-Current Bus Distribution",
      bus: "12V, 24V, 48V Sub-60V Safe Bus",
      efficiency: "99.0% Conductor Delivery",
      icon: Network,
      color: "text-gold-400",
      borderColor: "border-gold-500",
      image: "/images/dc-house.svg",
      isPhoto: false,
      badge: "SUB-60V DIRECT-CURRENT BUS TOPOLOGY",
      alt: "Sub-60V Safe Direct-Current Distribution Bus",
      description:
        "Power distributes throughout the premise across specialized low-voltage DC conduits. Eliminates bulky 230V central inverters, fire risks from high-voltage AC arcing, and harmonic distortion.",
      metrics: { voltage: "48V DC Bus", losses: "1.0%", state: "Conductor Flow" },
    },
    {
      id: "loads",
      title: "5. Direct-Current Electrical Loads",
      bus: "Brushless DC (BLDC) Motors & LEDs",
      efficiency: "Zero Inverter Conversion Loss",
      icon: Laptop,
      color: "text-purple-400",
      borderColor: "border-purple-500",
      image: "/images/ac-house.svg",
      isPhoto: false,
      badge: "NATIVE BRUSHLESS DC MOTOR & LED INTEGRATION",
      alt: "Native DC High-Efficiency End-Load Distribution",
      description:
        "Modern efficient appliances (BLDC ceiling fans, LED lighting arrays, DC refrigeration compressors, heat pumps, computers) run natively on DC. Energy flows directly into end-devices without power bricks.",
      metrics: { voltage: "Direct DC", losses: "0.0%", state: "100% Usable" },
    },
  ];

  const steps = rawSteps.map((step, idx) => {
    if (!dbStages || !dbStages[idx]) return step;
    const dbS = dbStages[idx];
    return {
      ...step,
      title: `${idx + 1}. ${dbS.title}`,
      description: dbS.description || step.description,
      image: dbS.imageUrl || step.image,
      badge: dbS.badge || step.badge,
      metrics: {
        ...step.metrics,
        voltage: dbS.voltageBus || step.metrics.voltage,
      },
      isPhoto: dbS.imageUrl?.includes(".jpg") || dbS.imageUrl?.includes(".png") || step.isPhoto,
    };
  });

  return (
    <section id="dc-journey" className="bg-midnight-900 text-ivory-100 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-midnight-700/80">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Heading */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-midnight-800 border border-gold-500/40 text-gold-400 text-xs font-semibold uppercase tracking-widest">
            <Cpu className="w-3.5 h-3.5 text-gold-400" />
            <span>Interactive Architecture Map</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-ivory-100 tracking-tight leading-tight">
            The Zero-Loss Direct Current Journey.
          </h2>

          <p className="text-base sm:text-lg text-ivory-400 leading-relaxed">
            Follow the continuous flow of energy from photon capture on your roof to direct mechanical output in your home or business. Click any stage to inspect electrical parameters.
          </p>
        </div>

        {/* 5-Stage Interactive Progress Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStep(idx)}
                className={`text-left p-4 rounded-xl border transition-all duration-200 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-gold-500 ${
                  isActive
                    ? "bg-midnight-800 border-gold-500 shadow-goldGlow"
                    : "bg-midnight-950/70 border-midnight-700/70 hover:bg-midnight-850 hover:border-midnight-600"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 to-gold-400"
                  />
                )}
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isActive ? "bg-gold-500 text-midnight-950" : "bg-midnight-800 text-ivory-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono text-ivory-400">STAGE {idx + 1}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-heading font-bold text-ivory-100 line-clamp-1">
                  {s.id.toUpperCase()}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Main Interactive Stage Presentation */}
        <div className="bg-midnight-950 border border-midnight-700 rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Animated SVG Energy Flow Conduit */}
          <div className="hidden lg:block absolute top-0 left-0 right-0 h-2 bg-midnight-850 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gold-500 via-emerald-400 to-gold-500 w-1/3"
              animate={{ x: ["-100%", "300%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={steps[activeStep].id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
            >
              {/* Left Detail */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-gold-500/10 text-gold-400 border border-gold-500/30">
                    STAGE {activeStep + 1} OF 5
                  </span>
                  <span className="text-xs font-mono text-emerald-400">
                    {steps[activeStep].efficiency}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-ivory-100">
                  {steps[activeStep].title}
                </h3>

                <p className="text-sm sm:text-base text-ivory-300 leading-relaxed">
                  {steps[activeStep].description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-midnight-800">
                  <div className="p-3.5 bg-midnight-900 rounded-lg border border-midnight-800">
                    <span className="text-[10px] uppercase font-mono text-ivory-400 block">Bus Operating Voltage</span>
                    <span className="text-base font-mono font-bold text-gold-400 mt-0.5 block">
                      {steps[activeStep].metrics.voltage}
                    </span>
                  </div>

                  <div className="p-3.5 bg-midnight-900 rounded-lg border border-midnight-800">
                    <span className="text-[10px] uppercase font-mono text-ivory-400 block">Conversion Thermal Losses</span>
                    <span className="text-base font-mono font-bold text-emerald-400 mt-0.5 block">
                      {steps[activeStep].metrics.losses}
                    </span>
                  </div>

                  <div className="p-3.5 bg-midnight-900 rounded-lg border border-midnight-800">
                    <span className="text-[10px] uppercase font-mono text-ivory-400 block">Architecture State</span>
                    <span className="text-base font-mono font-bold text-ivory-100 mt-0.5 block">
                      {steps[activeStep].metrics.state}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-4">
                  <button
                    onClick={() => setActiveStep((activeStep + 1) % steps.length)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-gold-400 hover:text-gold-300"
                  >
                    <span>Next Phase: {steps[(activeStep + 1) % steps.length].title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Architectural Presentation Graphic */}
              <div className="lg:col-span-5">
                <div className={`group relative w-full rounded-2xl overflow-hidden border border-midnight-700/80 bg-midnight-950 shadow-2xl transition-all duration-300 hover:border-gold-500/50 ${
                  steps[activeStep].isPhoto ? "h-72 sm:h-80 lg:h-96" : "h-64 sm:h-72 p-4"
                }`}>
                  <Image
                    src={steps[activeStep].image}
                    alt={steps[activeStep].alt}
                    fill
                    className={`${
                      steps[activeStep].isPhoto
                        ? "object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        : "object-contain p-2"
                    }`}
                    priority={activeStep === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  />
                  {steps[activeStep].isPhoto && (
                    <div className="absolute inset-0 bg-gradient-to-t from-midnight-950/85 via-midnight-950/20 to-transparent pointer-events-none" />
                  )}
                  <div className="absolute bottom-3 right-3 bg-midnight-950/90 backdrop-blur-sm border border-midnight-700 px-2.5 py-1 rounded text-[10px] font-mono text-gold-400 shadow-md">
                    {steps[activeStep].badge}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
