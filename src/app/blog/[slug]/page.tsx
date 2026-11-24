import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBanner } from "@/components/shared/cta-banner";
import { db } from "@/lib/db/store";
import { Calendar, Clock, User, ArrowLeft, ArrowRight, Share2, ShieldCheck, Zap } from "lucide-react";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = db.getBlogPosts();
  return posts.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = db.getBlogPostBySlug(params.slug);
  if (!post) return { title: "Article Not Found" };
  return {
    title: `${post.title} | Engineering Insights`,
    description: post.excerpt,
  };
}

export default function BlogPostReaderPage({ params }: BlogPostPageProps) {
  const post = db.getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const allPosts = db.getBlogPosts().filter((p) => p.slug !== post.slug && p.status === "PUBLISHED");
  const related = allPosts.slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-midnight-950 font-sans selection:bg-gold-500 selection:text-midnight-950">
      <Header />

      <main className="flex-1">
        {/* Page Hero */}
        <PageHero
          eyebrow="Flash Solar Engineering Publication"
          title={post.title}
          subtitle={post.excerpt}
          breadcrumbs={[
            { label: "Engineering Insights", href: "/blog" },
            { label: post.title },
          ]}
          primaryCta={{ label: "Consult the Authors", href: "/contact" }}
          secondaryCta={{ label: "Explore Direct-Current Hardware", href: "/products" }}
          badgeText="6 Min Read"
        />

        {/* Article Reader Body */}
        <article className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Metadata bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-midnight-800 text-xs text-ivory-400 font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-ivory-200">
                <User className="w-3.5 h-3.5 text-gold-400" />
                <span>{post.authorName || "Lead Electrical Architect"}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gold-400" />
                <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              </span>
            </div>

            <Link
              href="/blog"
              className="text-gold-400 hover:text-gold-300 transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Articles</span>
            </Link>
          </div>

          {/* Article Prose Content */}
          <div className="prose prose-invert max-w-none space-y-6 text-ivory-300 text-base leading-relaxed">
            {post.content ? (
              <div
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="space-y-6 [&>h2]:text-2xl [&>h2]:font-serif [&>h2]:font-bold [&>h2]:text-ivory-100 [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-serif [&>h3]:font-bold [&>h3]:text-ivory-200 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>blockquote]:border-l-2 [&>blockquote]:border-gold-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gold-300"
              />
            ) : (
              <p>{post.excerpt}</p>
            )}
          </div>

          {/* Author Callout Box */}
          <div className="bg-midnight-900 border border-gold-500/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 mt-12">
            <div className="w-16 h-16 rounded-full bg-midnight-800 border border-gold-500/40 flex items-center justify-center text-gold-400 shrink-0 text-xl font-serif font-bold">
              FS
            </div>
            <div className="space-y-1.5 text-center sm:text-left">
              <h4 className="text-base font-serif font-bold text-ivory-100">
                Flash Solar Engineering Research Desk
              </h4>
              <p className="text-xs text-ivory-400 leading-relaxed max-w-xl">
                Authored by the direct-current research group at Flash Solar. We design, prototype, and manufacture next-generation sub-60V electrical microgrids and solid-state LiFePO4 battery architectures.
              </p>
            </div>
          </div>

          {/* Related Articles */}
          {related.length > 0 && (
            <div className="pt-12 border-t border-midnight-800 space-y-6">
              <h3 className="text-xl font-serif font-bold text-ivory-100">
                Related Engineering Publications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/blog/${rel.slug}`}
                    className="p-5 rounded-xl bg-midnight-900 border border-midnight-700/80 hover:border-gold-500/40 transition-all duration-200 group block space-y-2"
                  >
                    <span className="text-[10px] font-mono text-gold-400 uppercase tracking-wider block">
                      Engineering Research
                    </span>
                    <h4 className="text-base font-serif font-bold text-ivory-100 group-hover:text-gold-400 transition-colors">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-ivory-400 line-clamp-2">
                      {rel.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Global CTA Banner */}
        <CtaBanner
          eyebrow="Thermodynamic Architecture Consultation"
          title="Apply These Principles to Your Next Project"
          description="Schedule a technical review with our electrical engineering team to conduct an inverter loss audit on your planned solar infrastructure."
          primaryCtaText="Schedule Technical Review"
          primaryCtaHref="/enquiry"
          secondaryCtaText="Explore Core Systems"
          secondaryCtaHref="/products"
        />
      </main>

      <Footer />
    </div>
  );
}
