import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/marketing/hero";
import { SolutionsSection } from "@/components/marketing/solutions-section";
import { DcEngineeringSection } from "@/components/marketing/dc-engineering-section";
import { SpecificationsSection } from "@/components/marketing/specifications-section";
import { ApplicationsSection } from "@/components/marketing/applications-section";
import { AboutSection } from "@/components/marketing/about-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { EnquirySection } from "@/components/marketing/enquiry-section";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-midnight-950 font-sans selection:bg-gold-500 selection:text-midnight-950">
      {/* 1. Header with Slim Top Bar & Sticky Nav */}
      <Header />

      <main className="flex-1 flex flex-col">
        {/* 2. Cinematic Hero Section with Benchmark Panel */}
        <Hero />

        {/* 3. Core Systems Anchor */}
        <div id="core-systems" />

        {/* 4. Engineered Power Solutions Section (Warm Ivory Transition) */}
        <SolutionsSection />

        {/* 5. DC Engineering & Architecture Deep Dive */}
        <DcEngineeringSection />

        {/* 6. Technical Specifications Matrix */}
        <SpecificationsSection />

        {/* 7. Applications & Technical Resources */}
        <ApplicationsSection />

        {/* 8. About Flash Solar & Engineering Philosophy */}
        <AboutSection />

        {/* 9. Verified Technical FAQs */}
        <FaqSection />

        {/* 10. Project Consultation & Technical Intake */}
        <EnquirySection />
      </main>

      {/* 11. Comprehensive Brand Footer */}
      <Footer />
    </div>
  );
}
