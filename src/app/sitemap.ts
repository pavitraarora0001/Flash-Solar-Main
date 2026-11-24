import { MetadataRoute } from "next";
import { db } from "@/lib/db/store";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://flashsolar.org";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/engineering`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/specifications`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/solutions`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/industries`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/resources`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/enquiry`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/warranty`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];

  const products = db.getProducts().filter((p) => p.status === "PUBLISHED");
  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: new Date(p.updatedAt || now),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const categories = db.getProductCategories();
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/categories/${c.slug}`,
    lastModified: new Date(c.createdAt || now),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const blogPosts = db.getBlogPosts().filter((b) => b.status === "PUBLISHED");
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((b) => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: new Date(b.updatedAt || now),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...blogRoutes];
}
