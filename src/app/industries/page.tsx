import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBanner } from "@/components/shared/cta-banner";
import {
  Tractor,
  Radio,
  Building2,
  Home,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Industry Topologies & Deployment Environments",
  description:
    "Tailored direct-current and energy storage deployment architectures for agriculture, telecommunications towers, commercial manufacturing, and remote estates.",
};

const INDUSTRIES = [
  {
    id: "agriculture",
    title: "Agricultural Solar & Deep-Well Pumping",
    icon: Tractor,
    image: "/images/agricultural-solar.svg",
    subtitle: "Direct-Drive Solar Water Pumping & Cold Chain Storage",
    description:
      "Conventional agricultural pumping requires expensive diesel generator backups or high-loss AC inverters that trip under motor surge. Flash Solar utilizes direct-coupled DC solar controllers to drive brushless submersible pumps directly from solar arrays and battery banks without grid dependency.",
    benefits: [
      "Zero diesel fuel consumption for deep-well irrigation",
      "Direct DC variable frequency drive (VFD) compatibility",
      "Continuous night-time drip irrigation powered by Flash Power Wall",
      "Extreme thermal operating tolerance up to 55°C ambient",
    ],
    recommendedProduct: "Flash Power Wall 15kWh + DC House",
    productLink: "/products/flash-power-wall",
  },
  {
    id: "telecom",
    title: "Telecommunications & Remote Tower Sites",
    icon: Radio,
    image: "/images/dc-house.svg",
    subtitle: "Native 48V DC Uninterruptible Power Supply (UPS)",
    description:
      "Cell towers and microwave relay stations operate natively on 48V direct-current power. Interposing AC generators and rectifiers introduces multiple points of failure. Flash Solar connects directly to standard telecom DC power buses with zero conversion loss and CANBus remote telemetry.",
    benefits: [
      "Native 48V nominal voltage matching all standard telecom rectifiers",
      "Over 6,000 cycles with deep discharge capability",
      "Automated generator auto-start (AGS) reduction by 85%",
      "Remote Modbus & SNMP telemetry monitoring",
    ],
    recommendedProduct: "Flash Power Wall Parallel Racks",
    productLink: "/products/flash-power-wall",
  },
  {
    id: "commercial",
    title: "Commercial Facilities & Peak Demand Shaving",
    icon: Building2,
    image: "/images/commercial-facility.svg",
    subtitle: "Industrial Energy Management & Demand Charge Reduction",
    description:
      "Commercial enterprises pay substantial utility surcharges for 15-minute peak power spikes. Flash Container Storage buffers grid draw during peak factory operation, shaving maximum demand and providing instantaneous backup during grid outages.",
    benefits: [
      "Substantial reduction in utility peak demand charges",
      "Sub-20 millisecond automatic transfer for zero computer downtime",
      "Containerized modular scalability from 500 kWh to 10 MWh",
      "Factory acceptance tested with liquid or convection cooling",
    ],
    recommendedProduct: "Flash Container Storage 1MWh",
    productLink: "/products/flash-container-0537",
  },
  {
    id: "estates",
    title: "Remote Estates & Off-Grid Residences",
    icon: Home,
    image: "/images/ac-house.svg",
    subtitle: "Complete Energy Sovereignty for High-End Compounds",
    description:
      "For remote residential properties where grid connections are unreliable or cost-prohibitive, Flash Solar provides turnkey microgrids integrating solar PV, Flash Power Wall batteries, and intelligent load shedding for continuous luxury living.",
    benefits: [
      "100% off-grid independence with silence and zero emissions",
      "Touch-safe sub-60V residential electrical distribution",
      "Direct integration with geothermal heat pumps and HVAC",
      "Architectural champagne gold and midnight aesthetic",
    ],
    recommendedProduct: "Flash DC House Microgrid Architecture",
    productLink: "/products/flash-dc-house",
  },
];

export default function IndustriesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-midnight-950 font-sans selection:bg-gold-500 selection:text-midnight-950">
      <Header />

      <main className="flex-1">
        <PageHero
          eyebrow="Commercial & Industrial Deployments"
          title="Engineered Industry Topologies"
          subtitle="Precision clean energy architectures optimized for high-temperature agriculture, telecommunications towers, industrial peak shaving, and independent compounds."
          breadcrumbs={[{ label: "Industries" }]}
          primaryCta={{ label: "Request Industry Sizing", href: "/enquiry" }}
          secondaryCta={{ label: "Explore Spec Matrix", href: "/specifications" }}
          badgeText="Critical Infrastructure Standards"
          stats={[
            { label: "Operating Temp", value: "-20°C to +55°C", subtext: "Harsh environment tested" },
            { label: "Switch Time", value: "< 20 ms", subtext: "Zero flicker power transfer" },
            { label: "Diesel Reduction", value: "85%+", subtext: "In off-grid telecom and ag" },
            { label: "Warranty Standard", value: "10 Years", subtext: "Comprehensive manufacturer guarantee" },
          ]}
        />

        {/* Industry Cards Section */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {INDUSTRIES.map((ind, idx) => {
            const Icon = ind.icon;
            const isEven = idx % 2 === 0;

            return (
              <div
                key={ind.id}
                id={ind.id}
                className="bg-midnight-900 border border-midnight-700/80 rounded-2xl p-8 sm:p-12 shadow-elevated grid grid-cols-1 lg:grid-cols-12 gap-10 items-center scroll-mt-28"
              >
                {/* Content Col */}
                <div className={`lg:col-span-7 space-y-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-midnight-800 border border-gold-500/30 flex items-center justify-center text-gold-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono uppercase text-gold-400 tracking-wider block">
                        Deployment Topology
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ivory-100">
                        {ind.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-gold-400/90 font-mono">
                    {ind.subtitle}
                  </p>

                  <p className="text-sm text-ivory-300 leading-relaxed">
                    {ind.description}
                  </p>

                  <div className="space-y-2.5 pt-2">
                    {ind.benefits.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2.5 text-xs text-ivory-200">
                        <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-midnight-800 flex flex-wrap items-center gap-4">
                    <Link
                      href={`/enquiry?industry=${ind.id}`}
                      className="px-5 py-2.5 rounded-md bg-gold-500 hover:bg-gold-600 text-midnight-950 font-semibold text-xs transition-colors shadow-sm"
                    >
                      Request Sizing For This Industry
                    </Link>
                    <Link
                      href={ind.productLink}
                      className="text-xs text-gold-400 hover:text-gold-300 font-medium inline-flex items-center gap-1"
                    >
                      <span>Recommended: {ind.recommendedProduct}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Illustration Col */}
                <div className={`lg:col-span-5 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                  <div className="relative h-72 sm:h-80 w-full bg-midnight-950 rounded-xl border border-midnight-750 p-6 flex items-center justify-center overflow-hidden">
                    <Image
                      src={ind.image}
                      alt={ind.title}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Global CTA Banner */}
        <CtaBanner
          eyebrow="Commercial Engineering Evaluation"
          title="Have an Industrial or Multi-Site Project?"
          description="We collaborate with electrical contractors, telecom operators, and agricultural enterprises worldwide."
          primaryCtaText="Engage With Our Engineering Desk"
          primaryCtaHref="/enquiry"
          secondaryCtaText="Inspect Specifications"
          secondaryCtaHref="/specifications"
        />
      </main>

      <Footer />
    </div>
  );
}
