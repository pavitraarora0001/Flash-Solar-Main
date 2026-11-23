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
  Calendar,
  Users,
  Award,
  BookOpen,
  Wrench,
  AlertTriangle,
  Upload,
  Cpu,
  Globe,
  Sliders,
  DollarSign,
} from "lucide-react";

interface MetricsData {
  totalEnquiries: number;
  newEnquiries: number;
  qualifiedLeads: number;
  wonProjects: number;
  lostLeads: number;
  totalProducts: number;
  publishedServices: number;
  publishedArticles: number;
  totalResourceDownloads: number;
  websiteVisitors: number;
  conversionRate: string;
  totalMessages: number;
  unreadMessages: number;
  statusDistribution: Record<string, number>;
  productInterest: Record<string, number>;
  followUpReminders: Array<{
    id: string;
    referenceNumber: string;
    fullName: string;
    company?: string;
    followUpDate: string;
    status: string;
  }>;
  trendBuckets: Array<{ label: string; count: number }>;
  recentEnquiries: Array<{
    id: string;
    referenceNumber: string;
    fullName: string;
    company?: string;
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
  NEW: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  CONTACTED: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  QUALIFIED: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
  PROPOSAL_SENT: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  NEGOTIATION: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
  WON: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  LOST: "bg-rose-500/20 text-rose-300 border-rose-500/40",
};

export default function AdminOverviewPage() {
  const [data, setData] = React.useState<MetricsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [period, setPeriod] = React.useState<"today" | "7d" | "30d" | "90d" | "all">("30d");

  const fetchMetrics = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/metrics?period=${period}`);
      const json = await res.json();
      if (json.success) {
        setData(json.metrics);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard metrics:", err);
    } finally {
      setLoading(false);
    }
  }, [period]);

  React.useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Welcome & Date Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-midnight-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 bg-gold-500/10 border border-gold-500/30 px-2 py-0.5 rounded font-bold">
              Sub-60V Direct-Current Architecture Platform
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-ivory-100 tracking-tight mt-1">
            Flash Solar Executive Command Center
          </h1>
          <p className="mt-1 text-xs text-ivory-400">
            Real-time pipeline analytics, database-driven commercial metrics, and content management.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Period selector */}
          <div className="flex items-center bg-midnight-900 border border-midnight-700 p-1 rounded-xl text-xs font-semibold">
            {(["today", "7d", "30d", "90d", "all"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg transition-all capitalize ${
                  period === p
                    ? "bg-gold-500 text-midnight-950 font-bold shadow"
                    : "text-ivory-400 hover:text-white"
                }`}
              >
                {p === "today" ? "Today" : p === "all" ? "All Time" : `Last ${p}`}
              </button>
            ))}
          </div>

          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="p-2 rounded-xl bg-midnight-900 hover:bg-midnight-800 border border-midnight-700 text-ivory-300 hover:text-white transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-gold-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid (Real Database Figures) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-midnight-900 border border-midnight-800 p-4 rounded-2xl shadow">
          <span className="text-[10px] font-mono text-ivory-400 uppercase tracking-wider block">Total Enquiries</span>
          <span className="text-2xl font-heading font-bold text-ivory-100 block mt-1">
            {data ? data.totalEnquiries : "—"}
          </span>
          <span className="text-[10px] text-ivory-400 mt-1 block">In period</span>
        </div>

        <div className="bg-midnight-900 border border-midnight-800 p-4 rounded-2xl shadow">
          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">New Inquiries</span>
          <span className="text-2xl font-heading font-bold text-amber-300 block mt-1">
            {data ? data.newEnquiries : "—"}
          </span>
          <span className="text-[10px] text-ivory-400 mt-1 block">Pending Review</span>
        </div>

        <div className="bg-midnight-900 border border-midnight-800 p-4 rounded-2xl shadow">
          <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">Qualified Leads</span>
          <span className="text-2xl font-heading font-bold text-indigo-300 block mt-1">
            {data ? data.qualifiedLeads : "—"}
          </span>
          <span className="text-[10px] text-ivory-400 mt-1 block">Technical Sizing</span>
        </div>

        <div className="bg-midnight-900 border border-midnight-800 p-4 rounded-2xl shadow">
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">Won Projects</span>
          <span className="text-2xl font-heading font-bold text-emerald-400 block mt-1">
            {data ? data.wonProjects : "—"}
          </span>
          <span className="text-[10px] text-ivory-400 mt-1 block">Contracted Systems</span>
        </div>

        <div className="bg-midnight-900 border border-midnight-800 p-4 rounded-2xl shadow">
          <span className="text-[10px] font-mono text-gold-400 uppercase tracking-wider block">Downloads</span>
          <span className="text-2xl font-heading font-bold text-gold-400 block mt-1">
            {data ? data.totalResourceDownloads : "—"}
          </span>
          <span className="text-[10px] text-ivory-400 mt-1 block">Datasheets &amp; Guides</span>
        </div>

        <div className="bg-midnight-900 border border-midnight-800 p-4 rounded-2xl shadow">
          <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block">Conversion Yield</span>
          <span className="text-2xl font-heading font-bold text-purple-400 block mt-1">
            {data ? `${data.conversionRate}%` : "—"}
          </span>
          <span className="text-[10px] text-ivory-400 mt-1 block">Lead Ratio</span>
        </div>
      </div>

      {/* Secondary Operational Counts Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-midnight-900/60 border border-midnight-800/80 p-3 rounded-2xl text-xs">
        <div className="flex items-center gap-2.5 px-3 py-1">
          <Package className="w-4 h-4 text-gold-400" />
          <div>
            <span className="text-ivory-400 text-[10px] block">Active Catalog Products</span>
            <span className="font-bold text-ivory-100">{data?.totalProducts || 0} Engineered Systems</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-3 py-1">
          <Wrench className="w-4 h-4 text-blue-400" />
          <div>
            <span className="text-ivory-400 text-[10px] block">Published Services</span>
            <span className="font-bold text-ivory-100">{data?.publishedServices || 0} Engineering Offerings</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-3 py-1">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="text-ivory-400 text-[10px] block">Published Articles</span>
            <span className="font-bold text-ivory-100">{data?.publishedArticles || 0} Technical Posts</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-3 py-1">
          <Mail className="w-4 h-4 text-purple-400" />
          <div>
            <span className="text-ivory-400 text-[10px] block">Inbound Messages</span>
            <span className="font-bold text-ivory-100">{data?.totalMessages || 0} Messages ({data?.unreadMessages || 0} unread)</span>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="bg-midnight-900 border border-midnight-800 p-5 rounded-2xl space-y-3 shadow-xl">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ivory-400">
          Quick Management Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          <Link
            href="/admin/cms"
            className="p-3 rounded-xl bg-midnight-950 border border-midnight-800 hover:border-gold-500/40 text-left transition-colors group"
          >
            <Globe className="w-4 h-4 text-gold-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-ivory-100 block">Edit Website</span>
            <span className="text-[10px] text-ivory-400">Homepage copy &amp; CTA</span>
          </Link>
          <Link
            href="/admin/products"
            className="p-3 rounded-xl bg-midnight-950 border border-midnight-800 hover:border-gold-500/40 text-left transition-colors group"
          >
            <Package className="w-4 h-4 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-ivory-100 block">New Product</span>
            <span className="text-[10px] text-ivory-400">Add battery or solar</span>
          </Link>
          <Link
            href="/admin/engineering"
            className="p-3 rounded-xl bg-midnight-950 border border-midnight-800 hover:border-gold-500/40 text-left transition-colors group"
          >
            <Cpu className="w-4 h-4 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-ivory-100 block">DC Stages</span>
            <span className="text-[10px] text-ivory-400">Manage 5 journey steps</span>
          </Link>
          <Link
            href="/admin/media"
            className="p-3 rounded-xl bg-midnight-950 border border-midnight-800 hover:border-gold-500/40 text-left transition-colors group"
          >
            <Upload className="w-4 h-4 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-ivory-100 block">Upload Media</span>
            <span className="text-[10px] text-ivory-400">Add photos &amp; diagrams</span>
          </Link>
          <Link
            href="/admin/leads"
            className="p-3 rounded-xl bg-midnight-950 border border-midnight-800 hover:border-gold-500/40 text-left transition-colors group"
          >
            <Users className="w-4 h-4 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-ivory-100 block">Lead Pipeline</span>
            <span className="text-[10px] text-ivory-400">CRM Kanban board</span>
          </Link>
          <Link
            href="/admin/blog"
            className="p-3 rounded-xl bg-midnight-950 border border-midnight-800 hover:border-gold-500/40 text-left transition-colors group"
          >
            <BookOpen className="w-4 h-4 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-ivory-100 block">Write Article</span>
            <span className="text-[10px] text-ivory-400">Technical whitepaper</span>
          </Link>
        </div>
      </div>

      {/* Visual Charts & Distributions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Enquiry Stage Funnel Bar Chart */}
        <div className="lg:col-span-8 bg-midnight-900 border border-midnight-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-midnight-800 pb-3">
            <div>
              <h3 className="font-heading font-bold text-sm text-ivory-100">
                Commercial Pipeline Conversion Funnel
              </h3>
              <p className="text-xs text-ivory-400">
                Lead distribution across lifecycle milestones based on real database records.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {data &&
              Object.entries(data.statusDistribution).map(([status, count]) => {
                const total = Math.max(1, data.totalEnquiries);
                const percent = ((count / total) * 100).toFixed(0);

                return (
                  <div key={status} className="space-y-1 text-xs">
                    <div className="flex justify-between font-mono">
                      <span className="text-ivory-300 font-semibold">{status}</span>
                      <span className="text-gold-400 font-bold">{count} leads ({percent}%)</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-midnight-950 overflow-hidden border border-midnight-800">
                      <div
                        className="h-full bg-gradient-to-r from-gold-500 to-amber-400 rounded-full transition-all duration-700"
                        style={{ width: `${Math.max(4, Number(percent))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Product Interest & Follow-Up Reminders */}
        <div className="lg:col-span-4 space-y-6">
          {/* Product Interest Distribution */}
          <div className="bg-midnight-900 border border-midnight-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-ivory-400">
              Product Ingestion Interest
            </h3>
            <div className="space-y-2">
              {data && Object.keys(data.productInterest).length > 0 ? (
                Object.entries(data.productInterest).map(([prod, count]) => (
                  <div key={prod} className="flex items-center justify-between text-xs bg-midnight-950 p-2.5 rounded-xl border border-midnight-800">
                    <span className="font-semibold text-ivory-200 truncate max-w-[160px]">{prod}</span>
                    <span className="font-mono text-gold-400 font-bold">{count} inquiries</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-ivory-500 text-xs">No product submissions in period.</div>
              )}
            </div>
          </div>

          {/* Follow-Up Reminders */}
          <div className="bg-midnight-900 border border-midnight-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-ivory-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              <span>Follow-Up Reminders</span>
            </h3>
            <div className="space-y-2">
              {data && data.followUpReminders.length > 0 ? (
                data.followUpReminders.map((rem) => (
                  <div key={rem.id} className="bg-midnight-950 p-2.5 rounded-xl border border-midnight-800 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-ivory-100">{rem.fullName}</span>
                      <span className="text-[10px] font-mono text-gold-400 font-bold">{rem.followUpDate}</span>
                    </div>
                    <span className="text-[10px] text-ivory-400 block">{rem.company || "Independent"} • Ref: {rem.referenceNumber}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-ivory-500 text-xs">No pending follow-up schedules.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Enquiries & Audit Trail Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Enquiries Table */}
        <div className="lg:col-span-7 bg-midnight-900 border border-midnight-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-midnight-800 flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-ivory-100">
              Recent Engineering Inquiries
            </h3>
            <Link href="/admin/enquiries" className="text-xs text-gold-400 hover:underline flex items-center gap-1 font-semibold">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-midnight-950/80 text-ivory-400 font-mono text-[10px] uppercase border-b border-midnight-800">
                <tr>
                  <th className="py-2.5 px-3">Ref</th>
                  <th className="py-2.5 px-3">Client</th>
                  <th className="py-2.5 px-3">Target System</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-midnight-800/60">
                {data?.recentEnquiries.map((e) => (
                  <tr key={e.id} className="hover:bg-midnight-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-gold-400 font-semibold">{e.referenceNumber}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-ivory-100 block">{e.fullName}</span>
                      <span className="text-[10px] text-ivory-400">{e.company || "Independent"}</span>
                    </td>
                    <td className="py-2.5 px-3 text-ivory-300 font-mono text-[11px] truncate max-w-[140px]">{e.productOfInterest}</td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-mono border ${statusColors[e.status] || "bg-midnight-800 text-ivory-300"}`}>
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Admin Audit Logs */}
        <div className="lg:col-span-5 bg-midnight-900 border border-midnight-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-midnight-800 pb-3">
            <h3 className="font-heading font-bold text-sm text-ivory-100">
              Administrative Activity Trail
            </h3>
            <Link href="/admin/audit-logs" className="text-xs text-gold-400 hover:underline flex items-center gap-1 font-semibold">
              <span>All Logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-80">
            {data?.recentLogs.map((log) => (
              <div key={log.id} className="text-xs p-2.5 rounded-xl bg-midnight-950/80 border border-midnight-800/70 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-gold-400 font-bold text-[10px]">{log.action}</span>
                  <span className="text-[9px] font-mono text-ivory-500">{new Date(log.createdAt).toLocaleTimeString()}</span>
                </div>
                <div className="text-ivory-300 text-[11px]">
                  <span className="font-semibold text-ivory-100">{log.userName || "Admin"}</span> updated {log.entityType}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
