"use client";

import * as React from "react";
import { Settings, Save, CheckCircle2, ShieldCheck, Mail, Database } from "lucide-react";

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = React.useState("Flash Solar");
  const [contactEmail, setContactEmail] = React.useState("info@flashsolar.org");
  const [saved, setSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-midnight-800">
        <h1 className="text-2xl font-heading font-extrabold text-ivory-100 tracking-tight">
          System Configuration &amp; Settings
        </h1>
        <p className="text-xs text-ivory-400 mt-1">
          Operational configurations, notification routing, and environment parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand & Organization */}
        <div className="bg-midnight-900 border border-midnight-800 rounded-xl p-6 shadow space-y-4">
          <h2 className="text-sm font-heading font-bold text-ivory-100 flex items-center gap-2">
            <Settings className="w-4 h-4 text-gold-400" />
            <span>Platform Brand &amp; Identity</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-ivory-300 font-semibold mb-1">Company / Brand Name</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
              />
            </div>
            <div>
              <label className="block text-ivory-300 font-semibold mb-1">Central Notification Inbound</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
              />
            </div>
          </div>
        </div>

        {/* Database & Runtime Status */}
        <div className="bg-midnight-900 border border-midnight-800 rounded-xl p-6 shadow space-y-4">
          <h2 className="text-sm font-heading font-bold text-ivory-100 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Persistence &amp; Infrastructure Runtime</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-midnight-950 border border-midnight-800">
              <div>
                <span className="font-semibold text-ivory-200 block">Database Storage Adapter</span>
                <span className="text-[11px] text-ivory-400">
                  Hybrid File-backed Store (`src/data/db-store.json`) with Prisma PostgreSQL Schema Ready
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                ACTIVE
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-midnight-950 border border-midnight-800">
              <div>
                <span className="font-semibold text-ivory-200 block">Email Dispatcher Adapter</span>
                <span className="text-[11px] text-ivory-400">
                  Multi-provider Resend API / Secure Local Dev Simulator
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-400 border border-blue-800">
                LOGGING READY
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-3">
          {saved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Settings saved
            </span>
          )}
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-midnight-950 text-xs font-semibold shadow transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
