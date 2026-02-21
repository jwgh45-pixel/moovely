"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { getLocationById, getPopularComparisons } from "@/data/locations";
import { compareLocations, formatCurrency } from "@/lib/calculations";

export default function PopularComparisons() {
  const popular = getPopularComparisons();

  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold text-charcoal mb-2 text-center">
        Popular Comparisons
      </h2>
      <p className="text-charcoal-muted text-center mb-8">
        See how the UK&apos;s most common mooves stack up.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {popular.map(({ from: fromId, to: toId }) => {
          const fromLoc = getLocationById(fromId);
          const toLoc = getLocationById(toId);
          if (!fromLoc || !toLoc) return null;

          const result = compareLocations(fromLoc, toLoc);
          const isPositive = result.totalAnnualDiff > 0;

          return (
            <Link
              key={`${fromId}-${toId}`}
              href={`/compare/${fromId}-vs-${toId}`}
              className="group bg-white rounded-2xl p-5 border border-grass-100 hover:border-grass-200 hover:shadow-lg hover:shadow-grass/5 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-charcoal">
                    {fromLoc.name}
                  </span>
                  <ArrowRight className="w-4 h-4 text-charcoal-muted" />
                  <span className="font-semibold text-charcoal">
                    {toLoc.name}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-charcoal-muted group-hover:text-grass group-hover:translate-x-1 transition-all" />
              </div>
              <div
                className={`flex items-center gap-1.5 text-sm font-medium ${
                  isPositive ? "text-better" : "text-worse"
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>
                  {formatCurrency(Math.abs(result.totalAnnualDiff))}/yr{" "}
                  {isPositive ? "better off" : "worse off"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
