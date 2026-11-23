"use client";

import * as React from "react";
import { BarChart3, TrendingUp, Monitor, Smartphone, Globe, RefreshCw } from "lucide-react";

interface AnalyticsSummary {
  totalEvents: number;
  pageViews: number;
  ctaClicks: number;
  enquirySubmits: number;
  resourceDownloads: number;
  conversionRate: string;
  topPaths: Array<{ path: string; count: number }>;
  devices: Record<string, number>;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = React.useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchAnalytics = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/analytics/summary");
      const json = await res.json();
      if (json.success) {
        setData(json.summary);
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-midnight-800">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-ivory-100 tracking-tight">
            Privacy-First Telemetry &amp; Analytics
          </h1>
          <p className="text-xs text-ivory-400 mt-1">
            First-party engagement signals without third-party tracking cookies or personal data harvesting.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-midnight-900 hover:bg-midnight-800 border border-midnight-700 text-xs text-ivory-300 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-gold-400" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-midnight-900 border border-midnight-800 rounded-xl p-5 shadow">
          <span className="text-xs text-ivory-400 font-semibold uppercase tracking-wider block">
            Total Page Views
          </span>
          <div className="text-3xl font-heading font-extrabold text-ivory-100 mt-2">
            {data ? data.pageViews : "—"}
          </div>
          <p className="text-[11px] text-ivory-400 mt-1">First-party session loads</p>
        </div>

        <div className="bg-midnight-900 border border-midnight-800 rounded-xl p-5 shadow">
          <span className="text-xs text-ivory-400 font-semibold uppercase tracking-wider block">
            CTA Interactions
          </span>
          <div className="text-3xl font-heading font-extrabold text-gold-400 mt-2">
            {data ? data.ctaClicks : "—"}
          </div>
          <p className="text-[11px] text-ivory-400 mt-1">Sizing calculator &amp; quote clicks</p>
        </div>

        <div className="bg-midnight-900 border border-midnight-800 rounded-xl p-5 shadow">
          <span className="text-xs text-ivory-400 font-semibold uppercase tracking-wider block">
            Sizing Enquiries Logged
          </span>
          <div className="text-3xl font-heading font-extrabold text-emerald-400 mt-2">
            {data ? data.enquirySubmits : "—"}
          </div>
          <p className="text-[11px] text-ivory-400 mt-1">Direct project submissions</p>
        </div>

        <div className="bg-midnight-900 border border-midnight-800 rounded-xl p-5 shadow">
          <span className="text-xs text-ivory-400 font-semibold uppercase tracking-wider block">
            Visitor Conversion
          </span>
          <div className="text-3xl font-heading font-extrabold text-purple-400 mt-2">
            {data ? data.conversionRate : "—"}
          </div>
          <p className="text-[11px] text-ivory-400 mt-1">Views to completed enquiry</p>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Paths */}
        <div className="bg-midnight-900 border border-midnight-800 rounded-xl p-5 shadow">
          <h3 className="text-sm font-heading font-bold text-ivory-100 mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-gold-400" />
            <span>Top Visited Sections &amp; Paths</span>
          </h3>
          <div className="space-y-2">
            {data && data.topPaths.length > 0 ? (
              data.topPaths.map((p) => (
                <div
                  key={p.path}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-midnight-950 border border-midnight-800 text-xs"
                >
                  <span className="font-mono text-ivory-300">{p.path}</span>
                  <span className="font-mono font-semibold text-gold-400">{p.count} views</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-ivory-400 py-4 text-center">No path telemetry yet.</p>
            )}
          </div>
        </div>

        {/* Device Categories */}
        <div className="bg-midnight-900 border border-midnight-800 rounded-xl p-5 shadow">
          <h3 className="text-sm font-heading font-bold text-ivory-100 mb-3 flex items-center gap-2">
            <Monitor className="w-4 h-4 text-gold-400" />
            <span>Client Platform Distribution</span>
          </h3>
          <div className="space-y-2">
            {data &&
              Object.entries(data.devices).map(([device, count]) => (
                <div
                  key={device}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-midnight-950 border border-midnight-800 text-xs"
                >
                  <span className="capitalize text-ivory-300">{device}</span>
                  <span className="font-mono font-semibold text-ivory-100">{count} events</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
