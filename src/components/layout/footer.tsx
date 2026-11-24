import Link from "next/link";
import Image from "next/image";
import { Zap, Mail, Phone, MapPin, ShieldCheck, ArrowUpRight, Cpu } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";

export function Footer() {
  return (
    <footer className="bg-midnight-950 text-ivory-400 border-t border-midnight-700/80 pt-16 pb-12 font-sans selection:bg-gold-500 selection:text-midnight-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-midnight-800">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-5">
            <BrandLogo variant="footer" priority={false} />

            <p className="text-sm text-ivory-400 max-w-sm leading-relaxed">
              Industrial clean energy storage systems, Flash Power Wall hardware, and thermodynamic zero-loss direct-current microgrid architectures engineered for independent power resilience.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-ivory-400">
              <span className="inline-flex items-center gap-1.5 text-gold-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-gold-500" />
                <span>Engineered Quality</span>
              </span>
              <span className="text-midnight-700">•</span>
              <span className="inline-flex items-center gap-1 text-ivory-300">
                <Cpu className="w-3.5 h-3.5 text-gold-400" />
                <span>99.98% DC Bus Efficiency</span>
              </span>
            </div>
          </div>

          {/* Hardware & Systems */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-400 font-mono">
              Hardware & Systems
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/products/flash-power-wall" className="hover:text-gold-400 transition-colors inline-flex items-center gap-1 group">
                  <span>Flash Power Wall (5-15 kWh)</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-gold-400" />
                </Link>
              </li>
              <li>
                <Link href="/products/flash-dc-house" className="hover:text-gold-400 transition-colors inline-flex items-center gap-1 group">
                  <span>Flash DC House Microgrid</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-gold-400" />
                </Link>
              </li>
              <li>
                <Link href="/products/flash-ac-house" className="hover:text-gold-400 transition-colors inline-flex items-center gap-1 group">
                  <span>Flash AC Hybrid Solar</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-gold-400" />
                </Link>
              </li>
              <li>
                <Link href="/products/flash-container-0537" className="hover:text-gold-400 transition-colors inline-flex items-center gap-1 group">
                  <span>Containerized Storage 1MWh</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-gold-400" />
                </Link>
              </li>
              <li>
                <Link href="/specifications" className="hover:text-gold-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="text-gold-400 font-medium">Specification Matrix</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-gold-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture & Engineering */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-400 font-mono">
              Engineering
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/engineering" className="hover:text-gold-400 transition-colors">
                  DC Architecture
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-gold-400 transition-colors">
                  Turnkey Solutions
                </Link>
              </li>
              <li>
                <Link href="/industries" className="hover:text-gold-400 transition-colors">
                  Industry Topologies
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-gold-400 transition-colors">
                  Technical Resources
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-gold-400 transition-colors">
                  Engineering Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Engineering Desk */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-400 font-mono">
              Engineering Consultation
            </h3>
            <p className="text-xs text-ivory-400 leading-relaxed">
              Technical consultation, load sizing validation, and system engineering inquiries handled directly by electrical specialists.
            </p>
            <div className="space-y-2.5 text-sm pt-1">
              <a href="mailto:info@flashsolar.org" className="flex items-center gap-2.5 text-ivory-300 hover:text-gold-400 transition-colors">
                <Mail className="w-4 h-4 text-gold-500 shrink-0" />
                <span className="font-mono text-xs">info@flashsolar.org</span>
              </a>
              <a href="tel:+918824536524" className="flex items-center gap-2.5 text-ivory-300 hover:text-gold-400 transition-colors">
                <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                <span className="font-mono text-xs">+91 8824536524</span>
              </a>
              <div className="flex items-start gap-2.5 text-ivory-300">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <span className="text-xs">Kaccha Talab, Kumher, Bharatpur - 321201 Rajasthan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-ivory-400">
          <p>© {new Date().getFullYear()} Flash Solar. All rights reserved. Clean Energy & Storage Engineering.</p>
          <div className="flex flex-wrap items-center gap-5 sm:gap-6">
            <Link href="/about" className="hover:text-gold-400 transition-colors">About Us</Link>
            <Link href="/warranty" className="hover:text-gold-400 transition-colors">Warranty & Guarantee</Link>
            <Link href="/privacy" className="hover:text-gold-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gold-400 transition-colors">Terms of Service</Link>
            <Link href="/admin" className="hover:text-gold-400 text-gold-400/80 transition-colors font-mono">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
