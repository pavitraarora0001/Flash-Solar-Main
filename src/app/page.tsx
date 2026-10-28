import Link from "next/link";
import { Zap, Shield, Sun, BatteryCharging, ArrowRight, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Top Banner / Announcement */}
      <div className="bg-navy-950 text-slate-300 text-xs py-2 px-4 border-b border-navy-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Flash Solar Platform — Engineering & Energy Storage Architecture</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Domain: flashsolar.org</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">High-Efficiency DC Systems</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-50 bg-navy-900/95 backdrop-blur-md border-b border-navy-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-gold-500 rounded-md p-1">
            <div className="w-10 h-10 rounded-lg bg-gold-500 flex items-center justify-center text-navy-950 font-bold shadow-md group-hover:bg-gold-400 transition-colors">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="text-xl font-heading font-extrabold tracking-tight text-white block">
                FLASH <span className="text-gold-500">SOLAR</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium block">
                Clean Energy Storage
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-200" aria-label="Main Navigation">
            <Link href="#offerings" className="hover:text-gold-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500 rounded px-2 py-1">
              Core Systems
            </Link>
            <Link href="#architecture" className="hover:text-gold-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500 rounded px-2 py-1">
              DC Engineering
            </Link>
            <Link href="#specs" className="hover:text-gold-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500 rounded px-2 py-1">
              Specifications
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#specs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-gold-500 hover:bg-gold-600 text-navy-950 font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-navy-900 shadow-sm"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-navy-900 via-navy-900 to-navy-950 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8 border-b border-navy-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-800/80 border border-navy-700 text-gold-400 text-xs font-semibold uppercase tracking-wider">
                <Sun className="w-3.5 h-3.5" />
                <span>Next-Generation Energy Resilience</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight leading-tight">
                Engineered for <span className="text-gold-500">Zero-Loss</span> Solar Storage.
              </h1>
              <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                Flash Solar designs high-efficiency energy storage architectures and direct-current microgrid systems. By eliminating unnecessary AC/DC inverter conversions, our systems deliver maximum usable power from every solar watt.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <a
                  href="#offerings"
                  className="inline-flex justify-center items-center gap-2 px-6 py-3.5 rounded-md bg-gold-500 hover:bg-gold-600 text-navy-950 font-semibold text-base transition-colors shadow-lg shadow-gold-500/10 focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  <span>View Core Systems</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#architecture"
                  className="inline-flex justify-center items-center gap-2 px-6 py-3.5 rounded-md bg-navy-800 hover:bg-navy-700 text-slate-100 font-medium text-base transition-colors border border-navy-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <Shield className="w-4 h-4 text-gold-500" />
                  <span>Technical Framework</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-navy-850/80 border border-navy-700 p-8 rounded-xl shadow-2xl backdrop-blur-sm space-y-6">
                <div className="flex items-center justify-between border-b border-navy-700 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-gold-500">
                      <BatteryCharging className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-heading font-semibold text-white">System Benchmark</h2>
                      <span className="text-xs text-slate-400">Direct DC vs Conventional AC</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 text-xs font-mono font-medium border border-emerald-800">
                    +18% Yield
                  </span>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Inverter Conversion Losses:</span>
                    <span className="font-mono text-emerald-400 font-semibold">0% (Pure DC Native)</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Lithium Cell Architecture:</span>
                    <span className="font-mono text-white font-semibold">LiFePO4 Chemistry</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Standard Operating Bus:</span>
                    <span className="font-mono text-white font-semibold">48V Low-Voltage Safe</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Continuous Load Delivery:</span>
                    <span className="font-mono text-gold-400 font-semibold">High Duty Cycle</span>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-400 border-t border-navy-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" />
                  <span>All metrics based on physical steady-state electrical models.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Offerings Section */}
      <section id="offerings" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-semibold tracking-widest text-gold-600 uppercase">Verified Offerings</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900">
            Engineered Power Solutions
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Flash Solar specializes in dedicated energy storage and solar microgrid configurations built to withstand severe grid volatility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Flash Power Wall */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-card hover:shadow-elevated transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-navy-900 text-gold-500 flex items-center justify-center font-bold">
                <BatteryCharging className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold text-slate-900">Flash Power Wall</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Dedicated residential and commercial lithium battery storage system designed for high cycle life, integrated BMS safety, and wall-mounted form factor.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium pt-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                  <span>LiFePO4 Safe Chemistry</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                  <span>High Depth of Discharge (DoD)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                  <span>Modular Scalability</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-navy-900">
              <span>Energy Storage</span>
              <span className="text-gold-600">Core Product</span>
            </div>
          </div>

          {/* Flash DC House */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-card hover:shadow-elevated transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-navy-900 text-gold-500 flex items-center justify-center font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold text-slate-900">Flash DC House</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pure Direct-Current residential architecture powering 12V/24V/48V appliances directly from solar and batteries without an inverter.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium pt-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                  <span>Zero Inverter Conversion Loss</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                  <span>Direct DC Fans, Lights & Fridges</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                  <span>Low Operating Temperature</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-navy-900">
              <span>Microgrid System</span>
              <span className="text-gold-600">Zero Loss</span>
            </div>
          </div>

          {/* Flash AC House */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-card hover:shadow-elevated transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-navy-900 text-gold-500 flex items-center justify-center font-bold">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold text-slate-900">Flash AC House</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Hybrid alternating-current system integrating standard residential wiring with pure sine-wave inverters and Flash Solar battery banks.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium pt-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                  <span>Seamless Grid & Solar Hybrid</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                  <span>Compatible with Standard Wiring</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                  <span>Automatic Transfer Synchronization</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-navy-900">
              <span>Hybrid System</span>
              <span className="text-gold-600">Full Compatibility</span>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Credibility Notice */}
      <section id="specs" className="bg-slate-100 border-t border-b border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <h3 className="text-xl font-heading font-bold text-slate-900">Technical Sizing & Engineering Verification</h3>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Every solar system calculation requires site-specific solar insolation validation, conductor sizing, and temperature derating before deployment.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-4">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
              Domain: flashsolar.org
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-navy-800 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-gold-500 flex items-center justify-center text-navy-950 font-bold text-xs">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <span className="font-heading font-bold text-white tracking-wide">
              FLASH <span className="text-gold-500">SOLAR</span>
            </span>
          </div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Flash Solar. All rights reserved. Clean Energy & Storage Engineering.
          </p>
        </div>
      </footer>
    </div>
  );
}

