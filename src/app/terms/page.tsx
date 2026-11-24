import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/shared/page-hero";
import { FileText, ShieldCheck, Scale, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service & Engineering Agreement",
  description: "Official Flash Solar Terms of Service, procurement terms, and electrical engineering installation standards.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-midnight-950 font-sans selection:bg-gold-500 selection:text-midnight-950">
      <Header />

      <main className="flex-1">
        <PageHero
          eyebrow="Commercial & Engineering Terms"
          title="Terms of Service & Procurement Standards"
          subtitle="Legal and technical conditions governing the procurement of Flash Solar hardware, engineering consultation, and installation safety standards."
          breadcrumbs={[{ label: "Terms of Service" }]}
          primaryCta={{ label: "Contact Legal Desk", href: "/contact" }}
          secondaryCta={{ label: "View Warranty Policy", href: "/warranty" }}
          badgeText="Commercial Framework 2026"
        />

        <article className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-ivory-300 text-sm leading-relaxed">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-ivory-100">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing the website at <strong className="text-gold-400">flashsolar.org</strong>, submitting sizing inquiries, or procuring Flash Solar hardware, you agree to be bound by these Terms of Service, applicable electrical safety regulations, and our Privacy Policy.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-ivory-100">
              2. Electrical Engineering & Installation Responsibilities
            </h2>
            <p>
              Flash Solar manufactures high-performance direct-current energy storage hardware and supplies conceptual electrical Single-Line Diagrams (SLD). The purchasing client, system integrator, or licensed electrical contractor remains responsible for:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-ivory-400">
              <li>Ensuring physical installation complies with local electrical codes, building regulations, and utility interconnection rules.</li>
              <li>Employing certified electrical technicians for all high-current DC busbar terminations and breaker installations.</li>
              <li>Maintaining environmental ventilation within rated operating temperature parameters (-20°C to +55°C).</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-ivory-100">
              3. Quotations & Technical Sizing Estimates
            </h2>
            <p>
              Any energy sizing calculations, kilowatt-hour estimates, or preliminary cost schedules issued through flashsolar.org are provided for initial planning purposes. Final commercial pricing and binding delivery schedules require an authorized formal engineering proposal.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-ivory-100">
              4. Limitation of Liability
            </h2>
            <p>
              Flash Solar shall not be liable for incidental, indirect, or consequential damages resulting from unauthorized physical modification of battery enclosures, non-compliant third-party inverters, bypass of the integrated Battery Management System (BMS), or improper installation.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-ivory-100">
              5. Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms and any procurement disputes shall be governed by and construed in accordance with the laws of India, with exclusive jurisdiction resting in the competent courts of Bharatpur/Jaipur, Rajasthan.
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
