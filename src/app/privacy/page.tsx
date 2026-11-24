import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/shared/page-hero";
import { ShieldCheck, Lock, EyeOff, Server, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy & Telemetry Notice",
  description: "Official Flash Solar Privacy Policy regarding customer information, project sizing data, and privacy-first telemetry.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-midnight-950 font-sans selection:bg-gold-500 selection:text-midnight-950">
      <Header />

      <main className="flex-1">
        <PageHero
          eyebrow="Compliance & Data Governance"
          title="Privacy Policy & Telemetry Notice"
          subtitle="Flash Solar operates with a strict, privacy-first commitment to electrical data security, customer information protection, and encrypted telemetry."
          breadcrumbs={[{ label: "Privacy Policy" }]}
          primaryCta={{ label: "Contact Privacy Desk", href: "/contact" }}
          secondaryCta={{ label: "View Terms of Service", href: "/terms" }}
          badgeText="GDPR & Indian DPDP Aligned"
        />

        <article className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-ivory-300 text-sm leading-relaxed">
          <div className="p-6 rounded-2xl bg-midnight-900 border border-gold-500/30 flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-gold-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-base font-serif font-bold text-ivory-100">
                Privacy-First Architecture Commitment
              </h3>
              <p className="text-xs text-ivory-400 leading-relaxed">
                Flash Solar never sells, rents, or commercializes your personal details or energy usage telemetry to third parties, ad networks, or energy brokers.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-ivory-100">
              1. Information We Collect
            </h2>
            <p>
              When you submit inquiries, project sizing requests, or communicate with our engineering desk, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-ivory-400">
              <li>Contact details: Name, email address, telephone/WhatsApp number, company, city, and country.</li>
              <li>Project parameters: Estimated power requirements (kW), daily energy consumption (kWh), and application type.</li>
              <li>First-party telemetry: Page navigation interactions, anonymous device type, and referral paths to ensure website reliability.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-ivory-100">
              2. How Your Information Is Used
            </h2>
            <p>
              We process your submitted project data solely for:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-ivory-400">
              <li>Conducting electrical load modeling and generating single-line diagrams (SLD).</li>
              <li>Communicating formal quotations, datasheets, and engineering recommendations.</li>
              <li>Fulfilling equipment procurement, shipping, and warranty verification.</li>
              <li>Complying with statutory and electrical regulatory obligations.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-ivory-100">
              3. Data Security & Encryption
            </h2>
            <p>
              All customer records, database transactions, and file uploads are secured with 256-bit AES encryption in transit (HTTPS/TLS 1.3) and at rest. Access is restricted to authorized Flash Solar personnel via role-based access controls (RBAC) and audited session tokens.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-ivory-100">
              4. Contact Our Data Governance Desk
            </h2>
            <p>
              If you wish to inspect, update, or permanently delete any stored records, contact our privacy desk directly:
            </p>
            <div className="p-4 rounded-xl bg-midnight-900 border border-midnight-750 font-mono text-xs text-gold-400">
              Flash Solar Data Governance Desk<br />
              Email: info@flashsolar.org<br />
              Kaccha Talab, Kumher, Bharatpur - 321201 Rajasthan, India
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
