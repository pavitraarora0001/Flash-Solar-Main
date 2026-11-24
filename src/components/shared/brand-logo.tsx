"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

export interface BrandLogoProps {
  /**
   * Layout & styling variant
   * - "header": Public header navigation (balanced height, responsive text)
   * - "footer": Public footer brand section
   * - "admin": Admin login & change-password screens
   * - "admin-sidebar": Admin dashboard persistent sidebar
   * - "compact": Compact mobile navigation or badge
   */
  variant?: "header" | "footer" | "admin" | "admin-sidebar" | "compact";
  /** Optional custom subtitle (defaults to "Clean Energy Storage") */
  subtitle?: string;
  /** Whether to render the subtitle */
  showSubtitle?: boolean;
  /** Target link destination. Pass null or empty string to render non-link div */
  href?: string | null;
  /** Extra container className */
  className?: string;
  /** Whether next/image should load with priority */
  priority?: boolean;
}

export function BrandLogo({
  variant = "header",
  subtitle = "Clean Energy Storage",
  showSubtitle = true,
  href = "/",
  className = "",
  priority = true,
}: BrandLogoProps) {
  // Dimension and typography configurations per variant
  const config = React.useMemo(() => {
    switch (variant) {
      case "footer":
        return {
          imgClass: "h-9 sm:h-10 w-auto object-contain shrink-0",
          gap: "gap-3 sm:gap-3.5",
          titleClass: "text-xl font-serif font-extrabold tracking-tight text-ivory-100 leading-tight block",
          goldClass: "text-gold-400 font-serif",
          subtitleClass: "text-[10px] uppercase tracking-widest text-ivory-400 font-medium block mt-0.5",
        };
      case "admin":
        return {
          imgClass: "h-8 sm:h-9 md:h-10 w-auto object-contain shrink-0",
          gap: "gap-2.5 sm:gap-3",
          titleClass: "text-xl font-heading font-extrabold tracking-tight text-ivory-100 leading-tight block",
          goldClass: "text-gold-400",
          subtitleClass: "text-[10px] font-mono tracking-widest text-ivory-400 uppercase block mt-0.5",
        };
      case "admin-sidebar":
        return {
          imgClass: "h-7 w-auto object-contain shrink-0",
          gap: "gap-2.5",
          titleClass: "text-sm font-heading font-extrabold text-ivory-100 leading-tight tracking-tight block",
          goldClass: "text-gold-400",
          subtitleClass: "text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-semibold block mt-0.5",
        };
      case "compact":
        return {
          imgClass: "h-6 w-auto object-contain shrink-0",
          gap: "gap-2",
          titleClass: "text-xs sm:text-sm font-heading font-extrabold text-ivory-100 leading-tight block",
          goldClass: "text-gold-400",
          subtitleClass: "text-[8px] font-mono uppercase tracking-wider text-ivory-400 block",
        };
      case "header":
      default:
        return {
          imgClass: "h-8 sm:h-9 md:h-10 w-auto object-contain shrink-0",
          gap: "gap-2.5 sm:gap-3.5",
          titleClass: "text-lg sm:text-xl font-serif font-extrabold tracking-tight text-ivory-100 leading-tight block",
          goldClass: "text-gold-400 font-serif",
          subtitleClass: "text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-ivory-400 font-medium font-mono block mt-0.5",
        };
    }
  }, [variant]);

  const content = (
    <div className={`inline-flex items-center ${config.gap} transition-opacity duration-200 group-hover:opacity-95 ${className}`}>
      {/* Authentic transparent Flash Solar logo mark without restrictive square box */}
      <Image
        src="/images/logo.png"
        alt="Flash Solar Logo"
        width={859}
        height={237}
        priority={priority}
        className={config.imgClass}
      />

      {/* Balanced brand wordmark */}
      <div className="flex flex-col justify-center">
        <span className={config.titleClass}>
          FLASH <span className={config.goldClass}>SOLAR</span>
        </span>
        {showSubtitle && subtitle && (
          <span className={config.subtitleClass}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex items-center group focus:outline-none focus:ring-2 focus:ring-gold-500 rounded-md p-1"
        aria-label="Flash Solar Home"
      >
        {content}
      </Link>
    );
  }

  return content;
}
