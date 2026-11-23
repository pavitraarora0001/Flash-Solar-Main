"use client";

import * as React from "react";

export function TelemetryBeacon() {
  React.useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    // Determine device category
    const width = window.innerWidth;
    const deviceType = width < 640 ? "mobile" : width < 1024 ? "tablet" : "desktop";

    // Dispatch page view beacon
    fetch("/api/analytics/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "PAGE_VIEW",
        path: window.location.pathname,
        referrer: document.referrer || "direct",
        deviceType,
      }),
    }).catch(() => {
      // Ignore background beacon telemetry failure silently
    });

    // Global listener for CTA clicks
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a, button");
      if (!target) return;

      const href = target.getAttribute("href") || "";
      const text = target.textContent?.trim().slice(0, 50) || "";

      if (href.includes("#enquiry") || href.includes("enquiry") || target.getAttribute("data-track-cta")) {
        fetch("/api/analytics/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventType: "CTA_CLICK",
            path: window.location.pathname,
            deviceType,
            metadata: { targetText: text, targetHref: href },
          }),
        }).catch(() => {});
      }
    };

    document.addEventListener("click", handleGlobalClick, { passive: true });
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  return null;
}
