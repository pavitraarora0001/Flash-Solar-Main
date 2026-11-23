import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { OpeningExperience } from "@/components/motion/opening-experience";
import { CinematicHero } from "@/components/motion/cinematic-hero";
import { EnergyChallengeSection } from "@/components/motion/energy-challenge-section";
import { DcArchitectureJourney } from "@/components/motion/dc-architecture-journey";
import { InteractiveProductShowcase } from "@/components/motion/interactive-product-showcase";
import { SolutionsSection } from "@/components/marketing/solutions-section";
import { EngineeringPerformance } from "@/components/motion/engineering-performance";
import { ApplicationsMotionSection } from "@/components/motion/applications-motion-section";
import { SpecificationsSection } from "@/components/marketing/specifications-section";
import { AboutSection } from "@/components/marketing/about-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { FinalCtaSection } from "@/components/motion/final-cta-section";
import { EnquirySection } from "@/components/marketing/enquiry-section";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-midnight-950 font-sans selection:bg-gold-500 selection:text-midnight-950 relative">
      {/* 1. Subtle opening experience on initial load */}
      <OpeningExperience />

      {/* 2. Premium sticky navigation with slim top information bar */}
      <Header />

      <main className="flex-1 flex flex-col">
        {/* 3. Cinematic Hero with slow background zoom & benchmark panel */}
        <CinematicHero />

        {/* 4. Section A — The Energy Challenge (Visual expansion & thermal loss audit) */}
        <EnergyChallengeSection />

        {/* 5. Section B — Direct-Current Architecture Journey (Interactive 5-stage energy flow) */}
        <DcArchitectureJourney />

        {/* 6. Section C — Interactive Product Showcase (Flash Power Wall, DC House, AC House) */}
        <InteractiveProductShowcase />

        {/* 7. Verified Offerings (Warm Ivory Transition) */}
        <SolutionsSection />

        {/* 8. Section D — Measurable Physical Engineering Performance KPIs */}
        <EngineeringPerformance />

        {/* 9. Section E — Applications & Deployment Topologies */}
        <ApplicationsMotionSection />

        {/* 10. Technical Specifications Matrix */}
        <SpecificationsSection />

        {/* 11. About Flash Solar & Engineering Philosophy */}
        <AboutSection />

        {/* 12. Verified Technical FAQs */}
        <FaqSection />

        {/* 13. Section G — Dramatic Final Call to Action */}
        <FinalCtaSection />

        {/* 14. Project Consultation & Technical Intake */}
        <EnquirySection />
      </main>

      {/* 15. Comprehensive Brand Footer */}
      <Footer />
    </div>
  );
}
