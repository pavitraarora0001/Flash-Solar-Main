"use client";

import * as React from "react";
import Link from "next/link";
import {
  Inbox,
  TrendingUp,
  Package,
  Mail,
  ShieldCheck,
  Download,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

interface MetricsData {
  totalEnquiries: number;
  newEnquiries: number;
  qualifiedLeads: number;
  wonLeads: number;
  totalProducts: number;
  totalMessages: number;
  unreadMessages: number;
  totalEvents: number;
  statusDistribution: Record<string, number>;
  recentEnquiries: Array<{
    id: string;
    referenceNumber: string;
    fullName: string;
    email: string;
    productOfInterest: string;
    status: string;
    createdAt: string;
  }>;
  recentLogs: Array<{
    id: string;
    userName?: string;
    action: string;
    entityType: string;
    createdAt: string;
  }>;
}

const statusColors: Record<string, string> = {
  NEW: "bg-amber-950/80 text-amber-300 border-amber-800/80",
  CONTACTED: "bg-blue-950/80 text-blue-300 border-blue-800/80",
  QUALIFIED: "bg-indigo-950/80 text-indigo-300 border-indigo-800/80",
  PROPOSAL_SENT: "bg-purple-950/80 text-purple-300 border-purple-800/80",
  NEGOTIATION: "bg-cyan-950/80 text-cyan-300 border-cyan-800/80",
  WON: "bg-emerald-950/80 text-emerald-300 border-emerald-800/80",
  LOST: "bg-rose-950/80 text-rose-300 border-rose-800/80",
};

export default function AdminOverviewPage() {
  const [data, setData] = React.useState<MetricsData | null>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchMetrics = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/metrics");
      const json = await res.json();
      if (json.success) {
        setData(json.metrics);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard metrics:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-midnight-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-ivory-100 tracking-tight">
            Flash Solar Command Center
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-ivory-400">
            Real-time pipeline analytics, engineering enquiries, and product asset management.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-midnight-900 hover:bg-midnight-800 border border-midnight-700 text-xs text-ivory-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-gold-400" : ""}`} />
            <span>Refresh</span>
          </button>

          <a
            href="/api/enquiries/export"
            download
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-midnight-950 text-xs font-semibold transition-colors shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Enquiries */}
        <div className="bg-midnight-900 border border-midnight-700/80 rounded-xl p-5 relative overflow-hidden shadow">
          <div className="flex items-center justify-between text-ivory-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Enquiries</span>
            <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-heading font-extrabold text-ivory-100">
            {data ? data.totalEnquiries : "—"}
          </div>
          <div className="mt-2 text-xs flex items-center gap-1 text-gold-400">
            <Sparkles className="w-3 h-3" />
            <span>{data ? `${data.newEnquiries} awaiting initial triage` : "Loading..."}</span>
          </div>
        </div>

        {/* Qualified Leads */}
        <div className="bg-midnight-900 border border-midnight-700/80 rounded-xl p-5 relative overflow-hidden shadow">
          <div className="flex items-center justify-between text-ivory-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Qualified Pipeline</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-heading font-extrabold text-ivory-100">
            {data ? data.qualifiedLeads : "—"}
          </div>
          <div className="mt-2 text-xs flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            <span>{data ? `${data.wonLeads} deals won to date` : "Loading..."}</span>
          </div>
        </div>

        {/* Catalog Products */}
        <div className="bg-midnight-900 border border-midnight-700/80 rounded-xl p-5 relative overflow-hidden shadow">
          <div className="flex items-center justify-between text-ivory-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Products</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-heading font-extrabold text-ivory-100">
            {data ? data.totalProducts : "—"}
          </div>
          <div className="mt-2 text-xs text-ivory-400">
            LiFePO4, DC House &amp; Hybrid systems
          </div>
        </div>

        {/* Contact Messages */}
        <div className="bg-midnight-900 border border-midnight-700/80 rounded-xl p-5 relative overflow-hidden shadow">
          <div className="flex items-center justify-between text-ivory-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Inbound Messages</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-heading font-extrabold text-ivory-100">
            {data ? data.totalMessages : "—"}
          </div>
          <div className="mt-2 text-xs text-purple-300">
            {data ? `${data.unreadMessages} unread in inbox` : "Loading..."}
          </div>
        </div>
      </div>

      {/* Pipeline Status Distribution Strip */}
      {data && data.statusDistribution && (
        <div className="bg-midnight-900 border border-midnight-800 rounded-xl p-5 shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ivory-300">
              Lead Lifecycle Distribution
            </h3>
            <Link
              href="/admin/enquiries"
              className="text-xs text-gold-400 hover:text-gold-300 inline-flex items-center gap-1"
            >
              <span>Manage Pipeline</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {Object.entries(data.statusDistribution).map(([status, count]) => (
              <div
                key={status}
                className="p-3 rounded-lg bg-midnight-950 border border-midnight-800 text-center"
              >
                <span className="text-[10px] font-mono uppercase text-ivory-400 block mb-1">
                  {status.replace("_", " ")}
                </span>
                <span className="text-lg font-heading font-bold text-ivory-100">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Grid: Recent Enquiries & Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Enquiries */}
        <div className="lg:col-span-8 bg-midnight-900 border border-midnight-800 rounded-xl p-5 sm:p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-heading font-bold text-ivory-100">
                Recent Engineering Enquiries
              </h2>
              <p className="text-xs text-ivory-400">Latest sizing requests submitted by prospective clients</p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-semibold text-gold-400 hover:text-gold-300 inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-midnight-800 text-ivory-400 uppercase font-mono text-[10px]">
                  <th className="py-2.5 px-3">Reference</th>
                  <th className="py-2.5 px-3">Client</th>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-midnight-800/60">
                {data && data.recentEnquiries.length > 0 ? (
                  data.recentEnquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-midnight-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono text-gold-400 font-medium">
                        {enq.referenceNumber}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-ivory-100">{enq.fullName}</div>
                        <div className="text-[11px] text-ivory-400">{enq.email}</div>
                      </td>
                      <td className="py-3 px-3 text-ivory-300 font-medium">{enq.productOfInterest}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                            statusColors[enq.status] || "bg-midnight-800 text-ivory-300"
                          }`}
                        >
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-ivory-400 text-[11px]">
                        {new Date(enq.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-ivory-400">
                      No enquiries registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Security & Operational Logs */}
        <div className="lg:col-span-4 bg-midnight-900 border border-midnight-800 rounded-xl p-5 sm:p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-heading font-bold text-ivory-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>Audit Trail</span>
            </h2>
            <Link
              href="/admin/audit-logs"
              className="text-xs text-gold-400 hover:text-gold-300"
            >
              Full Log
            </Link>
          </div>

          <div className="space-y-3.5">
            {data && data.recentLogs.length > 0 ? (
              data.recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-midnight-950 border border-midnight-800/80 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-gold-400 font-semibold uppercase">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-ivory-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-[11px] text-ivory-300">
                    {log.userName || "System"} • {log.entityType}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-ivory-400 py-6 text-center">No audit records.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
