"use client";

import * as React from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  RefreshCw,
  Mail,
  Phone,
  Building,
  MapPin,
  X,
  Save,
  Zap,
} from "lucide-react";

interface Enquiry {
  id: string;
  referenceNumber: string;
  fullName: string;
  company?: string;
  email: string;
  phone: string;
  country?: string;
  city?: string;
  productOfInterest: string;
  projectType?: string;
  estimatedPowerReq?: string;
  estimatedDailyEnergy?: string;
  message: string;
  status: string;
  internalNotes?: string;
  assignedToId?: string;
  createdAt: string;
  updatedAt: string;
}

const ALL_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "WON",
  "LOST",
];

const statusStyles: Record<string, string> = {
  NEW: "bg-amber-950/80 text-amber-300 border-amber-800",
  CONTACTED: "bg-blue-950/80 text-blue-300 border-blue-800",
  QUALIFIED: "bg-indigo-950/80 text-indigo-300 border-indigo-800",
  PROPOSAL_SENT: "bg-purple-950/80 text-purple-300 border-purple-800",
  NEGOTIATION: "bg-cyan-950/80 text-cyan-300 border-cyan-800",
  WON: "bg-emerald-950/80 text-emerald-300 border-emerald-800",
  LOST: "bg-rose-950/80 text-rose-300 border-rose-800",
};

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = React.useState<Enquiry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("ALL");
  const [selectedEnquiry, setSelectedEnquiry] = React.useState<Enquiry | null>(null);
  const [updatingNotes, setUpdatingNotes] = React.useState(false);
  const [internalNotes, setInternalNotes] = React.useState("");
  const [updatingStatusId, setUpdatingStatusId] = React.useState<string | null>(null);

  const fetchEnquiries = React.useCallback(async () => {
    try {
      setLoading(true);
      const url = new URL("/api/enquiries", window.location.origin);
      if (selectedStatus !== "ALL") {
        url.searchParams.set("status", selectedStatus);
      }
      if (search) {
        url.searchParams.set("search", search);
      }
      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setEnquiries(data.enquiries);
      }
    } catch (err) {
      console.error("Failed to load enquiries:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, search]);

  React.useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const handleStatusChange = async (enquiryId: string, newStatus: string) => {
    try {
      setUpdatingStatusId(enquiryId);
      const res = await fetch(`/api/enquiries/${enquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
        );
        if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
          setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    try {
      setUpdatingNotes(true);
      const res = await fetch(`/api/enquiries/${selectedEnquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internalNotes }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedEnquiry((prev) => (prev ? { ...prev, internalNotes } : null));
        setEnquiries((prev) =>
          prev.map((e) => (e.id === selectedEnquiry.id ? { ...e, internalNotes } : e))
        );
      }
    } catch (err) {
      console.error("Failed to save notes:", err);
    } finally {
      setUpdatingNotes(false);
    }
  };

  const openDetailModal = (enq: Enquiry) => {
    setSelectedEnquiry(enq);
    setInternalNotes(enq.internalNotes || "");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-midnight-800">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-ivory-100 tracking-tight">
            Lead &amp; Enquiry Pipeline
          </h1>
          <p className="text-xs text-ivory-400 mt-1">
            Manage prospective clean energy clients, technical sizing requests, and quotation stages.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchEnquiries}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-midnight-900 hover:bg-midnight-800 border border-midnight-700 text-xs text-ivory-300 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-gold-400" : ""}`} />
            <span>Refresh</span>
          </button>

          <a
            href="/api/enquiries/export"
            download
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-midnight-950 text-xs font-semibold transition-colors shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-midnight-900 border border-midnight-800 rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ivory-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ref, name, email, company..."
            className="w-full pl-9 pr-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-xs text-ivory-100 placeholder-midnight-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-ivory-400 shrink-0" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-xs text-ivory-200 focus:outline-none focus:ring-1 focus:ring-gold-500"
          >
            <option value="ALL">All Stages ({enquiries.length})</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-midnight-900 border border-midnight-800 rounded-xl overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-midnight-800 bg-midnight-950/60 text-ivory-400 uppercase font-mono text-[10px]">
                <th className="py-3 px-4">Tracking Ref</th>
                <th className="py-3 px-4">Client Name &amp; Email</th>
                <th className="py-3 px-4">Product / System</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Pipeline Status</th>
                <th className="py-3 px-4">Received</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-midnight-800/60">
              {enquiries.length > 0 ? (
                enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-midnight-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-gold-400">
                      {enq.referenceNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-ivory-100">{enq.fullName}</div>
                      <div className="text-[11px] text-ivory-400 flex items-center gap-2 mt-0.5">
                        <span>{enq.email}</span>
                        {enq.company && (
                          <span className="text-[10px] text-ivory-400 font-mono">({enq.company})</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-ivory-200 font-medium block">{enq.productOfInterest}</span>
                      {enq.estimatedPowerReq && (
                        <span className="text-[10px] text-gold-400/80 font-mono block">
                          Req: {enq.estimatedPowerReq}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-ivory-400 text-[11px]">
                      {enq.city ? `${enq.city}, ` : ""}{enq.country || "Global"}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={enq.status}
                        disabled={updatingStatusId === enq.id}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                        className={`text-[10px] font-mono px-2 py-1 rounded border focus:outline-none cursor-pointer ${
                          statusStyles[enq.status] || "bg-midnight-800 text-ivory-300"
                        }`}
                      >
                        {ALL_STATUSES.map((s) => (
                          <option key={s} value={s} className="bg-midnight-900 text-ivory-100">
                            {s.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-ivory-400 text-[11px]">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openDetailModal(enq)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-midnight-800 hover:bg-midnight-700 text-ivory-200 border border-midnight-700 text-xs transition-colors"
                        title="View Full Sizing Specs"
                      >
                        <Eye className="w-3.5 h-3.5 text-gold-400" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-ivory-400">
                    {loading ? "Loading enquiries..." : "No matching enquiries found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enquiry Detail Drawer / Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-midnight-900 border border-midnight-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-midnight-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 font-semibold block">
                  Technical Sizing Intake
                </span>
                <h3 className="text-xl font-heading font-bold text-ivory-100 flex items-center gap-2 mt-0.5">
                  <span>{selectedEnquiry.referenceNumber}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      statusStyles[selectedEnquiry.status]
                    }`}
                  >
                    {selectedEnquiry.status}
                  </span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 rounded-lg text-ivory-400 hover:text-white hover:bg-midnight-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Client Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-midnight-950 p-4 rounded-xl border border-midnight-800">
              <div className="space-y-1">
                <span className="text-ivory-400 text-[10px] uppercase font-mono block">Contact Name</span>
                <p className="font-semibold text-ivory-100 text-sm">{selectedEnquiry.fullName}</p>
                {selectedEnquiry.company && (
                  <p className="text-ivory-400 flex items-center gap-1">
                    <Building className="w-3 h-3 text-gold-400" />
                    <span>{selectedEnquiry.company}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-ivory-400 text-[10px] uppercase font-mono block">Direct Channels</span>
                <p className="text-ivory-300 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-gold-400" />
                  <a href={`mailto:${selectedEnquiry.email}`} className="hover:underline text-gold-400">
                    {selectedEnquiry.email}
                  </a>
                </p>
                <p className="text-ivory-300 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-gold-400" />
                  <span>{selectedEnquiry.phone}</span>
                </p>
              </div>

              <div className="space-y-1 pt-2 border-t border-midnight-800">
                <span className="text-ivory-400 text-[10px] uppercase font-mono block">System of Interest</span>
                <p className="font-semibold text-ivory-100 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-gold-400" />
                  <span>{selectedEnquiry.productOfInterest}</span>
                </p>
              </div>

              <div className="space-y-1 pt-2 border-t border-midnight-800">
                <span className="text-ivory-400 text-[10px] uppercase font-mono block">Installation Site</span>
                <p className="text-ivory-300 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-gold-400" />
                  <span>
                    {selectedEnquiry.city ? `${selectedEnquiry.city}, ` : ""}
                    {selectedEnquiry.country || "Global"}
                  </span>
                </p>
              </div>
            </div>

            {/* Electrical Sizing Specifications */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-ivory-300">
                Project Sizing Specifications
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-midnight-950 border border-midnight-800">
                  <span className="text-[10px] text-ivory-400 block font-mono">Project Type</span>
                  <span className="font-semibold text-ivory-100">{selectedEnquiry.projectType || "General"}</span>
                </div>
                <div className="p-3 rounded-lg bg-midnight-950 border border-midnight-800">
                  <span className="text-[10px] text-ivory-400 block font-mono">Peak Inverter Load</span>
                  <span className="font-semibold text-gold-400">{selectedEnquiry.estimatedPowerReq || "Unspecified"}</span>
                </div>
                <div className="p-3 rounded-lg bg-midnight-950 border border-midnight-800">
                  <span className="text-[10px] text-ivory-400 block font-mono">Daily Energy Consumption</span>
                  <span className="font-semibold text-emerald-400">{selectedEnquiry.estimatedDailyEnergy || "Unspecified"}</span>
                </div>
              </div>
            </div>

            {/* Scope / Message Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-ivory-300">
                Client Project Description
              </h4>
              <div className="p-4 rounded-xl bg-midnight-950 border border-midnight-800 text-xs text-ivory-300 leading-relaxed font-sans">
                {selectedEnquiry.message}
              </div>
            </div>

            {/* Internal Engineering Notes */}
            <div className="space-y-2 pt-2 border-t border-midnight-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400">
                  Internal Engineering &amp; Sizing Notes
                </h4>
                <button
                  onClick={handleSaveNotes}
                  disabled={updatingNotes}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-midnight-950 text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{updatingNotes ? "Saving..." : "Save Notes"}</span>
                </button>
              </div>
              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Log engineering sizing calculations, battery string sizing, quotation reference, or follow-up milestones..."
                rows={4}
                className="w-full p-3 bg-midnight-950 border border-midnight-700 rounded-lg text-xs text-ivory-100 placeholder-midnight-500 focus:outline-none focus:ring-1 focus:ring-gold-500 font-sans"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
