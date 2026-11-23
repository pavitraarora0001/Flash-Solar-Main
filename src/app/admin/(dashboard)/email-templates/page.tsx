"use client";

import * as React from "react";
import {
  Send,
  Save,
  CheckCircle2,
  AlertCircle,
  Mail,
  Play,
  FileCode,
  Sliders,
} from "lucide-react";
import { DBEmailTemplate } from "@/lib/db/store";

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = React.useState<DBEmailTemplate[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedTemplate, setSelectedTemplate] = React.useState<DBEmailTemplate | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [testing, setTesting] = React.useState(false);
  const [testEmail, setTestEmail] = React.useState("info@flashsolar.org");
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  React.useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    setLoading(true);
    try {
      const res = await fetch("/api/email-templates");
      const data = await res.json();
      if (data.success && data.templates) {
        setTemplates(data.templates);
        if (data.templates.length > 0) {
          setSelectedTemplate(JSON.parse(JSON.stringify(data.templates[0])));
        }
      }
    } catch {
      setMessage({ type: "error", text: "Failed to load email templates." });
    } finally {
      setLoading(false);
    }
  }

  const handleSelect = (tmpl: DBEmailTemplate) => {
    setSelectedTemplate(JSON.parse(JSON.stringify(tmpl)));
    setMessage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/email-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedTemplate),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: `Template "${selectedTemplate.name}" saved successfully.` });
        fetchTemplates();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save template." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setSaving(false);
    }
  };

  const handleSendTest = async () => {
    if (!selectedTemplate || !testEmail) return;
    setTesting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/email-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_test",
          slug: selectedTemplate.slug,
          testEmail,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: data.message });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to dispatch test." });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to connect to email dispatcher." });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-ivory-300">
        <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-mono">Loading Transactional Templates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-midnight-800">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-ivory-100 flex items-center gap-2.5">
            <Send className="w-6 h-6 text-gold-400" />
            <span>Transactional Email Template Manager</span>
          </h2>
          <p className="text-xs text-ivory-400 mt-1">
            Configure automated customer receipts, engineering team lead alerts, contact notifications, and password reset dispatches.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-3 border ${
            message.type === "success"
              ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-200"
              : "bg-rose-950/60 border-rose-500/40 text-rose-200"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Templates Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-ivory-400 font-bold px-1">
            System Templates ({templates.length})
          </h3>
          <div className="bg-midnight-900 border border-midnight-800 rounded-2xl p-2 space-y-1">
            {templates.map((tmpl) => {
              const isSelected = selectedTemplate?.slug === tmpl.slug;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => handleSelect(tmpl)}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                    isSelected
                      ? "bg-gold-500/20 text-gold-400 border border-gold-500/40 font-semibold"
                      : "text-ivory-300 hover:text-white hover:bg-midnight-800/60"
                  }`}
                >
                  <div>
                    <span className="block font-semibold text-ivory-100">{tmpl.name}</span>
                    <span className="text-[10px] font-mono text-gold-400/90">{tmpl.slug}</span>
                  </div>
                  <Mail className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-gold-400" : "text-ivory-500"}`} />
                </button>
              );
            })}
          </div>

          {/* Test Dispatch Box */}
          <div className="bg-midnight-900 border border-midnight-800 rounded-2xl p-4 space-y-3 shadow">
            <span className="text-xs font-mono font-bold uppercase text-ivory-300 block">
              Send Test Dispatch
            </span>
            <div className="space-y-1.5 text-xs">
              <label className="text-ivory-400 text-[11px]">Recipient Email</label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="developer@flashsolar.org"
                className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 text-xs font-mono"
              />
            </div>
            <button
              type="button"
              onClick={handleSendTest}
              disabled={testing || !selectedTemplate}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-midnight-800 hover:bg-midnight-700 text-gold-400 border border-gold-500/30 text-xs font-bold transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{testing ? "Dispatching..." : "Send Test Email"}</span>
            </button>
          </div>
        </div>

        {/* Template Editor Form */}
        <div className="lg:col-span-8 bg-midnight-900 border border-midnight-800 rounded-2xl p-6 space-y-5 shadow-xl">
          {selectedTemplate ? (
            <form onSubmit={handleSave} className="space-y-5 text-xs">
              <div className="flex items-center justify-between border-b border-midnight-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 font-bold block">
                    Editing Template: {selectedTemplate.slug}
                  </span>
                  <h3 className="text-base font-heading font-bold text-ivory-100">
                    {selectedTemplate.name}
                  </h3>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-ivory-300">
                  <input
                    type="checkbox"
                    checked={selectedTemplate.isEnabled}
                    onChange={(e) => setSelectedTemplate({ ...selectedTemplate, isEnabled: e.target.checked })}
                    className="rounded border-midnight-700 bg-midnight-950 text-gold-500"
                  />
                  <span>Template Active</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-ivory-300 font-semibold">Template Display Name</label>
                  <input
                    type="text"
                    value={selectedTemplate.name}
                    onChange={(e) => setSelectedTemplate({ ...selectedTemplate, name: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg bg-midnight-950 border border-midnight-700 text-ivory-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-ivory-300 font-semibold">Sender Display Name</label>
                  <input
                    type="text"
                    value={selectedTemplate.senderName || ""}
                    onChange={(e) => setSelectedTemplate({ ...selectedTemplate, senderName: e.target.value })}
                    placeholder="Flash Solar Engineering Desk"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-midnight-950 border border-midnight-700 text-ivory-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-ivory-300 font-semibold">Email Subject Line</label>
                <input
                  type="text"
                  value={selectedTemplate.subject}
                  onChange={(e) => setSelectedTemplate({ ...selectedTemplate, subject: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-midnight-950 border border-midnight-700 text-ivory-100 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-ivory-300 font-semibold">Email Body Content</label>
                <textarea
                  rows={10}
                  value={selectedTemplate.body}
                  onChange={(e) => setSelectedTemplate({ ...selectedTemplate, body: e.target.value })}
                  required
                  className="w-full p-3 rounded-lg bg-midnight-950 border border-midnight-700 text-ivory-100 font-mono text-xs leading-relaxed"
                />
              </div>

              {/* Supported Variables Pills */}
              <div className="space-y-2 pt-2 border-t border-midnight-800">
                <span className="text-[10px] font-mono uppercase tracking-wider text-ivory-400 font-bold block">
                  Available Dynamic Variables (Click to copy)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTemplate.variables?.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => navigator.clipboard.writeText(`{{${v}}}`)}
                      className="px-2 py-0.5 rounded bg-midnight-950 border border-midnight-800 text-gold-400 hover:border-gold-500/50 font-mono text-[10px]"
                    >
                      &#123;&#123;{v}&#125;&#125;
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-midnight-800 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-midnight-950 font-bold text-xs shadow-goldGlow transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Saving..." : "Save Template"}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-12 text-center text-ivory-400 text-xs">
              Select a template to view and edit its parameters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
