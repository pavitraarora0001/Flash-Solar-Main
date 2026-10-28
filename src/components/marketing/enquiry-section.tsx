"use client";

import * as React from "react";
import { Mail, Phone, Send, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";
import { z } from "zod";

const enquirySchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please provide a valid business or personal email."),
  phone: z.string().min(7, "Please provide a valid contact telephone number."),
  systemType: z.string().min(1, "Please select your primary system of interest."),
  message: z.string().min(10, "Please describe your project scope or load requirements (min 10 characters)."),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

export function EnquirySection() {
  const [formData, setFormData] = React.useState<EnquiryFormData>({
    fullName: "",
    email: "",
    phone: "",
    systemType: "Flash Power Wall Storage",
    message: "",
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof EnquiryFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = enquirySchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof EnquiryFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof EnquiryFormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Documented Integration Boundary:
    // Client-side validation succeeds. In local development without live Resend credentials,
    // we simulate a clean transition and display the transparent integration status.
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <section id="enquiry" className="bg-midnight-950 text-ivory-100 py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Context & Contact */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-midnight-800 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest">
              <Mail className="w-3.5 h-3.5 text-gold-400" />
              <span>Project Consultation</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-ivory-100 tracking-tight leading-tight">
              Request Technical Sizing & Engineering Consultation.
            </h2>

            <p className="text-sm sm:text-base text-ivory-400 leading-relaxed">
              Every solar and battery storage deployment has unique peak inductive loads, solar irradiation patterns, and voltage constraints. Submit your project requirements to review sizing validation directly with our engineering desk.
            </p>

            <div className="pt-4 space-y-3.5 text-sm text-ivory-300">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-gold-500 shrink-0" />
                <span>Strict privacy: No customer information is ever shared.</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold-500 shrink-0" />
                <span>Transparent mathematical load validation prior to quote finalization.</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-midnight-900 border border-midnight-700/80 space-y-2">
              <span className="text-xs font-mono text-gold-400 uppercase tracking-wider block">
                Direct Engineering Desk
              </span>
              <p className="text-xs text-ivory-400 leading-relaxed">
                For urgent commercial inquiries or multi-unit tenders, contact:
              </p>
              <p className="font-mono text-sm text-ivory-100 font-semibold">
                info@flashsolar.org
              </p>
            </div>
          </div>

          {/* Right Column: Accessible Form */}
          <div className="lg:col-span-7">
            <div className="bg-midnight-900 border border-midnight-700 p-8 sm:p-10 rounded-2xl shadow-2xl">
              {submitted ? (
                <div className="py-12 text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-700 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-ivory-100">
                    Enquiry Validated & Logged
                  </h3>
                  <p className="text-sm text-ivory-400 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{formData.fullName}</strong>. Your project specifications have been validated against our engineering intake requirements.
                  </p>
                  <div className="p-4 bg-midnight-950 rounded-lg border border-midnight-800 text-xs text-ivory-400 max-w-md mx-auto text-left font-mono space-y-1">
                    <span className="text-gold-400 font-semibold block mb-1">Architecture Intake Notice:</span>
                    <p>System: {formData.systemType}</p>
                    <p>Contact: {formData.email} / {formData.phone}</p>
                    <p className="text-[11px] text-ivory-400 pt-1">
                      (Development boundary: Live transactional dispatch via Resend API activates upon API key configuration in Module 3).
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        fullName: "",
                        email: "",
                        phone: "",
                        systemType: "Flash Power Wall Storage",
                        message: "",
                      });
                    }}
                    className="mt-4 px-5 py-2.5 rounded-md bg-midnight-800 text-ivory-200 hover:text-white text-xs font-semibold border border-midnight-700"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="fullName" className="block text-xs font-semibold text-ivory-300">
                        Full Name / Organization <span className="text-gold-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Elena Rostova"
                        className={`w-full px-4 py-2.5 rounded-md bg-midnight-950 border text-ivory-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 transition-colors ${
                          errors.fullName ? "border-red-500" : "border-midnight-700"
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.fullName}</span>
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="block text-xs font-semibold text-ivory-300">
                        Email Address <span className="text-gold-400">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="elena@domain.com"
                        className={`w-full px-4 py-2.5 rounded-md bg-midnight-950 border text-ivory-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 transition-colors ${
                          errors.email ? "border-red-500" : "border-midnight-700"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="block text-xs font-semibold text-ivory-300">
                        Telephone Number <span className="text-gold-400">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className={`w-full px-4 py-2.5 rounded-md bg-midnight-950 border text-ivory-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 transition-colors ${
                          errors.phone ? "border-red-500" : "border-midnight-700"
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>

                    {/* System of Interest */}
                    <div className="space-y-1.5">
                      <label htmlFor="systemType" className="block text-xs font-semibold text-ivory-300">
                        System of Interest <span className="text-gold-400">*</span>
                      </label>
                      <select
                        id="systemType"
                        value={formData.systemType}
                        onChange={(e) => setFormData({ ...formData, systemType: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-md bg-midnight-950 border border-midnight-700 text-ivory-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                      >
                        <option value="Flash Power Wall Storage">Flash Power Wall Storage</option>
                        <option value="Flash DC House (Pure DC Microgrid)">Flash DC House (Pure DC Microgrid)</option>
                        <option value="Flash AC House (Hybrid System)">Flash AC House (Hybrid System)</option>
                        <option value="Custom Inverter & Battery Bank Sizing">Custom Inverter & Battery Bank Sizing</option>
                        <option value="Commercial / Agricultural Project">Commercial / Agricultural Project</option>
                      </select>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-1.5">
                    <label htmlFor="message" className="block text-xs font-semibold text-ivory-300">
                      Project Details & Estimated Daily Load <span className="text-gold-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please mention your site location, primary appliances (fans, AC, refrigeration), and whether standard AC or direct DC is preferred..."
                      className={`w-full px-4 py-2.5 rounded-md bg-midnight-950 border text-ivory-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 transition-colors ${
                        errors.message ? "border-red-500" : "border-midnight-700"
                      }`}
                    />
                    {errors.message && (
                      <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-ivory-400">
                      Fields marked with <span className="text-gold-400">*</span> are required for sizing estimation.
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-md bg-gold-500 hover:bg-gold-600 text-midnight-950 font-semibold text-sm transition-all duration-200 shadow-goldGlow hover:shadow-none focus:outline-none focus:ring-2 focus:ring-gold-400"
                    >
                      {isSubmitting ? (
                        <span>Validating Parameters...</span>
                      ) : (
                        <>
                          <span>Submit Sizing Request</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

