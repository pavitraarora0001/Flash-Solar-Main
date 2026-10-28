import Link from "next/link";
import Image from "next/image";
import { Zap, Mail, Phone, MapPin, ShieldCheck, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-midnight-950 text-ivory-400 border-t border-midnight-700/80 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-14 border-b border-midnight-800">
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-midnight-700 bg-midnight-800 flex items-center justify-center shrink-0">
                <Image
                  src="/images/logo.jpg"
                  alt="Flash Solar Official Logo"
                  fill
                  className="object-contain p-0.5"
                />
                <Zap className="w-5 h-5 text-gold-500 fill-current" />
              </div>
              <div>
                <span className="text-xl font-heading font-bold tracking-tight text-ivory-100 block">
                  FLASH <span className="text-gold-500">SOLAR</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-ivory-400 font-medium block">
                  Clean Energy Storage
                </span>
              </div>
            </Link>

            <p className="text-sm text-ivory-400 max-w-md leading-relaxed">
              Specialized clean energy storage solutions, Flash Power Wall systems, and high-efficiency direct-current microgrid architectures engineered for resilient, independent power.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs text-ivory-400">
              <span className="inline-flex items-center gap-1.5 text-gold-400">
                <ShieldCheck className="w-4 h-4 text-gold-500" />
                <span>Engineered Quality</span>
              </span>
              <span>•</span>
              <span className="font-mono text-ivory-300">flashsolar.org</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-400">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#core-systems" className="hover:text-gold-400 transition-colors inline-flex items-center gap-1">
                  <span>Core Systems</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="#dc-engineering" className="hover:text-gold-400 transition-colors inline-flex items-center gap-1">
                  <span>DC Engineering Architecture</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="#specifications" className="hover:text-gold-400 transition-colors inline-flex items-center gap-1">
                  <span>Technical Specifications</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-gold-400 transition-colors inline-flex items-center gap-1">
                  <span>Engineered Power Solutions</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="#resources" className="hover:text-gold-400 transition-colors inline-flex items-center gap-1">
                  <span>Technical Resources</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-gold-400 transition-colors inline-flex items-center gap-1">
                  <span>About Flash Solar</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact / Engineering Support */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-400">
              Project Support & Inquiries
            </h3>
            <p className="text-xs text-ivory-400 leading-relaxed">
              Technical consultation, sizing validation, and system engineering inquiries are handled directly by our electrical specialists.
            </p>
            <div className="space-y-2.5 text-sm pt-1">
              <div className="flex items-start gap-2.5 text-ivory-300">
                <Mail className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <span className="font-mono text-xs">info@flashsolar.org</span>
              </div>
              <div className="flex items-start gap-2.5 text-ivory-300">
                <Phone className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <span className="text-xs">Engineering Support Hotline Available</span>
              </div>
              <div className="flex items-start gap-2.5 text-ivory-300">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <span className="text-xs">Global Clean Energy Infrastructure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-ivory-400">
          <p>© {new Date().getFullYear()} Flash Solar. All rights reserved. Clean Energy & Storage Engineering.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-gold-400 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gold-400 transition-colors cursor-pointer">Terms & Conditions</span>
            <span className="hover:text-gold-400 transition-colors cursor-pointer">Warranty Framework</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

