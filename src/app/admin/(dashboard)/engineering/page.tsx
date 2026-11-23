"use client";

import * as React from "react";
import Image from "next/image";
import {
  Cpu,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  Zap,
  Activity,
  ShieldCheck,
  Eye,
} from "lucide-react";

interface SpecItem {
  label: string;
  value: string;
}

interface EngineeringStage {
  id: string;
  stageNumber: number;
  slug: string;
  title: string;
  badge: string;
  subtitle: string;
  description: string;
  technicalDetails: string;
  imageUrl: string;
  voltageBus?: string;
  efficiencyMetric?: string;
  specs: SpecItem[];
  animationLabel?: string;
  displayOrder: number;
  isVisible: boolean;
  status: string;
}

export default function EngineeringCMSPage() {
  const [stages, setStages] = React.useState<EngineeringStage[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [selectedStageNum, setSelectedStageNum] = React.useState<number>(1);
  const [editStage, setEditStage] = React.useState<EngineeringStage | null>(null);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  React.useEffect(() => {
    fetchStages();
  }, []);

  async function fetchStages() {
    setLoading(true);
    try {
      const res = await fetch("/api/engineering");
      const data = await res.json();
      if (data.success && data.stages) {
        setStages(data.stages);
        const stage1 = data.stages.find((s: EngineeringStage) => s.stageNumber === 1) || data.stages[0];
        if (stage1) {
          setEditStage(JSON.parse(JSON.stringify(stage1)));
          setSelectedStageNum(stage1.stageNumber);
        }
      }
    } catch (err) {
      console.error("Failed to load engineering stages:", err);
      setMessage({ type: "error", text: "Failed to load engineering stages." });
    } finally {
      setLoading(false);
    }
  }

  const handleSelectStage = (num: number) => {
    setSelectedStageNum(num);
    const found = stages.find((s) => s.stageNumber === num);
    if (found) {
      setEditStage(JSON.parse(JSON.stringify(found)));
    }
  };

  const handleAddSpec = () => {
    if (!editStage) return;
    setEditStage({
      ...editStage,
      specs: [...editStage.specs, { label: "Parameter Name", value: "Parameter Value" }],
    });
  };

  const handleRemoveSpec = (index: number) => {
    if (!editStage) return;
    const nextSpecs = [...editStage.specs];
    nextSpecs.splice(index, 1);
    setEditStage({ ...editStage, specs: nextSpecs });
  };

  const handleSpecChange = (index: number, field: "label" | "value", val: string) => {
    if (!editStage) return;
    const nextSpecs = [...editStage.specs];
    nextSpecs[index] = { ...nextSpecs[index], [field]: val };
    setEditStage({ ...editStage, specs: nextSpecs });
  };

  const handleSaveStage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStage) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/engineering", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editStage),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({
          type: "success",
          text: `Stage ${editStage.stageNumber} (${editStage.title}) saved and published to public site.`,
        });
        fetchStages();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update stage." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-ivory-300">
        <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-mono">Loading DC Engineering Stages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-midnight-800">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-ivory-100 flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-gold-400" />
            <span>Direct-Current Architecture Journey CMS</span>
          </h2>
          <p className="text-xs text-ivory-400 mt-1">
            Manage the 5 individual engineering stages of the interactive DC journey. Changes reflect live on the homepage without breaking GSAP/ScrollTrigger sequences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/#dc-journey"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-midnight-900 border border-midnight-700 text-xs font-semibold text-ivory-300 hover:text-gold-400 transition-colors"
          >
            <span>Preview Public Journey</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
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

      {/* Stage Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {stages.map((stg) => {
          const isSelected = selectedStageNum === stg.stageNumber;
          return (
            <button
              key={stg.id}
              onClick={() => handleSelectStage(stg.stageNumber)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? "bg-gold-500/20 border-gold-500 text-gold-400 shadow-md"
                  : "bg-midnight-900/80 border-midnight-800 text-ivory-300 hover:border-midnight-700 hover:bg-midnight-800"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                  Stage 0{stg.stageNumber}
                </span>
                <span className={`w-2 h-2 rounded-full ${stg.isVisible ? "bg-emerald-400" : "bg-midnight-600"}`} />
              </div>
              <span className="text-xs font-bold font-heading line-clamp-1 block text-ivory-100">
                {stg.title}
              </span>
              <span className="text-[10px] text-ivory-400 font-mono block mt-0.5">
                {stg.voltageBus || "Sub-60V DC"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Stage Editor Layout */}
      {editStage && (
        <form onSubmit={handleSaveStage} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-7 bg-midnight-900 border border-midnight-800 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-midnight-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-gold-400 tracking-widest block">
                  Configuration Settings
                </span>
                <h3 className="text-base font-heading font-bold text-ivory-100">
                  Stage {editStage.stageNumber}: {editStage.title}
                </h3>
              </div>

              <label className="flex items-center gap-2 text-xs text-ivory-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editStage.isVisible}
                  onChange={(e) => setEditStage({ ...editStage, isVisible: e.target.checked })}
                  className="rounded border-midnight-700 bg-midnight-950 text-gold-500 focus:ring-gold-500/40"
                />
                <span>Active on Public Journey</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-ivory-300">Stage Title</label>
                <input
                  type="text"
                  value={editStage.title}
                  onChange={(e) => setEditStage({ ...editStage, title: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 rounded-lg bg-midnight-950 border border-midnight-700 text-ivory-100 text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ivory-300">Badge Label</label>
                <input
                  type="text"
                  value={editStage.badge}
                  onChange={(e) => setEditStage({ ...editStage, badge: e.target.value })}
                  placeholder="STAGE 01 • HARVEST"
                  className="w-full px-3.5 py-2 rounded-lg bg-midnight-950 border border-midnight-700 text-ivory-100 text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-ivory-300">Subtitle</label>
              <input
                type="text"
                value={editStage.subtitle}
                onChange={(e) => setEditStage({ ...editStage, subtitle: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-midnight-950 border border-midnight-700 text-ivory-100 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-ivory-300">Voltage Bus Standard</label>
                <input
                  type="text"
                  value={editStage.voltageBus || ""}
                  onChange={(e) => setEditStage({ ...editStage, voltageBus: e.target.value })}
                  placeholder="e.g. 120V - 450V DC"
                  className="w-full px-3.5 py-2 rounded-lg bg-midnight-950 border border-midnight-700 text-ivory-100 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ivory-300">Efficiency / Performance Metric</label>
                <input
                  type="text"
                  value={editStage.efficiencyMetric || ""}
                  onChange={(e) => setEditStage({ ...editStage, efficiencyMetric: e.target.value })}
                  placeholder="e.g. 99.2% MPPT Tracking"
                  className="w-full px-3.5 py-2 rounded-lg bg-midnight-950 border border-midnight-700 text-ivory-100 text-xs font-mono text-emerald-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-ivory-300">Architecture Photography / Image Path</label>
              <input
                type="text"
                value={editStage.imageUrl}
                onChange={(e) => setEditStage({ ...editStage, imageUrl: e.target.value })}
                required
                className="w-full px-3.5 py-2 rounded-lg bg-midnight-950 border border-midnight-700 text-ivory-100 text-xs font-mono"
              />
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEditStage({ ...editStage, imageUrl: "/images/solar-photovoltaic-generation.jpg" })}
                  className="text-[10px] text-gold-400 hover:underline font-mono"
                >
                  Use Solar Photo
                </button>
                <span className="text-midnight-700">•</span>
                <button
                  type="button"
                  onClick={() => setEditStage({ ...editStage, imageUrl: "/images/flash-power-wall.jpg" })}
                  className="text-[10px] text-gold-400 hover:underline font-mono"
                >
                  Use Power Wall Photo
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-ivory-300">Overview Description</label>
              <textarea
                rows={3}
                value={editStage.description}
                onChange={(e) => setEditStage({ ...editStage, description: e.target.value })}
                required
                className="w-full px-3.5 py-2 rounded-lg bg-midnight-950 border border-midnight-700 text-ivory-100 text-xs leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-ivory-300">In-Depth Technical Details</label>
              <textarea
                rows={3}
                value={editStage.technicalDetails}
                onChange={(e) => setEditStage({ ...editStage, technicalDetails: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-midnight-950 border border-midnight-700 text-ivory-100 text-xs leading-relaxed"
              />
            </div>

            {/* Specifications Matrix */}
            <div className="pt-3 border-t border-midnight-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase font-bold text-ivory-300">
                  Technical Specifications Matrix ({editStage.specs.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-gold-400 hover:text-gold-300"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Spec Row</span>
                </button>
              </div>

              <div className="space-y-2">
                {editStage.specs.map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={spec.label}
                      onChange={(e) => handleSpecChange(idx, "label", e.target.value)}
                      placeholder="Label"
                      className="w-1/2 px-3 py-1.5 rounded bg-midnight-950 border border-midnight-700 text-ivory-100 text-xs"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                      placeholder="Value"
                      className="w-1/2 px-3 py-1.5 rounded bg-midnight-950 border border-midnight-700 text-ivory-100 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(idx)}
                      className="p-1.5 rounded text-rose-400 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-midnight-800 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-midnight-950 font-bold text-xs shadow-goldGlow transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Publishing Stage..." : "Save & Update Stage"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Stage Preview */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-ivory-400 font-bold px-1">
              Live Stage Presentation Preview
            </h3>

            <div className="bg-midnight-900 border border-midnight-700/80 rounded-2xl overflow-hidden shadow-2xl space-y-4">
              {/* Image Container */}
              <div className="relative w-full h-56 sm:h-64 bg-midnight-950 border-b border-midnight-800">
                <Image
                  src={editStage.imageUrl}
                  alt={editStage.title}
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-950/90 via-transparent to-midnight-950/20" />
                <div className="absolute top-3 left-3 bg-midnight-950/90 border border-gold-500/40 px-2.5 py-1 rounded text-[10px] font-mono font-bold text-gold-400">
                  {editStage.badge}
                </div>
                {editStage.efficiencyMetric && (
                  <div className="absolute bottom-3 right-3 bg-emerald-950/90 border border-emerald-500/40 px-2.5 py-1 rounded text-[10px] font-mono text-emerald-300 font-semibold">
                    {editStage.efficiencyMetric}
                  </div>
                )}
              </div>

              {/* Text & Specs */}
              <div className="p-5 space-y-4">
                <div>
                  <h4 className="text-lg font-heading font-extrabold text-ivory-100">
                    {editStage.title}
                  </h4>
                  <p className="text-xs font-medium text-gold-400/90 mt-0.5">
                    {editStage.subtitle}
                  </p>
                </div>

                <p className="text-xs text-ivory-300 leading-relaxed">
                  {editStage.description}
                </p>

                {editStage.specs.length > 0 && (
                  <div className="pt-3 border-t border-midnight-800 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-ivory-400 font-bold block">
                      Live Specifications
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {editStage.specs.map((s, idx) => (
                        <div key={idx} className="bg-midnight-950/70 p-2 rounded border border-midnight-800/60">
                          <span className="text-[10px] text-ivory-400 block truncate">{s.label}</span>
                          <span className="font-mono text-[11px] font-bold text-ivory-100 block truncate">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
