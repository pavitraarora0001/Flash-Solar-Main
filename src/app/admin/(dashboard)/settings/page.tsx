"use client";

import * as React from "react";
import {
  Settings,
  Building,
  Globe,
  Bell,
  Cpu,
  ShieldAlert,
  Database,
  Save,
  CheckCircle2,
  Download,
  RefreshCw,
  HardDrive,
  Activity,
  AlertTriangle,
} from "lucide-react";

interface SettingItem {
  key: string;
  value: string;
  group: string;
  description?: string;
}

interface SystemInfo {
  nodeVersion: string;
  platform: string;
  memoryUsageMb: number;
  uptimeSeconds: number;
  databaseType: string;
  postgresStatus?: string;
  postgresDetail?: string;
  counts: {
    products: number;
    enquiries: number;
    mediaAssets: number;
    blogPosts: number;
    leads: number;
  };
  health: string;
  environment: string;
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = React.useState<
    "company" | "website" | "notifications" | "integrations" | "security" | "maintenance"
  >("company");
  const [settingsMap, setSettingsMap] = React.useState<Record<string, string>>({});
  const [system, setSystem] = React.useState<SystemInfo | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [savedSuccess, setSavedSuccess] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);

  const fetchSettings = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      const json = await res.json();
      if (json.success) {
        const map: Record<string, string> = {};
        (json.settings || []).forEach((s: SettingItem) => {
          map[s.key] = s.value;
        });
        setSettingsMap(map);
        setSystem(json.system || null);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (key: string, value: string) => {
    setSettingsMap((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = Object.entries(settingsMap).map(([key, value]) => ({
        key,
        value,
        group: activeTab,
      }));

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: payload }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadBackup = async () => {
    try {
      setExporting(true);
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "backup" }),
      });
      const json = await res.json();
      if (json.success) {
        const blob = new Blob([JSON.stringify(json.backup, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `flashsolar-database-backup-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Backup export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-midnight-800">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-ivory-100 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-gold-400" />
            <span>Enterprise Settings &amp; Configuration</span>
          </h1>
          <p className="text-xs text-ivory-400 mt-1">
            Global business parameters, integration tokens, notification routes, and system telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Settings saved
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-midnight-950 text-xs font-semibold shadow transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving..." : "Save Configuration"}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-midnight-800 overflow-x-auto pb-2 scrollbar-none text-xs">
        <button
          onClick={() => setActiveTab("company")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeTab === "company"
              ? "bg-gold-500/10 text-gold-400 border border-gold-500/30"
              : "text-ivory-400 hover:text-ivory-200 hover:bg-midnight-900"
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Company Information</span>
        </button>

        <button
          onClick={() => setActiveTab("website")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeTab === "website"
              ? "bg-gold-500/10 text-gold-400 border border-gold-500/30"
              : "text-ivory-400 hover:text-ivory-200 hover:bg-midnight-900"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Website &amp; Brand</span>
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeTab === "notifications"
              ? "bg-gold-500/10 text-gold-400 border border-gold-500/30"
              : "text-ivory-400 hover:text-ivory-200 hover:bg-midnight-900"
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Notification Routing</span>
        </button>

        <button
          onClick={() => setActiveTab("integrations")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeTab === "integrations"
              ? "bg-gold-500/10 text-gold-400 border border-gold-500/30"
              : "text-ivory-400 hover:text-ivory-200 hover:bg-midnight-900"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Integrations &amp; Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeTab === "security"
              ? "bg-gold-500/10 text-gold-400 border border-gold-500/30"
              : "text-ivory-400 hover:text-ivory-200 hover:bg-midnight-900"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Security &amp; Access</span>
        </button>

        <button
          onClick={() => setActiveTab("maintenance")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeTab === "maintenance"
              ? "bg-gold-500/10 text-gold-400 border border-gold-500/30"
              : "text-ivory-400 hover:text-ivory-200 hover:bg-midnight-900"
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Backup &amp; Diagnostics</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Tab 1: Company Information */}
        {activeTab === "company" && (
          <div className="bg-midnight-900 border border-midnight-800 rounded-xl p-6 shadow space-y-5 text-xs">
            <h2 className="text-sm font-heading font-bold text-ivory-100 flex items-center gap-2">
              <Building className="w-4 h-4 text-gold-400" />
              <span>Corporate Entity &amp; Contact Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-ivory-300 font-semibold mb-1">Company Trade Name</label>
                <input
                  type="text"
                  value={settingsMap.company_name || "Flash Solar Inc."}
                  onChange={(e) => handleChange("company_name", e.target.value)}
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>

              <div>
                <label className="block text-ivory-300 font-semibold mb-1">Legal Registered Entity</label>
                <input
                  type="text"
                  value={settingsMap.legal_name || "Flash Solar Clean Energy Technologies Ltd."}
                  onChange={(e) => handleChange("legal_name", e.target.value)}
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>

              <div>
                <label className="block text-ivory-300 font-semibold mb-1">Corporate Registration / Tax ID</label>
                <input
                  type="text"
                  value={settingsMap.tax_id || "EIN 84-9281749"}
                  onChange={(e) => handleChange("tax_id", e.target.value)}
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>

              <div>
                <label className="block text-ivory-300 font-semibold mb-1">Primary Support &amp; Inquiries Phone</label>
                <input
                  type="text"
                  value={settingsMap.contact_phone || "+1 (800) 555-FLSH"}
                  onChange={(e) => handleChange("contact_phone", e.target.value)}
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>

              <div>
                <label className="block text-ivory-300 font-semibold mb-1">Primary Contact Email</label>
                <input
                  type="email"
                  value={settingsMap.contact_email || "info@flashsolar.org"}
                  onChange={(e) => handleChange("contact_email", e.target.value)}
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>

              <div>
                <label className="block text-ivory-300 font-semibold mb-1">Emergency 24/7 Engineering Support Line</label>
                <input
                  type="text"
                  value={settingsMap.emergency_phone || "+1 (888) 999-GRID"}
                  onChange={(e) => handleChange("emergency_phone", e.target.value)}
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-ivory-300 font-semibold mb-1">Headquarters Engineering Campus Address</label>
                <input
                  type="text"
                  value={settingsMap.company_address || "Clean Energy Engineering Center, 100 Renewable Way, Suite 400"}
                  onChange={(e) => handleChange("company_address", e.target.value)}
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-ivory-300 font-semibold mb-1">Business &amp; Dispatch Operating Hours</label>
                <input
                  type="text"
                  value={settingsMap.business_hours || "Monday - Friday: 08:00 - 18:00 EST / On-call BESS Field Engineers 24/7"}
                  onChange={(e) => handleChange("business_hours", e.target.value)}
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Website & Brand */}
        {activeTab === "website" && (
          <div className="bg-midnight-900 border border-midnight-800 rounded-xl p-6 shadow space-y-5 text-xs">
            <h2 className="text-sm font-heading font-bold text-ivory-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-gold-400" />
              <span>Public Presentation &amp; Meta Settings</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-ivory-300 font-semibold mb-1">Website Title</label>
                <input
                  type="text"
                  value={settingsMap.site_name || "Flash Solar"}
                  onChange={(e) => handleChange("site_name", e.target.value)}
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>

              <div>
                <label className="block text-ivory-300 font-semibold mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={settingsMap.site_tagline || "High-Efficiency Clean Energy Engineering & BESS Architecture"}
                  onChange={(e) => handleChange("site_tagline", e.target.value)}
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-ivory-300 font-semibold mb-1">Default Meta Description</label>
                <textarea
                  rows={2}
                  value={
                    settingsMap.meta_description ||
                    "Flash Solar delivers tier-1 high-efficiency solar photovoltaic panels, commercial battery storage, and direct-current microgrid architecture."
                  }
                  onChange={(e) => handleChange("meta_description", e.target.value)}
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>

              <div>
                <label className="block text-ivory-300 font-semibold mb-1">Header Top Bar Notification Text</label>
                <input
                  type="text"
                  value={settingsMap.header_banner_text || "Reliable Power • Engineering & Energy Storage Architecture • High-Efficiency DC Systems"}
                  onChange={(e) => handleChange("header_banner_text", e.target.value)}
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>

              <div>
                <label className="block text-ivory-300 font-semibold mb-1">Header Notification Link</label>
                <input
                  type="text"
                  value={settingsMap.header_banner_link || "/#engineering"}
                  onChange={(e) => handleChange("header_banner_link", e.target.value)}
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>

              <div className="sm:col-span-2 flex items-center gap-3 p-3 bg-midnight-950 rounded-lg border border-midnight-800">
                <input
                  type="checkbox"
                  id="maintenance_mode"
                  checked={settingsMap.maintenance_mode === "true"}
                  onChange={(e) => handleChange("maintenance_mode", String(e.target.checked))}
                  className="rounded border-midnight-700 text-gold-500 focus:ring-gold-500"
                />
                <label htmlFor="maintenance_mode" className="text-xs text-ivory-200 cursor-pointer">
                  <span className="font-semibold block">Enable Maintenance Mode</span>
                  <span className="text-[11px] text-ivory-400">
                    Restricts public website access with an engineering maintenance screen. Admins retain full panel access.
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Notification Routing */}
        {activeTab === "notifications" && (
          <div className="bg-midnight-900 border border-midnight-800 rounded-xl p-6 shadow space-y-5 text-xs">
            <h2 className="text-sm font-heading font-bold text-ivory-100 flex items-center gap-2">
              <Bell className="w-4 h-4 text-gold-400" />
              <span>Inbound Alerts &amp; CRM Routing</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-ivory-300 font-semibold mb-1">
                  Admin Alert Recipients (comma separated)
                </label>
                <input
                  type="text"
                  value={settingsMap.admin_alert_emails || "engineering@flashsolar.org, sales@flashsolar.org"}
                  onChange={(e) => handleChange("admin_alert_emails", e.target.value)}
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-ivory-300 font-semibold mb-1">Digest Email Frequency</label>
                  <select
                    value={settingsMap.digest_frequency || "DAILY"}
                    onChange={(e) => handleChange("digest_frequency", e.target.value)}
                    className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                  >
                    <option value="IMMEDIATE">Immediate (Real-time per lead)</option>
                    <option value="DAILY">Daily Engineering Digest</option>
                    <option value="WEEKLY">Weekly Executive Summary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-ivory-300 font-semibold mb-1">External Webhook / Slack Endpoint</label>
                  <input
                    type="url"
                    value={settingsMap.webhook_url || ""}
                    onChange={(e) => handleChange("webhook_url", e.target.value)}
                    placeholder="https://hooks.slack.com/services/..."
                    className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Integrations & Analytics */}
        {activeTab === "integrations" && (
          <div className="bg-midnight-900 border border-midnight-800 rounded-xl p-6 shadow space-y-5 text-xs">
            <h2 className="text-sm font-heading font-bold text-ivory-100 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-gold-400" />
              <span>Third-Party APIs &amp; Measurement Tags</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-ivory-300 font-semibold mb-1">Google Analytics 4 Measurement ID</label>
                <input
                  type="text"
                  value={settingsMap.ga4_id || "G-FLASHSOLAR"}
                  onChange={(e) => handleChange("ga4_id", e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>

              <div>
                <label className="block text-ivory-300 font-semibold mb-1">Google Tag Manager Container ID</label>
                <input
                  type="text"
                  value={settingsMap.gtm_id || "GTM-FLSH99"}
                  onChange={(e) => handleChange("gtm_id", e.target.value)}
                  placeholder="GTM-XXXXXXX"
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>

              <div>
                <label className="block text-ivory-300 font-semibold mb-1">Google reCAPTCHA v3 Site Key</label>
                <input
                  type="text"
                  value={settingsMap.recaptcha_key || ""}
                  onChange={(e) => handleChange("recaptcha_key", e.target.value)}
                  placeholder="6Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>

              <div>
                <label className="block text-ivory-300 font-semibold mb-1">Corporate LinkedIn Page URL</label>
                <input
                  type="url"
                  value={settingsMap.social_linkedin || "https://linkedin.com/company/flashsolar"}
                  onChange={(e) => handleChange("social_linkedin", e.target.value)}
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Security & Access */}
        {activeTab === "security" && (
          <div className="bg-midnight-900 border border-midnight-800 rounded-xl p-6 shadow space-y-5 text-xs">
            <h2 className="text-sm font-heading font-bold text-ivory-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-gold-400" />
              <span>Security Policies &amp; Access Controls</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-ivory-300 font-semibold mb-1">Admin Session Duration (Hours)</label>
                <input
                  type="number"
                  value={settingsMap.session_timeout_hours || "24"}
                  onChange={(e) => handleChange("session_timeout_hours", e.target.value)}
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>

              <div>
                <label className="block text-ivory-300 font-semibold mb-1">Max Consecutive Failed Login Attempts</label>
                <input
                  type="number"
                  value={settingsMap.max_failed_logins || "5"}
                  onChange={(e) => handleChange("max_failed_logins", e.target.value)}
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-ivory-300 font-semibold mb-1">Admin Allowed IP Whitelist (CIDRs, optional)</label>
                <input
                  type="text"
                  value={settingsMap.ip_whitelist || ""}
                  onChange={(e) => handleChange("ip_whitelist", e.target.value)}
                  placeholder="e.g. 192.168.1.0/24, 10.0.0.0/8 (Leave empty for open access)"
                  className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Backup & Maintenance */}
        {activeTab === "maintenance" && (
          <div className="space-y-6">
            {/* System Diagnostics */}
            <div className="bg-midnight-900 border border-midnight-800 rounded-xl p-6 shadow space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-heading font-bold text-ivory-100 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Platform Runtime &amp; System Health</span>
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {system?.health || "HEALTHY"}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-3 bg-midnight-950 rounded-lg border border-midnight-800">
                  <span className="text-[10px] font-mono text-ivory-400 block uppercase">Runtime</span>
                  <span className="text-sm font-bold text-ivory-100 mt-1 block">
                    Node {system?.nodeVersion || process.version}
                  </span>
                </div>

                <div className="p-3 bg-midnight-950 rounded-lg border border-midnight-800">
                  <span className="text-[10px] font-mono text-ivory-400 block uppercase">Heap Memory</span>
                  <span className="text-sm font-bold text-gold-400 mt-1 block">
                    {system?.memoryUsageMb || 64} MB
                  </span>
                </div>

                <div className="p-3 bg-midnight-950 rounded-lg border border-midnight-800">
                  <span className="text-[10px] font-mono text-ivory-400 block uppercase">Products Catalog</span>
                  <span className="text-sm font-bold text-emerald-400 mt-1 block">
                    {system?.counts.products || 0} active
                  </span>
                </div>

                <div className="p-3 bg-midnight-950 rounded-lg border border-midnight-800">
                  <span className="text-[10px] font-mono text-ivory-400 block uppercase">Enquiries / CRM</span>
                  <span className="text-sm font-bold text-purple-400 mt-1 block">
                    {system?.counts.enquiries || 0} logged
                  </span>
                </div>
              </div>

              {/* PostgreSQL Engine Telemetry */}
              <div className="p-3.5 bg-midnight-950 rounded-lg border border-midnight-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-ivory-200">PostgreSQL 16 Service Status</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                    system?.postgresStatus === "CONNECTED"
                      ? "bg-emerald-950/80 text-emerald-400 border-emerald-800"
                      : "bg-amber-950/80 text-amber-400 border-amber-800"
                  }`}>
                    {system?.postgresStatus || "DISCONNECTED"}
                  </span>
                </div>
                <p className="text-[11px] text-ivory-400">
                  {system?.postgresDetail || "PostgreSQL 16 container at localhost:5433 requires Docker Desktop engine start."}
                </p>
              </div>
            </div>

            {/* Backup Export */}
            <div className="bg-midnight-900 border border-midnight-800 rounded-xl p-6 shadow space-y-4 text-xs">
              <h2 className="text-sm font-heading font-bold text-ivory-100 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-gold-400" />
                <span>Database Export &amp; Snapshot</span>
              </h2>

              <p className="text-xs text-ivory-400 leading-relaxed">
                Generate an immediate JSON database snapshot including all products, categories, pages, engineering architecture stages, enquiries, media assets, testimonials, FAQs, and settings.
              </p>

              <div>
                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  disabled={exporting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-midnight-800 hover:bg-midnight-700 text-gold-400 border border-gold-500/30 text-xs font-semibold shadow transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{exporting ? "Generating Snapshot..." : "Download Full Database JSON Backup"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
