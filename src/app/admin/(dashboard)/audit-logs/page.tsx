"use client";

import * as React from "react";
import { ShieldCheck, Clock, User } from "lucide-react";
import { DBAuditLog } from "@/lib/db/store";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = React.useState<DBAuditLog[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/metrics");
        const json = await res.json();
        if (json.success) {
          setLogs(json.metrics.recentLogs);
        }
      } catch (err) {
        console.error("Failed to load audit logs:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="pb-4 border-b border-midnight-800">
        <h1 className="text-2xl font-heading font-extrabold text-ivory-100 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-gold-400" />
          <span>Security &amp; Operational Audit Trail</span>
        </h1>
        <p className="text-xs text-ivory-400 mt-1">
          Tamper-evident logs of administrative actions, auth events, and status updates.
        </p>
      </div>

      <div className="bg-midnight-900 border border-midnight-800 rounded-xl overflow-hidden shadow">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-midnight-800 bg-midnight-950/60 text-ivory-400 uppercase font-mono text-[10px]">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Operator</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Entity</th>
              <th className="py-3 px-4">Metadata</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-midnight-800/60">
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-midnight-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-ivory-400 text-[11px]">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-ivory-100">
                    {log.userName || "System"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-midnight-950 border border-gold-500/30 text-gold-400 font-semibold uppercase">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-ivory-300 font-mono text-[11px]">
                    {log.entityType} {log.entityId ? `(${log.entityId})` : ""}
                  </td>
                  <td className="py-3.5 px-4 text-ivory-400 font-mono text-[10px] max-w-xs truncate">
                    {log.metadata ? JSON.stringify(log.metadata) : "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-ivory-400">
                  {loading ? "Loading audit trail..." : "No audit records registered."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
