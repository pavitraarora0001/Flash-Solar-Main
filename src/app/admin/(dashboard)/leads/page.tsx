"use client";

import * as React from "react";
import {
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  AlertTriangle,
  Mail,
  Phone,
  Building,
  DollarSign,
  ChevronRight,
  Filter,
  Search,
} from "lucide-react";
import { DBEnquiry } from "@/lib/db/store";

const STAGES = [
  { key: "NEW", label: "New Leads", color: "border-amber-500/40 text-amber-400 bg-amber-500/10" },
  { key: "CONTACTED", label: "Contacted", color: "border-blue-500/40 text-blue-400 bg-blue-500/10" },
  { key: "QUALIFIED", label: "Engineering Qualified", color: "border-indigo-500/40 text-indigo-400 bg-indigo-500/10" },
  { key: "PROPOSAL_SENT", label: "Proposal Sent", color: "border-purple-500/40 text-purple-400 bg-purple-500/10" },
  { key: "NEGOTIATION", label: "Negotiation", color: "border-cyan-500/40 text-cyan-400 bg-cyan-500/10" },
  { key: "WON", label: "Won / Contracted", color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" },
  { key: "LOST", label: "Archived / Lost", color: "border-rose-500/40 text-rose-400 bg-rose-500/10" },
];

export default function CustomersLeadsPipelinePage() {
  const [enquiries, setEnquiries] = React.useState<DBEnquiry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [selectedEnquiry, setSelectedEnquiry] = React.useState<DBEnquiry | null>(null);
  const [updating, setUpdating] = React.useState(false);

  const fetchLeads = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/enquiries");
      const data = await res.json();
      if (data.success) {
        setEnquiries(data.enquiries);
      }
    } catch (err) {
      console.error("Failed to fetch leads pipeline:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleMoveStatus = async (id: string, newStatus: string) => {
    try {
      setUpdating(true);
      const res = await fetch(`/api/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus as any } : e))
        );
        if (selectedEnquiry?.id === id) {
          setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
      }
    } catch (err) {
      console.error("Error moving lead stage:", err);
    } finally {
      setUpdating(false);
    }
  };

  // Pipeline metrics
  const totalLeads = enquiries.length;
  const wonLeads = enquiries.filter((e) => e.status === "WON").length;
  const qualifiedLeads = enquiries.filter((e) => e.status === "QUALIFIED" || e.status === "PROPOSAL_SENT" || e.status === "NEGOTIATION").length;
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : "0.0";

  const filteredEnquiries = enquiries.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      e.fullName.toLowerCase().includes(q) ||
      e.referenceNumber.toLowerCase().includes(q) ||
      (e.company && e.company.toLowerCase().includes(q)) ||
      e.productOfInterest.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-midnight-800">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-ivory-100 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-gold-400" />
            <span>Customers &amp; Commercial Leads CRM</span>
          </h2>
          <p className="text-xs text-ivory-400 mt-1">
            Visual commercial pipeline tracking prospective clean power sizing requests from initial inquiry to contracted engineering delivery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-ivory-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads by name, company, ref..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-midnight-900 border border-midnight-700 text-ivory-100 text-xs focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-midnight-900 border border-midnight-800 p-4 rounded-2xl shadow">
          <span className="text-[10px] font-mono text-ivory-400 uppercase tracking-wider block">Total Pipeline</span>
          <span className="text-2xl font-heading font-bold text-ivory-100 block mt-1">{totalLeads}</span>
          <span className="text-[10px] text-ivory-400 mt-1 block">Active Engineering Enquiries</span>
        </div>
        <div className="bg-midnight-900 border border-midnight-800 p-4 rounded-2xl shadow">
          <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">Qualified Opportunities</span>
          <span className="text-2xl font-heading font-bold text-indigo-300 block mt-1">{qualifiedLeads}</span>
          <span className="text-[10px] text-ivory-400 mt-1 block">In Advanced Technical Sizing</span>
        </div>
        <div className="bg-midnight-900 border border-midnight-800 p-4 rounded-2xl shadow">
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">Won / Contracted</span>
          <span className="text-2xl font-heading font-bold text-emerald-400 block mt-1">{wonLeads}</span>
          <span className="text-[10px] text-ivory-400 mt-1 block">Successfully Delivered Microgrids</span>
        </div>
        <div className="bg-midnight-900 border border-midnight-800 p-4 rounded-2xl shadow">
          <span className="text-[10px] font-mono text-gold-400 uppercase tracking-wider block">Conversion Yield</span>
          <span className="text-2xl font-heading font-bold text-gold-400 block mt-1">{conversionRate}%</span>
          <span className="text-[10px] text-ivory-400 mt-1 block">Inquiry to Contract Conversion</span>
        </div>
      </div>

      {/* Visual Pipeline Board (Horizontal Stages) */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1200px]">
          {STAGES.map((stage) => {
            const stageLeads = filteredEnquiries.filter((e) => e.status === stage.key);

            return (
              <div
                key={stage.key}
                className="w-72 shrink-0 bg-midnight-900/90 border border-midnight-800 rounded-2xl p-3 flex flex-col shadow-lg"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-midnight-800">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${stage.color}`}>
                      {stage.label}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-ivory-300">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards List in Stage */}
                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[600px] pr-0.5">
                  {stageLeads.length === 0 ? (
                    <div className="p-4 text-center text-ivory-500 text-[11px] border border-dashed border-midnight-800 rounded-xl">
                      No leads in stage
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedEnquiry(lead)}
                        className="bg-midnight-950 border border-midnight-800 hover:border-gold-500/50 rounded-xl p-3 cursor-pointer transition-all shadow hover:shadow-md space-y-2 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono text-gold-400 font-bold">
                            {lead.referenceNumber}
                          </span>
                          <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded ${
                            lead.priority === "URGENT" || lead.priority === "HIGH"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : "bg-midnight-800 text-ivory-400"
                          }`}>
                            {lead.priority || "MEDIUM"}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-heading font-bold text-ivory-100 group-hover:text-gold-300 transition-colors">
                            {lead.fullName}
                          </h4>
                          {lead.company && (
                            <span className="text-[10px] text-ivory-400 flex items-center gap-1 mt-0.5">
                              <Building className="w-2.5 h-2.5" />
                              <span className="truncate">{lead.company}</span>
                            </span>
                          )}
                        </div>

                        <div className="text-[10px] text-ivory-300 font-mono bg-midnight-900/80 p-1.5 rounded border border-midnight-800/60 space-y-0.5">
                          <span className="block truncate text-gold-400 font-semibold">{lead.productOfInterest}</span>
                          {lead.estimatedPowerReq && (
                            <span className="block text-ivory-400">Power: {lead.estimatedPowerReq}</span>
                          )}
                        </div>

                        {/* Quick Action to Move Next */}
                        <div className="pt-2 border-t border-midnight-850 flex items-center justify-between text-[10px]">
                          <span className="text-ivory-500 font-mono">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const currentIdx = STAGES.findIndex((s) => s.key === lead.status);
                              if (currentIdx < STAGES.length - 1) {
                                handleMoveStatus(lead.id, STAGES[currentIdx + 1].key);
                              }
                            }}
                            className="text-ivory-400 hover:text-gold-400 flex items-center gap-0.5 font-semibold"
                            title="Advance to next pipeline stage"
                          >
                            <span>Advance</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer / Lead Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-midnight-900 border border-midnight-700 rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-midnight-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-gold-400 font-bold block uppercase tracking-widest">
                  Lead Profile • Ref: {selectedEnquiry.referenceNumber}
                </span>
                <h3 className="font-heading font-bold text-base text-ivory-100">
                  {selectedEnquiry.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-ivory-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-midnight-950 p-3 rounded-xl border border-midnight-800 font-mono">
                <div>
                  <span className="text-[10px] text-ivory-400 block uppercase">Email</span>
                  <a href={`mailto:${selectedEnquiry.email}`} className="text-gold-400 hover:underline truncate block">
                    {selectedEnquiry.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-ivory-400 block uppercase">Phone</span>
                  <a href={`tel:${selectedEnquiry.phone}`} className="text-ivory-200 hover:underline block">
                    {selectedEnquiry.phone}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-ivory-400 block uppercase">Location</span>
                  <span className="text-ivory-200">{selectedEnquiry.city ? `${selectedEnquiry.city}, ` : ""}{selectedEnquiry.country || "Global"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ivory-400 block uppercase">Company</span>
                  <span className="text-ivory-200">{selectedEnquiry.company || "Independent"}</span>
                </div>
              </div>

              <div>
                <span className="text-ivory-400 font-semibold block mb-1">Target Product & Technical Requirements:</span>
                <div className="bg-midnight-950 p-3 rounded-xl border border-midnight-800 space-y-1">
                  <div className="text-gold-400 font-bold">{selectedEnquiry.productOfInterest}</div>
                  <div className="text-ivory-300">Project Type: {selectedEnquiry.projectType || "General Consultation"}</div>
                  <div className="text-ivory-300">Estimated Power: {selectedEnquiry.estimatedPowerReq || "Not Specified"}</div>
                  <div className="text-ivory-300">Daily Demand: {selectedEnquiry.estimatedDailyEnergy || "Not Specified"}</div>
                </div>
              </div>

              <div>
                <span className="text-ivory-400 font-semibold block mb-1">Client Ingestion Note:</span>
                <p className="bg-midnight-950 p-3 rounded-xl border border-midnight-800 text-ivory-200 leading-relaxed italic">
                  &quot;{selectedEnquiry.message}&quot;
                </p>
              </div>

              {selectedEnquiry.internalNotes && (
                <div>
                  <span className="text-ivory-400 font-semibold block mb-1">Internal Engineering Sizing Notes:</span>
                  <p className="bg-midnight-950 p-3 rounded-xl border border-midnight-800 text-amber-200/90 font-mono text-[11px]">
                    {selectedEnquiry.internalNotes}
                  </p>
                </div>
              )}

              {/* Status Selector */}
              <div className="pt-2">
                <span className="text-ivory-400 font-semibold block mb-1">Update Pipeline Stage:</span>
                <div className="flex flex-wrap gap-1.5">
                  {STAGES.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => handleMoveStatus(selectedEnquiry.id, s.key)}
                      disabled={updating}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all border ${
                        selectedEnquiry.status === s.key
                          ? `${s.color} ring-1 ring-gold-500`
                          : "bg-midnight-950 border-midnight-800 text-ivory-400 hover:text-white"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-midnight-800 text-xs">
              <span className="text-ivory-500 font-mono text-[10px]">
                Created: {new Date(selectedEnquiry.createdAt).toLocaleString()}
              </span>

              <div className="flex gap-2">
                <a
                  href={`mailto:${selectedEnquiry.email}?subject=Flash Solar Inquiry Ref: ${selectedEnquiry.referenceNumber}`}
                  className="px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-midnight-950 font-bold transition-colors"
                >
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
