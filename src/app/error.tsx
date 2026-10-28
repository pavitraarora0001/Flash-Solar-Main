"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Client-safe operational error telemetry
    console.error("Application Boundary Error:", error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-24">
      <div className="max-w-md text-center space-y-6 bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
        <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-heading font-bold text-slate-900">System Runtime Interruption</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            An unexpected error occurred while rendering this interface. Our technical team has been notified.
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-navy-900 hover:bg-navy-800 text-white font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500"
        >
          <RotateCcw className="w-4 h-4" /> Try Again
        </button>
      </div>
    </main>
  );
}

