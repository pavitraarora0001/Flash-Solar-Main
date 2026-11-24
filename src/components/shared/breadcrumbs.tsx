"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="py-2.5">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-ivory-400 font-sans">
        <li>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-ivory-400 hover:text-gold-400 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-gold-500/80" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-midnight-700 shrink-0" />
              {isLast || !item.href ? (
                <span className="text-gold-400 font-medium truncate max-w-xs sm:max-w-md" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-ivory-400 hover:text-gold-400 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
