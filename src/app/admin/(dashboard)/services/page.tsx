"use client";

import * as React from "react";
import { Wrench, CheckCircle2 } from "lucide-react";
import { DBService } from "@/lib/db/store";

export default function AdminServicesPage() {
  const [services, setServices] = React.useState<DBService[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        if (data.success) {
          setServices(data.services);
        }
      } catch (err) {
        console.error("Failed to load services:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="pb-4 border-b border-midnight-800">
        <h1 className="text-2xl font-heading font-extrabold text-ivory-100 tracking-tight">
          Engineering &amp; Turnkey Services
        </h1>
        <p className="text-xs text-ivory-400 mt-1">
          Specialized electrical design, load profile simulations, microgrid installation, and commissioning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="bg-midnight-900 border border-midnight-800 rounded-xl p-5 shadow space-y-3"
          >
            <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
              <Wrench className="w-4 h-4" />
            </div>

            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                {srv.status}
              </span>
              <h3 className="text-base font-heading font-bold text-ivory-100 mt-0.5">{srv.title}</h3>
            </div>

            <p className="text-xs text-ivory-400 leading-relaxed">{srv.summary}</p>
            <p className="text-[11px] text-ivory-300 pt-2 border-t border-midnight-800 leading-relaxed font-sans">
              {srv.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
