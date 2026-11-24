"use client";

import * as React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBanner } from "@/components/shared/cta-banner";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name || !formData.email || !formData.message) {
      setError("Please complete all required fields (Name, Email, Message).");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to submit message. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess(
        `Thank you. Your message has been received by our engineering desk. Reference: ${data.messageId || "MSG-REC-2026"}. We will respond within 24 business hours.`
      );
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setLoading(false);
    } catch {
      setError("Network error communicating with Flash Solar engineering desk.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-midnight-950 font-sans selection:bg-gold-500 selection:text-midnight-950">
      <Header />

      <main className="flex-1">
        <PageHero
          eyebrow="Engineering Consultation Desk"
          title="Direct Technical Communications"
          subtitle="Direct access to Flash Solar electrical architects, sales engineers, and warranty support specialists for sizing, procurement, and technical collaboration."
          breadcrumbs={[{ label: "Contact Us" }]}
          primaryCta={{ label: "Request Formal Project Sizing", href: "/enquiry" }}
          secondaryCta={{ label: "Explore Hardware Specifications", href: "/specifications" }}
          badgeText="Prompt Engineering Response"
          stats={[
            { label: "Sales Hotline", value: "+91 8824536524", subtext: "Direct telephone access" },
            { label: "Email Support", value: "info@flashsolar.org", subtext: "Encrypted communications" },
            { label: "Response SLA", value: "< 24 Hours", subtext: "Engineering desk review" },
            { label: "Headquarters", value: "Rajasthan", subtext: "Kumher, Bharatpur, India" },
          ]}
        />

        {/* Contact Layout Grid */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Contact Information Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-midnight-900 border border-midnight-700/80 rounded-2xl p-8 space-y-6 shadow-card">
                <div className="space-y-2">
                  <span className="text-xs font-mono text-gold-400 uppercase tracking-widest block">
                    Engineering Headquarters
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-ivory-100">
                    Flash Solar India
                  </h2>
                  <p className="text-xs text-ivory-400 leading-relaxed">
                    Our engineering facility houses battery assembly, thermal cycling chambers, and the direct-current research group.
                  </p>
                </div>

                <div className="space-y-4 pt-2 text-xs">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-midnight-950/80 border border-midnight-800">
                    <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-ivory-200 block text-xs">Physical Address</strong>
                      <span className="text-ivory-400 leading-relaxed">
                        Kaccha Talab, Kumher, Bharatpur - 321201 Rajasthan, India
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-midnight-950/80 border border-midnight-800">
                    <Phone className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-ivory-200 block text-xs">Sales & Sizing Hotline</strong>
                      <a href="tel:+918824536524" className="text-gold-400 font-mono hover:underline">
                        +91 8824536524
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-midnight-950/80 border border-midnight-800">
                    <Mail className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-ivory-200 block text-xs">Engineering Desk Email</strong>
                      <a href="mailto:info@flashsolar.org" className="text-gold-400 font-mono hover:underline">
                        info@flashsolar.org
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-midnight-950/80 border border-midnight-800">
                    <Clock className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-ivory-200 block text-xs">Operating Hours</strong>
                      <span className="text-ivory-400">
                        Monday – Saturday: 09:00 – 18:00 IST (UTC +5:30)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Sizing Callout */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-midnight-900 to-midnight-850 border border-gold-500/30 space-y-3">
                <span className="text-[10px] font-mono uppercase text-gold-400 tracking-wider block">
                  Need Immediate Project Sizing?
                </span>
                <h3 className="text-lg font-serif font-bold text-ivory-100">
                  Use the Engineering Sizing Portal
                </h3>
                <p className="text-xs text-ivory-400 leading-relaxed">
                  For formal single-line diagrams, battery sizing, or commercial tenders, please use our project intake form.
                </p>
                <Link
                  href="/enquiry"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-gold-400 hover:text-gold-300 pt-1"
                >
                  <span>Open Sizing Form →</span>
                </Link>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-7 bg-midnight-900 border border-midnight-700/80 rounded-2xl p-8 sm:p-10 shadow-elevated space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-mono text-gold-400 uppercase tracking-widest block">
                  Inbound Inquiries
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ivory-100">
                  Transmit an Engineering Inquiry
                </h2>
                <p className="text-xs sm:text-sm text-ivory-400">
                  Our engineering team reviews and responds to every technical inquiry directly.
                </p>
              </div>

              {success && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p>{success}</p>
                </div>
              )}

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
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Dr. Alexander Wright"
                      className="w-full px-4 py-2.5 rounded-lg bg-midnight-950 border border-midnight-700 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-xs text-ivory-100 placeholder:text-midnight-600 outline-none transition-colors"
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
                      placeholder="alexander@energy.org"
                      className="w-full px-4 py-2.5 rounded-lg bg-midnight-950 border border-midnight-700 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-xs text-ivory-100 placeholder:text-midnight-600 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-ivory-300 block">
                      Telephone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-lg bg-midnight-950 border border-midnight-700 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-xs text-ivory-100 placeholder:text-midnight-600 outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-ivory-300 block">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Inquiry: Flash Power Wall Wholesale"
                      className="w-full px-4 py-2.5 rounded-lg bg-midnight-950 border border-midnight-700 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-xs text-ivory-100 placeholder:text-midnight-600 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-ivory-300 block">
                    Message & Technical Requirements <span className="text-gold-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your planned solar array capacity, battery storage requirements, or technical sizing questions..."
                    className="w-full px-4 py-3 rounded-lg bg-midnight-950 border border-midnight-700 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-xs text-ivory-100 placeholder:text-midnight-600 outline-none transition-colors resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-lg bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-midnight-950 font-semibold text-sm transition-all duration-200 shadow-goldGlow hover:shadow-none inline-flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? "Transmitting..." : "Send Message to Engineering Desk"}</span>
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Global CTA Banner */}
        <CtaBanner
          eyebrow="Turnkey Sizing Consultation"
          title="Looking for an Exact Battery Bank Quotation?"
          description="Submit your daily kilowatt-hour demand or electricity bill to our sizing engineers for an automated feasibility report."
          primaryCtaText="Launch Project Sizing"
          primaryCtaHref="/enquiry"
          secondaryCtaText="Inspect Hardware Matrix"
          secondaryCtaHref="/specifications"
        />
      </main>

      <Footer />
    </div>
  );
}
