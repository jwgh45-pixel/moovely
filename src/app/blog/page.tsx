import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { articles } from "@/data/articles";
import BrandMark from "@/components/BrandMark";

export const metadata: Metadata = {
  title: "Blog - Moovely | UK Relocation Insights & Data",
  description:
    "Data-driven guides on where to live in the UK. Real wages, cost of living comparisons, and honest analysis of which moves actually make financial sense.",
  openGraph: {
    title: "Moovely Blog - UK Relocation Insights",
    description:
      "Data-driven guides on the best (and worst) places to move in the UK.",
  },
};

const CATEGORY_STYLES = {
  data: "bg-brand-50 text-brand",
  guides: "bg-blue-50 text-blue-700",
  opinion: "bg-lime/10 text-lime-dark",
};

const CATEGORY_LABELS = {
  data: "Data",
  guides: "Guide",
  opinion: "Opinion",
};

export default function BlogPage() {
  const featured = articles.filter((a) => a.featured);
  const rest = articles.filter((a) => !a.featured);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <BrandMark size="md" className="mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-ink mb-3">
          The Moovely <span className="gradient-text">Blog</span>
        </h1>
        <p className="text-ink-muted max-w-xl mx-auto">
          Data-driven insights on where to live in the UK. No fluff, no
          sponsored listicles - just the numbers and what they mean for you.
        </p>
      </div>

      {/* Featured articles */}
      {featured.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {featured.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group bg-surface rounded-2xl border border-brand-100 p-6 hover:border-brand-200 hover:shadow-lg hover:shadow-brand/5 transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    CATEGORY_STYLES[article.category]
                  }`}
                >
                  {CATEGORY_LABELS[article.category]}
                </span>
                <span className="text-xs text-ink-muted flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readingTime} min read
                </span>
              </div>
              <h2 className="text-xl font-bold text-ink mb-2 group-hover:text-brand transition-colors">
                {article.title}
              </h2>
              <p className="text-sm text-ink-muted leading-relaxed mb-4">
                {article.description}
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand group-hover:gap-2.5 transition-all">
                Read article
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Rest of articles */}
      {rest.length > 0 && (
        <div className="space-y-4">
          {rest.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group flex items-center gap-4 bg-surface rounded-xl border border-brand-100 p-5 hover:border-brand-200 hover:shadow-md hover:shadow-brand/5 transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      CATEGORY_STYLES[article.category]
                    }`}
                  >
                    {CATEGORY_LABELS[article.category]}
                  </span>
                  <span className="text-xs text-ink-muted">
                    {article.readingTime} min
                  </span>
                </div>
                <h3 className="font-semibold text-ink group-hover:text-brand transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-ink-muted mt-1 hidden sm:block">
                  {article.description}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-ink-muted group-hover:text-brand group-hover:translate-x-1 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
