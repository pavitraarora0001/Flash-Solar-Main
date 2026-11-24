import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBanner } from "@/components/shared/cta-banner";
import { db } from "@/lib/db/store";
import { BookOpen, Calendar, Clock, User, ArrowRight, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Engineering Insights & Technical Articles",
  description:
    "In-depth electrical engineering research, thermodynamic analysis, battery degradation studies, and microgrid architecture insights from the Flash Solar engineering desk.",
};

export default function BlogPage() {
  const posts = db.getBlogPosts().filter((p) => p.status === "PUBLISHED");

  return (
    <div className="min-h-screen flex flex-col bg-midnight-950 font-sans selection:bg-gold-500 selection:text-midnight-950">
      <Header />

      <main className="flex-1">
        <PageHero
          eyebrow="Flash Solar Engineering Editorial"
          title="Engineering Insights & Whitepapers"
          subtitle="Rigorous electrical analyses, thermodynamic microgrid comparisons, and battery chemistry degradation studies authored by our electrical architects."
          breadcrumbs={[{ label: "Engineering Insights" }]}
          primaryCta={{ label: "Subscribe to Technical Bulletins", href: "/contact" }}
          secondaryCta={{ label: "View Architecture Guides", href: "/resources" }}
          badgeText="Peer-Reviewed Engineering"
          stats={[
            { label: "Focus Areas", value: "DC Microgrids", subtext: "Thermodynamic optimization" },
            { label: "Cell Studies", value: "LiFePO4", subtext: "Cycle life & degradation" },
            { label: "Safety Standard", value: "Sub-60V SELV", subtext: "Touch-safe design" },
            { label: "Publication Cadence", value: "Monthly", subtext: "Real field test data" },
          ]}
        />

        {/* Blog Post List */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-midnight-900 border border-midnight-700/80 hover:border-gold-500/40 rounded-2xl p-7 flex flex-col justify-between space-y-5 transition-all duration-300 group shadow-card hover:shadow-elevated hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs text-ivory-400">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gold-400" />
                      <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gold-400" />
                      <span>{6} min read</span>
                    </span>
                  </div>

                  <h2 className="text-xl font-serif font-bold text-ivory-100 group-hover:text-gold-400 transition-colors leading-snug">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-ivory-400 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-midnight-800 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs text-ivory-300">
                    <User className="w-3.5 h-3.5 text-gold-400" />
                    <span>{post.authorName || "Flash Solar Engineering"}</span>
                  </span>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Global CTA Banner */}
        <CtaBanner
          eyebrow="Engineering Research Collaboration"
          title="Interested in Co-Authoring or Technical Peer Review?"
          description="Flash Solar collaborates with electrical engineering faculties, energy researchers, and microgrid innovators worldwide."
          primaryCtaText="Contact Research Desk"
          primaryCtaHref="/contact"
          secondaryCtaText="Explore Technical Resources"
          secondaryCtaHref="/resources"
        />
      </main>

      <Footer />
    </div>
  );
}
