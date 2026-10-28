"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, Menu, X, ArrowRight, ShieldCheck, Cpu, Sliders } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Core Systems", href: "#core-systems" },
    { label: "DC Engineering", href: "#dc-engineering" },
    { label: "Specifications", href: "#specifications" },
    { label: "Solutions", href: "#solutions" },
    { label: "Resources", href: "#resources" },
    { label: "About", href: "#about" },
  ];

  return (
    <>
      {/* 1. Slim Top Information Bar */}
      <div className="bg-midnight-950 text-ivory-400 text-xs py-2 px-4 border-b border-midnight-700/60 font-sans tracking-wide">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-gold-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Reliable Power</span>
            </span>
            <span className="text-midnight-700">|</span>
            <span className="hidden sm:inline">Engineering & Energy Storage Architecture</span>
          </div>
          <div className="flex items-center gap-4 text-ivory-400 text-[11px]">
            <span className="flex items-center gap-1 text-ivory-200">
              <Cpu className="w-3 h-3 text-gold-500" />
              <span>High-Efficiency DC Systems</span>
            </span>
            <span className="text-midnight-700 hidden md:inline">|</span>
            <span className="text-gold-400 font-mono hidden md:inline">flashsolar.org</span>
          </div>
        </div>
      </div>

      {/* 2. Premium Sticky Navigation */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-midnight-900/95 backdrop-blur-md border-b border-midnight-700 shadow-elevated"
            : "bg-midnight-900/90 backdrop-blur-sm border-b border-midnight-700/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo & Tagline */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-gold-500 rounded-md p-1"
          >
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

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center gap-7 text-sm font-medium text-ivory-400"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-gold-400 transition-colors duration-200 py-1 border-b-2 border-transparent hover:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#specifications"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-ivory-300 hover:text-white bg-midnight-800/80 hover:bg-midnight-750 border border-midnight-700 rounded-md transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-gold-400" />
              <span>Spec Matrix</span>
            </a>
            <a
              href="#enquiry"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-gold-500 hover:bg-gold-600 text-midnight-950 font-semibold text-sm transition-all duration-200 shadow-goldGlow hover:shadow-none focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-midnight-900"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-ivory-300 hover:text-white hover:bg-midnight-800 border border-midnight-700 focus:outline-none focus:ring-2 focus:ring-gold-500"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-midnight-950/98 border-b border-midnight-700 px-4 pt-3 pb-6 space-y-3">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-ivory-200 hover:text-gold-400 hover:bg-midnight-800 rounded-md transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="pt-3 border-t border-midnight-800 flex flex-col gap-2.5">
              <a
                href="#specifications"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 px-4 rounded-md text-sm text-ivory-200 bg-midnight-850 border border-midnight-700 font-medium"
              >
                Specifications Matrix
              </a>
              <a
                href="#enquiry"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 px-4 rounded-md text-sm font-semibold text-midnight-950 bg-gold-500 hover:bg-gold-600 transition-colors"
              >
                Explore Platform & Project Enquiry
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

