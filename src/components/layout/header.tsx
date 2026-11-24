"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, ShieldCheck, Cpu, Sliders, Phone, Mail } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";

interface NavItem {
  label: string;
  href: string; // fallback or standalone route
  sectionId: string; // anchor id on homepage
  pathMatch: string; // route prefix to match
}

const NAV_ITEMS: NavItem[] = [
  { label: "Core Systems", href: "/products", sectionId: "core-systems", pathMatch: "/products" },
  { label: "DC Engineering", href: "/engineering", sectionId: "dc-engineering", pathMatch: "/engineering" },
  { label: "Specifications", href: "/specifications", sectionId: "specifications", pathMatch: "/specifications" },
  { label: "Solutions", href: "/solutions", sectionId: "solutions", pathMatch: "/solutions" },
  { label: "Resources", href: "/resources", sectionId: "resources", pathMatch: "/resources" },
  { label: "About", href: "/about", sectionId: "about", pathMatch: "/about" },
];

export function Header() {
  const pathname = usePathname() || "/";
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<string>("");

  const isHome = pathname === "/";

  // Handle scroll for navbar shadow and active section tracking on homepage
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (isHome) {
        const sections = NAV_ITEMS.map((item) => item.sectionId);
        let currentSection = "";
        for (const sec of sections) {
          const el = document.getElementById(sec);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 200 && rect.bottom >= 150) {
              currentSection = sec;
              break;
            }
          }
        }
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Determine if a nav item is active
  const isItemActive = (item: NavItem) => {
    if (isHome) {
      return activeSection === item.sectionId;
    }
    return pathname.startsWith(item.pathMatch);
  };

  // Resolve link target based on current page
  const getHref = (item: NavItem) => {
    if (isHome) {
      return `#${item.sectionId}`;
    }
    return item.href;
  };

  return (
    <>
      {/* 1. Slim Top Information Bar */}
      <div className="bg-midnight-950 text-ivory-400 text-xs py-2 px-4 border-b border-midnight-700/60 font-sans tracking-wide">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-gold-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
              <span>Reliable Power</span>
            </span>
            <span className="text-midnight-700">|</span>
            <span className="hidden sm:inline">Engineering & Energy Storage Architecture</span>
          </div>

          <div className="flex items-center gap-4 text-ivory-400 text-[11px]">
            <a
              href="tel:+918824536524"
              className="flex items-center gap-1.5 text-ivory-300 hover:text-gold-400 transition-colors"
            >
              <Phone className="w-3 h-3 text-gold-500" />
              <span className="font-mono">+91 8824536524</span>
            </a>
            <span className="text-midnight-700 hidden md:inline">|</span>
            <a
              href="mailto:info@flashsolar.org"
              className="flex items-center gap-1.5 text-ivory-300 hover:text-gold-400 transition-colors hidden md:inline-flex"
            >
              <Mail className="w-3 h-3 text-gold-500" />
              <span className="font-mono">info@flashsolar.org</span>
            </a>
            <span className="text-midnight-700 hidden lg:inline">|</span>
            <span className="flex items-center gap-1 text-gold-400 font-mono hidden lg:inline-flex">
              <Cpu className="w-3 h-3 text-gold-500" />
              <span>Direct-Current sub-60V</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Premium Sticky Navigation */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-midnight-950/95 backdrop-blur-md border-b border-midnight-700 shadow-elevated"
            : "bg-midnight-950/90 backdrop-blur-sm border-b border-midnight-700/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo & Wordmark in Premium Serif */}
          <BrandLogo variant="header" priority />

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium"
            aria-label="Main Navigation"
          >
            {NAV_ITEMS.map((item) => {
              const active = isItemActive(item);
              const href = getHref(item);

              return (
                <Link
                  key={item.label}
                  href={href}
                  className={`relative py-2 transition-colors duration-200 group focus:outline-none focus:ring-2 focus:ring-gold-500 rounded ${
                    active ? "text-gold-400 font-semibold" : "text-ivory-300 hover:text-gold-400"
                  }`}
                >
                  <span>{item.label}</span>
                  {/* Subtle Gold Active / Hover Line */}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-gold-500 transition-all duration-200 ${
                      active ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-80 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href={isHome ? "#specifications" : "/specifications"}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-ivory-200 hover:text-white bg-midnight-900/90 hover:bg-midnight-800 border border-gold-500/30 hover:border-gold-400 rounded-md transition-all duration-200 shadow-sm"
            >
              <Sliders className="w-3.5 h-3.5 text-gold-400" />
              <span>Spec Matrix</span>
            </Link>

            <Link
              href={isHome ? "#enquiry" : "/enquiry"}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-midnight-950 font-semibold text-sm transition-all duration-200 shadow-goldGlow hover:shadow-none focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-midnight-900"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-ivory-200 hover:text-white hover:bg-midnight-850 border border-midnight-700/80 focus:outline-none focus:ring-2 focus:ring-gold-500"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-gold-400" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-midnight-950 border-b border-midnight-700 px-4 pt-3 pb-6 space-y-4 shadow-elevated">
            <nav className="flex flex-col space-y-1.5" aria-label="Mobile Navigation">
              {NAV_ITEMS.map((item) => {
                const active = isItemActive(item);
                const href = getHref(item);

                return (
                  <Link
                    key={item.label}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 text-base font-medium rounded-md transition-colors flex items-center justify-between ${
                      active
                        ? "text-gold-400 bg-midnight-900 border border-gold-500/30"
                        : "text-ivory-200 hover:text-gold-400 hover:bg-midnight-900"
                    }`}
                  >
                    <span>{item.label}</span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-midnight-800 flex flex-col gap-2.5">
              <Link
                href={isHome ? "#specifications" : "/specifications"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 px-4 rounded-md text-sm text-ivory-200 bg-midnight-900 hover:bg-midnight-850 border border-gold-500/30 font-medium inline-flex items-center justify-center gap-2"
              >
                <Sliders className="w-4 h-4 text-gold-400" />
                <span>Specifications Matrix</span>
              </Link>
              <Link
                href={isHome ? "#enquiry" : "/enquiry"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 px-4 rounded-md text-sm font-semibold text-midnight-950 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 transition-colors inline-flex items-center justify-center gap-2"
              >
                <span>Explore Platform & Project Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
