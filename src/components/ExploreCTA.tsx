import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";
import BrandMark from "./BrandMark";

export default function ExploreCTA() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-lime/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Compass className="w-5 h-5 text-brand-200" />
              <span className="text-brand-200 text-sm font-medium uppercase tracking-wider">
                New
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Don&apos;t know where to move?
            </h2>
            <p className="text-brand-200 leading-relaxed mb-6">
              Pick where you live, and we&apos;ll rank every location in the UK by
              how much better off you&apos;d be. Your personalised league table of
              greener pastures.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-dark rounded-xl font-semibold hover:bg-brand-50 transition-colors"
            >
              Explore All Locations
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <BrandMark verdict="greener" size="xl" className="shrink-0" />
        </div>
      </div>
    </section>
  );
}
