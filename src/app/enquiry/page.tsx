"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBanner } from "@/components/shared/cta-banner";
import {
  Zap,
  Sliders,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Send,
  Calculator,
  ArrowRight,
} from "lucide-react";

function EnquiryForm() {
  const searchParams = useSearchParams();
  const initialProduct = searchParams?.get("product") || "";

  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    country: "India",
    city: "",
    productOfInterest: initialProduct || "Flash Power Wall",
    projectType: "Residential DC Microgrid",
    estimatedPowerReq: "10 kW",
    estimatedDailyEnergy: "25 kWh",
    message: "",
    privacyConsent: true,
  });

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState<{ referenceNumber: string } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.fullName || !formData.email || !formData.phone) {
      setError("Please complete all required fields (Full Name, Email, Phone).");
      return;
    }

    if (!formData.privacyConsent) {
      setError("Please accept the privacy policy to proceed.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Submission failed. Please verify your details.");
        setLoading(false);
        return;
      }

      setSuccess({ referenceNumber: data.referenceNumber || data.enquiry?.referenceNumber || "FS-2026-CONFIRMED" });
      setLoading(false);
    } catch {
      setError("Network error communicating with the Flash Solar sizing engine.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-ivory-100">
          Sizing Intake Submitted Successfully
        </h3>
        <div className="inline-block px-4 py-2 rounded-lg bg-midnight-950 border border-emerald-500/40 font-mono text-sm text-gold-400">
          Assigned Project Reference: <strong className="text-white">{success.referenceNumber}</strong>
        </div>
        <p className="text-xs sm:text-sm text-ivory-300 max-w-md mx-auto leading-relaxed">
          Our electrical engineering team has been notified. You will receive an email confirmation and sizing calculations shortly.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <button
            type="button"
            onClick={() => setSuccess(null)}
            className="px-5 py-2.5 rounded-md bg-midnight-800 border border-midnight-700 text-xs font-semibold text-ivory-200 hover:text-white"
          >
            Submit Another Sizing
          </button>
          <Link
            href="/products"
            className="px-5 py-2.5 rounded-md bg-gold-500 text-midnight-950 text-xs font-semibold hover:bg-gold-400"
          >
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-1">
        <span className="text-xs font-mono text-gold-400 uppercase tracking-widest block">
          Engineering Intake
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ivory-100">
          Submit Your Energy Parameters
        </h2>
        <p className="text-xs sm:text-sm text-ivory-400">
          Fill out your load details below to initiate the sizing assessment.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-ivory-300 block">
              Full Name <span className="text-gold-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Sarah Jenkins"
              className="w-full px-4 py-2.5 rounded-lg bg-midnight-950 border border-midnight-700 focus:border-gold-500 text-xs text-ivory-100 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-ivory-300 block">
              Email Address <span className="text-gold-400">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="sarah@cleanpower.org"
              className="w-full px-4 py-2.5 rounded-lg bg-midnight-950 border border-midnight-700 focus:border-gold-500 text-xs text-ivory-100 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-ivory-300 block">
              Phone / Mobile <span className="text-gold-400">*</span>
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2.5 rounded-lg bg-midnight-950 border border-midnight-700 focus:border-gold-500 text-xs text-ivory-100 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-ivory-300 block">
              Company / Organization
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="EcoGrid Holdings"
              className="w-full px-4 py-2.5 rounded-lg bg-midnight-950 border border-midnight-700 focus:border-gold-500 text-xs text-ivory-100 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-ivory-300 block">
              Country
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              placeholder="India / International"
              className="w-full px-4 py-2.5 rounded-lg bg-midnight-950 border border-midnight-700 focus:border-gold-500 text-xs text-ivory-100 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-ivory-300 block">
              City / Region
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="Jaipur, Rajasthan"
              className="w-full px-4 py-2.5 rounded-lg bg-midnight-950 border border-midnight-700 focus:border-gold-500 text-xs text-ivory-100 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-ivory-300 block">
              System of Primary Interest
            </label>
            <select
              value={formData.productOfInterest}
              onChange={(e) => setFormData({ ...formData, productOfInterest: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-midnight-950 border border-midnight-700 focus:border-gold-500 text-xs text-ivory-100 outline-none"
            >
              <option value="Flash Power Wall">Flash Power Wall (5-15 kWh)</option>
              <option value="Flash DC House">Flash DC House Architecture</option>
              <option value="Flash AC House">Flash AC Hybrid Solar System</option>
              <option value="Container Storage 1MWh">Container Storage (500 kWh – 2 MWh)</option>
              <option value="Custom Microgrid">Custom Microgrid EPC</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-ivory-300 block">
              Application / Project Type
            </label>
            <select
              value={formData.projectType}
              onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-midnight-950 border border-midnight-700 focus:border-gold-500 text-xs text-ivory-100 outline-none"
            >
              <option value="Residential DC Microgrid">Residential DC Microgrid</option>
              <option value="Commercial BESS Retrofit">Commercial BESS Retrofit</option>
              <option value="Agricultural Solar Pumping">Agricultural Solar Pumping</option>
              <option value="Telecom Off-Grid Tower">Telecom Off-Grid Tower</option>
              <option value="Industrial Peak Shaving">Industrial Peak Shaving</option>
              <option value="General Consultation">General Engineering Consultation</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-ivory-300 block">
              Estimated Power Requirement (kW)
            </label>
            <input
              type="text"
              value={formData.estimatedPowerReq}
              onChange={(e) => setFormData({ ...formData, estimatedPowerReq: e.target.value })}
              placeholder="e.g. 5 kW, 15 kW, 50 kW"
              className="w-full px-4 py-2.5 rounded-lg bg-midnight-950 border border-midnight-700 focus:border-gold-500 text-xs text-ivory-100 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-ivory-300 block">
              Estimated Daily Energy Demand (kWh)
            </label>
            <input
              type="text"
              value={formData.estimatedDailyEnergy}
              onChange={(e) => setFormData({ ...formData, estimatedDailyEnergy: e.target.value })}
              placeholder="e.g. 25 kWh / day"
              className="w-full px-4 py-2.5 rounded-lg bg-midnight-950 border border-midnight-700 focus:border-gold-500 text-xs text-ivory-100 outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-ivory-300 block">
            Site Description & Specific Requirements
          </label>
          <textarea
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Detail any existing solar panels, inverter brands, peak heavy motor loads, or installation timeline..."
            className="w-full px-4 py-3 rounded-lg bg-midnight-950 border border-midnight-700 focus:border-gold-500 text-xs text-ivory-100 outline-none resize-none leading-relaxed"
          />
        </div>

        <div className="flex items-start gap-2.5 pt-1">
          <input
            type="checkbox"
            id="privacyConsent"
            checked={formData.privacyConsent}
            onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
            className="mt-0.5 rounded bg-midnight-950 border-midnight-700 text-gold-500 focus:ring-gold-500"
          />
          <label htmlFor="privacyConsent" className="text-xs text-ivory-400">
            I agree to receive electrical sizing documentation and technical contact from Flash Solar engineering specialists in accordance with the{" "}
            <Link href="/privacy" className="text-gold-400 hover:underline">
              Privacy Policy
            </Link>.
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-lg bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-midnight-950 font-semibold text-sm transition-all duration-200 shadow-goldGlow hover:shadow-none inline-flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>{loading ? "Calculating & Transmitting..." : "Generate Engineering Sizing Assessment"}</span>
        </button>
      </form>
    </>
  );
}

export default function EnquiryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-midnight-950 font-sans selection:bg-gold-500 selection:text-midnight-950">
      <Header />

      <main className="flex-1">
        <PageHero
          eyebrow="Electrical Load Sizing & Engineering Intake"
          title="Project Sizing & Quotation Portal"
          subtitle="Provide your project parameters and daily energy demand. Flash Solar engineers will evaluate battery capacity, MPPT configuration, and issue a formal proposal with electrical single-line diagrams."
          breadcrumbs={[{ label: "Project Intake" }]}
          primaryCta={{ label: "Explore Spec Matrix", href: "/specifications" }}
          secondaryCta={{ label: "View Core Hardware", href: "/products" }}
          badgeText="Automated Sizing Analysis"
          stats={[
            { label: "Engineering SLA", value: "< 24 Hours", subtext: "Technical review turnaround" },
            { label: "Deliverables", value: "SLD + Sizing", subtext: "Single-line diagram included" },
            { label: "Cost", value: "Complimentary", subtext: "Free initial assessment" },
            { label: "Standard", value: "IEC 62619", subtext: "Certified safety calculations" },
          ]}
        />

        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-midnight-900 border border-midnight-700/80 rounded-2xl p-8 space-y-6 shadow-card">
                <div className="flex items-center gap-2.5 text-gold-400 font-mono text-xs uppercase tracking-wider">
                  <Calculator className="w-4 h-4" />
                  <span>Sizing Deliverables</span>
                </div>

                <h2 className="text-2xl font-serif font-bold text-ivory-100">
                  What You Receive
                </h2>

                <p className="text-xs text-ivory-400 leading-relaxed">
                  Upon receiving your energy requirements, our technical sizing engineers run numerical load simulations to calculate the optimal battery bank capacity and busbar distribution.
                </p>

                <div className="space-y-3.5 pt-2 text-xs">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-midnight-950/80 border border-midnight-800">
                    <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-ivory-200 block text-xs">Capacity & Autonomy Report</strong>
                      <span className="text-ivory-400">Exact kWh storage required for 24-48 hours of autonomous operation.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-midnight-950/80 border border-midnight-800">
                    <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-ivory-200 block text-xs">Single-Line Diagram (SLD)</strong>
                      <span className="text-ivory-400">Electrical topology indicating 48V bus, breakers, and MPPT wire sizes.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-midnight-950/80 border border-midnight-800">
                    <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-ivory-200 block text-xs">Bill of Materials (BOM) & Quote</strong>
                      <span className="text-ivory-400">Transparent hardware pricing including battery cells, BMS, and chassis.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-midnight-900/60 border border-midnight-750 text-xs text-ivory-400 space-y-2">
                <span className="text-gold-400 font-mono font-medium block uppercase tracking-wider">
                  Direct Inquiries Hotline
                </span>
                <p>
                  Prefer discussing your project over phone or WhatsApp? Connect directly with our sizing engineers:
                </p>
                <div className="pt-1">
                  <a href="tel:+918824536524" className="text-gold-400 font-mono font-semibold text-sm hover:underline">
                    +91 8824536524
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-midnight-900 border border-midnight-700/80 rounded-2xl p-8 sm:p-10 shadow-elevated space-y-6">
              <React.Suspense fallback={<div className="text-center py-12 text-ivory-400 text-xs font-mono">Loading Sizing Engine...</div>}>
                <EnquiryForm />
              </React.Suspense>
            </div>
          </div>
        </section>

        <CtaBanner
          eyebrow="Direct Architecture Support"
          title="Questions Prior to Sizing Submission?"
          description="Contact our technical desk to discuss inverter interoperability, DC breaker sizing, and factory testing protocols."
          primaryCtaText="Speak with an Engineer"
          primaryCtaHref="/contact"
          secondaryCtaText="Inspect Specifications Matrix"
          secondaryCtaHref="/specifications"
        />
      </main>

      <Footer />
    </div>
  );
}
